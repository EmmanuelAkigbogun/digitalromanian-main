import { useState } from 'react'
import { Send } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './ContactForm.scss'

export default function ContactForm({ endpoint, source }) {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { lang } = useLanguage()
  const services = t('contact.form_services', lang)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(event.currentTarget)

    const payload = {
      source,
      name: formData.get('name'),
      email: formData.get('email'),
      service: formData.get('service'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error()

      setSent(true)
    } catch {
      setError(t('contact.form_error', lang))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={`dr-contact-form-card ${sent ? 'is-sent' : ''}`}>
      {!sent ? (
        <>
          <h2>{t('contact.form_title', lang)}</h2>

          <form onSubmit={handleSubmit}>
            <label>
              {t('contact.form_name', lang)}
              <input name="name" type="text" required />
            </label>

            <label>
              {t('contact.form_email', lang)}
              <input name="email" type="email" required />
            </label>

            <label>
              {t('contact.form_service', lang)}
              <select name="service" required defaultValue="">
                <option value="" disabled>
                  {t('contact.form_service_placeholder', lang)}
                </option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t('contact.form_phone', lang)}
              <input name="phone" type="tel" />
            </label>

            <label className="dr-contact-message">
              {t('contact.form_message', lang)}
              <textarea name="message" required rows="5" />
            </label>

            {error && <p className="dr-form-error">{error}</p>}

            <button type="submit" disabled={submitting}>
              {submitting ? t('contact.form_sending', lang) : t('contact.form_submit', lang)}
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
        </>
      ) : (
        <div className="dr-contact-thanks">
          <div className="dr-contact-plane-stage" aria-hidden="true">
            <div className="dr-contact-plane">
              <Send size={30} aria-hidden="true" />
            </div>
            <div className="dr-contact-plane-trail" />
          </div>

          <h2>{t('contact.form_sent', lang)}</h2>
          <p>{t('contact.form_sent_desc', lang)}</p>
        </div>
      )}
    </section>
  )
}
