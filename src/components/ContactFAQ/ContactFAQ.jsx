import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './ContactFAQ.scss'

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState(2)
  const { lang } = useLanguage()
  const faqs = t('contact.faqs', lang)

  return (
    <section className="dr-contact-faq">
      <div className="dr-contact-faq-header">
        <h2>
          {t('contact.faq_title', lang)}
          <span> {t('contact.faq_subtitle', lang)}</span>
        </h2>
      </div>

      <div className="dr-faq-list">
        {faqs.map((faq, index) => (
          <div
            className={`dr-faq-item ${openIndex === index ? 'is-open' : ''}`}
            key={faq.q}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
              aria-controls={`contact-faq-${index}`}
            >
              {faq.q}
              <ChevronDown size={20} aria-hidden="true" />
            </button>

            {openIndex === index && (
              <p id={`contact-faq-${index}`}>
                <span>{faq.a}</span>
                {faq.linkLabel && faq.linkHref && (
                  faq.linkHref.startsWith('http') ? (
                    <a href={faq.linkHref} target="_blank" rel="noreferrer"> {faq.linkLabel}</a>
                  ) : (
                    <Link to={faq.linkHref}> {faq.linkLabel}</Link>
                  )
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
