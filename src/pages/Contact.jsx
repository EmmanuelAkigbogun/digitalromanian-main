import ContactForm from '../components/ContactForm/ContactForm'
import ContactFAQ from '../components/ContactFAQ/ContactFAQ'
import NewsletterSection from '../components/NewsletterSection/NewsletterSection'
import { useLanguage } from '../context/useLanguage'
import { apiEndpoint } from '../lib/api'
import { t } from '../lib/i18n'
import './Contact.scss'

export default function Contact() {
  const { lang } = useLanguage()

  return (
    <main className="dr-contact-page">
      <section className="dr-contact-hero">
        <div className="dr-contact-copy">
          <h1>
            {t('contact.hero_title', lang)}
            <span> {t('contact.hero_subtitle', lang)}</span>
          </h1>

          <p>{t('contact.hero_desc', lang)}</p>

          <div className="dr-contact-info">
            <a href="mailto:contact@digitalromanian.com">
              <small>{t('contact.email_us', lang)}</small>
              <strong>contact@digitalromanian.com</strong>
            </a>
          </div>
        </div>

        <ContactForm
          endpoint={apiEndpoint('/contact')}
          source="contact-page"
        />
      </section>

      <ContactFAQ />
      <NewsletterSection />
    </main>
  )
}
