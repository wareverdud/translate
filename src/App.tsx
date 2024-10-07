import { useState, useEffect } from 'react'
import translate from 'translate'
import { languages } from './lib'
import trashIcon from './assets/trash.svg'
import './App.css'

export const App = () => {
  const [value, setValue] = useState('')
  const [initLanguage, setInitLanguage] = useState('en')
  const [targetLanguages, setTargetLanguages] = useState<string[]>(['it'])
  const [loading, setLoading] = useState(false)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  )
  const [translations, setTranslations] = useState<{ [key: string]: string }>(
    targetLanguages.reduce(
      (acc: { [key: string]: string }, language: string) => {
        acc[language] = ''
        return acc
      },
      {},
    ),
  )

  const handleTranslate = async (
    text: string,
    options: { from: string; to: string },
  ) => {
    const result = await translate(text, options)
    return result
  }

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    const newTimeout = setTimeout(async () => {
      if (value.trim()) {
        setLoading(true)
        const newTranslations: { [key: string]: string } = {}

        for (const lang of targetLanguages) {
          const translatedText = await handleTranslate(value, {
            from: initLanguage,
            to: lang,
          })
          newTranslations[lang] = translatedText
        }

        setTranslations(newTranslations)
        setLoading(false)
      } else {
        setTranslations(
          targetLanguages.reduce(
            (acc: { [key: string]: string }, language: string) => {
              acc[language] = ''
              return acc
            },
            {},
          ),
        )
      }
    }, 500)

    setDebounceTimeout(newTimeout)

    return () => clearTimeout(newTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, initLanguage, targetLanguages])

  const handleAddLanguage = (newLang: string) => {
    if (!targetLanguages.includes(newLang)) {
      setTargetLanguages((prev) => [...prev, newLang])
    }
  }

  const handleDeleteLanguage = (lang: string) => {
    if (targetLanguages.includes(lang)) {
      setTargetLanguages((prev) => prev.filter((l) => l !== lang))
    }
  }

  return (
    <>
      <div className="header">
        <select onChange={(e) => handleAddLanguage(e.target.value)}>
          {languages.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="source">
        <div className="language-block">
          <select
            onChange={(e) => setInitLanguage(e.target.value)}
            value={initLanguage}
          >
            {languages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Enter your text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
      <div className="container">
        {Object.entries(translations).map(([lang, translatedText]) => (
          <div className="language-block" key={lang}>
            <div className="action">
              <select
                value={lang}
                onChange={(e) => handleAddLanguage(e.target.value)}
              >
                {languages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <img
                className="trashIcon"
                src={trashIcon}
                alt="Trash Icon"
                onClick={() => handleDeleteLanguage(lang)}
              />
            </div>

            <div>
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <textarea value={translatedText} readOnly />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
