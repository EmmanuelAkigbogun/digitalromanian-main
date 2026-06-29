import { useLanguage } from '../context/useLanguage'
import { t } from '../lib/i18n'
import './PrivacyPolicy.scss'

export default function PrivacyPolicy() {
  const { lang } = useLanguage()
  const sections = t('privacy.sections', lang)

  return (
    <main className="dr-legal-page">
      <section className="dr-legal-shell">
        <h1>{t('privacy.title', lang)}</h1>
        <p className="dr-legal-updated">{t('privacy.updated', lang)}</p>

        {(Array.isArray(sections) ? sections : []).map((section) => (
          <div key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.items?.length > 0 && (
              <ul>
                {section.items.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}</strong>
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    </main>
  )
}
