import { createContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

const LANGS = ['ro', 'en', 'de']
const DEFAULT_LANG = 'ro'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const storedLang = localStorage.getItem('lang')
    return LANGS.includes(storedLang) ? storedLang : DEFAULT_LANG
  })
  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, LANGS }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext
