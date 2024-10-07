import { useState, useEffect } from 'react'
import translate from 'translate'
import { languages } from './lib'
import './App.css'

export const App = () => {
  const [value, setValue] = useState('')
  const [initLanguage, setInitLanguage] = useState('en')
  const [targetLanguages, setTargetLanguages] = useState<string[]>(['it', 'es'])
  const [translations, setTranslations] = useState<{ [key: string]: string }>(
    targetLanguages.reduce(
      (acc: { [key: string]: string }, language: string) => {
        acc[language] = ''
        return acc
      },
      {},
    ),
  )
  const [loading, setLoading] = useState(false)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
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
      setTranslations((prev) => ({ ...prev, [newLang]: '' }))
    }
  }

  return (
    <div className="container">
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
      {Object.entries(translations).map(([lang, translatedText]) => (
        <div className="language-block" key={lang}>
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
          <div>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <textarea value={translatedText} readOnly />
            )}
          </div>
        </div>
      ))}
      <button onClick={() => handleAddLanguage('fr')}>Add French</button>
      <button onClick={() => handleAddLanguage('ru')}>Add Russian</button>
    </div>
  )
}
