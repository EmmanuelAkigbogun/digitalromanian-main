import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './ServiciiHero.scss'

function ServiciiHero() {
  const { lang } = useLanguage()
  const translatedAnchors = t('services_page.anchors', lang)
  const anchors = Array.isArray(translatedAnchors)
    ? translatedAnchors
    : [
      { href: '#software', label: 'Software' },
      { href: '#website', label: 'Website & eCommerce' },
      { href: '#branding', label: 'UX/UI & Branding' },
      { href: '#automation', label: 'Automation & AI' },
    ]

  return (
    <section className="dr-servicii-hero">
      <div className="dr-servicii-hero-inner">
        <h1>
          {t('services_page.hero_title', lang)}
          <span> {t('services_page.hero_subtitle', lang)}</span>
        </h1>

        <p className="dr-servicii-sub">
          {t('services_page.hero_desc', lang)}
        </p>

        <div className="dr-servicii-anchors">
          {anchors.map((anchor) => (
            <a key={anchor.href} href={anchor.href}>
              {anchor.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServiciiHero
