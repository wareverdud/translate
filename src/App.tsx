import { useState, useEffect } from 'react'
import translate from 'translate'
import { Select } from 'antd'
import { languageNames, languages } from './lib'
import './App.css'

export const App = () => {
  const [value, setValue] = useState('')
  const [initLanguage, setInitLanguage] = useState(
    localStorage.getItem('initLanguage') || 'en',
  )
  const [targetLanguages, setTargetLanguages] = useState<string[]>(
    JSON.parse(localStorage.getItem('targetLanguages') || '[]'),
  )
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

  useEffect(() => {
    localStorage.setItem('initLanguage', initLanguage)
  }, [initLanguage])

  useEffect(() => {
    localStorage.setItem('targetLanguages', JSON.stringify(targetLanguages))
  }, [targetLanguages])

  const handleChange = (value: string[]) => setTargetLanguages(value)

  const handleSpeak = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    window.speechSynthesis.speak(utterance)
  }

  return (
    <>
      <div className="source">
        <div className="language-block">
          <Select
            style={{
              color: '#fff',
              fontFamily:
                'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
              fontSize: 'large',
            }}
            dropdownStyle={{ backgroundColor: '#2a2a2a', color: 'white' }}
            showSearch
            placeholder="Select a source language"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={languages.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
            defaultValue={initLanguage}
            onChange={(e) => setInitLanguage(e as unknown as string)}
          />
          <textarea
            placeholder="Enter your text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={() => handleSpeak(value, initLanguage)}>
            🔊 Speak
          </button>
        </div>
      </div>
      <div className="header">
        <Select
          mode="multiple"
          allowClear
          style={{
            width: '100%',
            color: '#fff',
            fontFamily:
              'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
            fontSize: 'large',
          }}
          dropdownStyle={{ backgroundColor: '#2a2a2a', color: 'white' }}
          placeholder="Select target languages"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          onChange={handleChange}
          value={targetLanguages}
          options={languages.map((item) => ({
            value: item.id,
            label: item.label,
          }))}
        />
      </div>
      <div className="container">
        {Object.entries(translations).map(([lang, translatedText]) => (
          <div className="language-block" key={lang}>
            <h3>{languageNames.get(lang)}</h3>
            <div>
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <textarea value={translatedText} readOnly />
              )}
            </div>
            {!loading && (
              <button onClick={() => handleSpeak(translatedText, lang)}>
                🔊 Speak
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
