import { useState, useEffect } from 'react'
import translate from 'translate'
import { languages } from './lib'
import './App.css'

export const App = () => {
  const [value, setValue] = useState('')
  const [initLanguage, setInitLanguage] = useState('en')
  const [translation, setTranslation] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('it')
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
        const translatedText = await handleTranslate(value, {
          from: initLanguage,
          to: targetLanguage,
        })
        setTranslation(translatedText)
        setLoading(false)
      } else {
        setTranslation('')
      }
    }, 500)

    setDebounceTimeout(newTimeout)

    return () => clearTimeout(newTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, initLanguage, targetLanguage])

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
          onChange={(e) => {
            if (
              e.target.value.trim() !== ' ' ||
              e.target.value.trim() !== '\n'
            ) {
              setValue(e.target.value)
            }
          }}
        />
      </div>
      <div className="language-block">
        <select
          onChange={(e) => setTargetLanguage(e.target.value)}
          value={targetLanguage}
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
            <textarea value={translation} readOnly />
          )}
        </div>
      </div>
    </div>
  )
}
