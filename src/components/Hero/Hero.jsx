import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import card1Dark from '../../assets/hero-cards/1-dark.svg'
import card2Dark from '../../assets/hero-cards/2-dark.svg'
import card3Dark from '../../assets/hero-cards/3-dark.svg'
import card4Dark from '../../assets/hero-cards/4-dark.svg'
import card5Dark from '../../assets/hero-cards/5-dark.svg'
import card1Light from '../../assets/hero-cards/1-light.svg'
import card2Light from '../../assets/hero-cards/2-light.svg'
import card3Light from '../../assets/hero-cards/3-light.svg'
import card4Light from '../../assets/hero-cards/4-light.svg'
import card5Light from '../../assets/hero-cards/5-light.svg'
import './Hero.scss'

function Hero() {
  const [isLight, setIsLight] = useState(false)
  const { lang } = useLanguage()

  useEffect(() => {
    function updateTheme() {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsLight(theme === 'light')
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="dr-hero" id="home-hero">
      <div className="dr-hero-bg" aria-hidden="true">
        <div className="dr-hero-gradient dr-g1" />
        <div className="dr-hero-gradient dr-g2" />
        <div className="dr-hero-gradient dr-g3" />
        <div className="dr-hero-grid" />
        <div className="dr-hero-noise" />
        <div className="dr-hero-radial" />
      </div>

      <div className="dr-hero-shell">
        <div className="dr-hero-copy">
          <h1>
            {t('hero.heading.main', lang)}
            <span>{t('hero.heading.highlight', lang)}</span>
          </h1>

          <p className="dr-hero-sub">{t('hero.description', lang)}</p>

          <div className="dr-hero-proof-row" aria-label={t('common.benefits_label', lang)}>
            {t('hero.benefits', lang).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="dr-hero-cta">
            <Link
              className="dr-btn dr-btn-primary"
              to="/consultanta?service=website&source=hero"
            >
              {t('hero.cta_discussion', lang)}
            </Link>

            <Link className="dr-btn dr-btn-secondary" to="/portofoliu">
              {t('hero.cta_portfolio', lang)}
            </Link>
          </div>
        </div>

        <div className="dr-hero-visual" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((cardNumber) => {
            const src = isLight
              ? (
                  cardNumber === 1 ? card1Light :
                  cardNumber === 2 ? card2Light :
                  cardNumber === 3 ? card3Light :
                  cardNumber === 4 ? card4Light :
                  card5Light
                )
              : (
                  cardNumber === 1 ? card1Dark :
                  cardNumber === 2 ? card2Dark :
                  cardNumber === 3 ? card3Dark :
                  cardNumber === 4 ? card4Dark :
                  card5Dark
                )

            return (
              <span
                key={cardNumber}
                className={`dr-wire-card dr-wire-card-${cardNumber}`}
              >
                <img
                  src={src}
                  alt=""
                  decoding="async"
                  draggable="false"
                />
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Hero
