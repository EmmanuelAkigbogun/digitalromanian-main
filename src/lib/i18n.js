import de from '../locales/de.json'
import en from '../locales/en.json'
import ro from '../locales/ro.json'

const translations = { de, en, ro }

export function t(key, lang = 'ro') {
  const get = (obj, path) => path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj)
  return get(translations[lang], key) || get(translations.en, key) || get(translations.ro, key) || key
}
