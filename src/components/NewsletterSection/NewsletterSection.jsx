import { Fragment, useState } from 'react'
import { Send } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { apiEndpoint } from '../../lib/api'
import { t } from '../../lib/i18n'
import './NewsletterSection.scss'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { lang } = useLanguage()
  const newsletterTitle = t('resources.newsletter_title', lang).split('\n')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email || !accepted) return

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(apiEndpoint('/newsletter'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          accepted,
          source: 'newsletter-section',
          lang,
        }),
      })

      if (!response.ok) {
        throw new Error('Newsletter signup failed')
      }

      setSent(true)
    } catch {
      setError(t('resources.newsletter_error', lang))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={`dr-newsletter ${sent ? 'is-sent' : ''}`}>
      <div className="dr-newsletter-shell">
        <div className="dr-newsletter-copy">
          <h2>
            {newsletterTitle.map((line, index) => (
              <Fragment key={`${line}-${index}`}>
                {line}
                {index < newsletterTitle.length - 1 && <br />}
              </Fragment>
            ))}
          </h2>

          <p>{t('resources.newsletter_desc', lang)}</p>
        </div>

        <div className="dr-newsletter-action">
          <div className="dr-plane-stage" aria-hidden="true">
            <div className="dr-plane">
              <Send size={42} aria-hidden="true" />
            </div>
            <div className="dr-plane-trail" />
          </div>

          {!sent ? (
            <form className="dr-newsletter-form" onSubmit={handleSubmit}>
              <label>
                {t('resources.newsletter_email', lang)}
                <input
                  type="email"
                  placeholder={t('resources.newsletter_email_placeholder', lang)}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label className="dr-newsletter-consent">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  required
                />
                <span>
                  {t('resources.newsletter_consent', lang)}
                </span>
              </label>

              <button type="submit" disabled={submitting}>
                {submitting
                  ? t('resources.newsletter_sending', lang)
                  : t('resources.newsletter_subscribe', lang)}
                <Send size={17} aria-hidden="true" />
              </button>

              {error && <p className="dr-form-error">{error}</p>}
            </form>
          ) : (
            <div className="dr-newsletter-thanks">
              <h3>{t('resources.newsletter_sent', lang)}</h3>
              <p>{t('resources.newsletter_sent_desc', lang)}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
