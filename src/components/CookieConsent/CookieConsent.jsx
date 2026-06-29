import { useEffect, useState } from 'react'
import { Cookie } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './CookieConsent.scss'

const STORAGE_KEY = 'dr-cookie-consent'

export default function CookieConsent() {
  const { lang } = useLanguage()
  const hasStoredConsent = () => Boolean(window.localStorage.getItem(STORAGE_KEY))

  const [visible, setVisible] = useState(() => {
    return false
  })
  const [minified, setMinified] = useState(() => hasStoredConsent())

  useEffect(() => {
    if (hasStoredConsent()) return undefined

    const timer = window.setTimeout(() => {
      setVisible(true)
    }, 2800)

    return () => window.clearTimeout(timer)
  }, [])

  function saveConsent(value) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        value,
        date: new Date().toISOString(),
      })
    )
    setMinified(true)
    setVisible(false)
  }

  function handleExpand() {
    setVisible(true)
    setMinified(false)
  }

  if (minified) {
    return (
      <button
        className="dr-cookie-minified"
        aria-label={t('cookie.settings_label', lang)}
        onClick={handleExpand}
        type="button"
      >
        <Cookie size={30} aria-hidden="true" />
      </button>
    )
  }

  if (!visible) return null

  return (
    <div className="dr-cookie-banner" role="dialog" aria-live="polite">
      <div className="dr-cookie-content">
        <span>{t('cookie.title', lang)}</span>
        <p>{t('cookie.necessary_desc', lang)}</p>

        <p>{t('cookie.analytics_desc', lang)}</p>

        <Link to="/politica-de-confidentialitate">
          {t('cookie.privacy_link', lang)}
        </Link>
      </div>
      <div className="dr-cookie-actions">
        <button type="button" onClick={() => saveConsent('rejected')}>
          {t('cookie.reject', lang)}
        </button>
        <button type="button" className="is-primary" onClick={() => saveConsent('accepted')}>
          {t('cookie.accept', lang)}
        </button>
      </div>
    </div>
  )
}
