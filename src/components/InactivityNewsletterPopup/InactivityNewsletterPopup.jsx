import { useEffect, useMemo, useState } from 'react'
import { X, Send } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { apiEndpoint } from '../../lib/api'
import { t } from '../../lib/i18n'
import './InactivityNewsletterPopup.scss'

const DEFAULT_STORAGE_KEY = 'dr-portfolio-newsletter-popup-dismissed'

export default function InactivityNewsletterPopup({
  inactivityMs = 30000,
  storageKey = DEFAULT_STORAGE_KEY,
  source = 'portfolio-inactivity-popup',
}) {
  const { lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const canOpen = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(storageKey) !== '1'
  }, [storageKey])

  useEffect(() => {
    if (!canOpen) return undefined

    let timeoutId = window.setTimeout(() => setOpen(true), inactivityMs)

    const resetTimer = () => {
      if (open) return
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => setOpen(true), inactivityMs)
    }

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart']
    events.forEach((eventName) => window.addEventListener(eventName, resetTimer, { passive: true }))

    return () => {
      window.clearTimeout(timeoutId)
      events.forEach((eventName) => window.removeEventListener(eventName, resetTimer))
    }
  }, [canOpen, inactivityMs, open])

  const closePopup = () => {
    setOpen(false)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, '1')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email || !accepted) return

    setSending(true)
    setError('')

    try {
      const response = await fetch(apiEndpoint('/newsletter'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, accepted, source, lang }),
      })

      if (!response.ok) {
        throw new Error('Newsletter signup failed')
      }

      setSent(true)
      window.setTimeout(() => closePopup(), 1400)
    } catch {
      setError(t('resources.newsletter_error', lang))
    } finally {
      setSending(false)
    }
  }

  if (!open) return null

  return (
    <div className="dr-inactivity-popup-overlay" role="dialog" aria-modal="true" aria-label={t('popup.newsletter_title', lang)}>
      <div className="dr-inactivity-popup-box">
        <button type="button" className="dr-inactivity-popup-close" onClick={closePopup} aria-label={t('common.close', lang)}>
          <X size={16} aria-hidden="true" />
        </button>

        <h3>{t('popup.newsletter_title', lang)}</h3>
        <p>{t('popup.newsletter_desc', lang)}</p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="dr-inactivity-popup-form">
            <input
              type="email"
              placeholder={t('resources.newsletter_email_placeholder', lang)}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                required
              />
              <span>{t('resources.newsletter_consent', lang)}</span>
            </label>

            <button type="submit" disabled={sending}>
              {sending ? t('resources.newsletter_sending', lang) : t('resources.newsletter_subscribe', lang)}
              <Send size={16} aria-hidden="true" />
            </button>

            {error && <p className="dr-inactivity-popup-error">{error}</p>}
          </form>
        ) : (
          <p className="dr-inactivity-popup-success">{t('resources.newsletter_sent', lang)}</p>
        )}
      </div>
    </div>
  )
}
