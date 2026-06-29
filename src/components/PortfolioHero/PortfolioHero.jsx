import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './PortfolioHero.scss'

export default function PortfolioHero() {
  const { lang } = useLanguage()

  return (
    <section className="dr-portfolio-hero">
      <div className="dr-portfolio-hero-shell">
        <h1>
          {t('portfolio.hero_title_main', lang)}
          <span> {t('portfolio.hero_title_highlight', lang)}</span>
        </h1>

        <p>{t('portfolio.hero_desc', lang)}</p>
      </div>
    </section>
  )
}
