import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import blogDark from '../../assets/hero-r/blog.svg'
import blogLight from '../../assets/hero-r/blog-light.svg'
import './ResourcesHero.scss'

export default function ResourcesHero() {
  const [isLightTheme, setIsLightTheme] = useState(
    document.documentElement.getAttribute('data-theme') === 'light'
  )
  const { lang } = useLanguage()

  useEffect(() => {
    const root = document.documentElement

    function syncTheme() {
      setIsLightTheme(root.getAttribute('data-theme') === 'light')
    }

    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

    return () => observer.disconnect()
  }, [])

  function moveLantern(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--lantern-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--lantern-y', `${event.clientY - rect.top}px`)
  }

  const visibleIcon = isLightTheme ? blogDark : blogLight
  const revealIcon = isLightTheme ? blogLight : blogDark

  return (
    <section className="dr-res-hero">
      <div className="dr-res-hero-shell">
        <div className="dr-res-hero-copy">
          <h1>
            {t('resources.hero_title', lang)}
            <span>{t('resources.hero_subtitle', lang)}</span>
          </h1>

          <p>{t('resources.hero_desc', lang)}</p>

          <div className="dr-res-hero-proof" aria-label={t('common.benefits_label', lang)}>
            {t('resources.hero_benefits', lang).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="dr-res-hero-actions">
            <a className="dr-res-hero-btn dr-res-hero-btn-primary" href="#resurse-ghiduri">
              {t('resources.hero_cta_explore', lang)}
            </a>

            {/* Ebook CTA paused until the ebook section returns. */}
            {/* <a className="dr-res-hero-btn dr-res-hero-btn-secondary" href="#resurse-ebookuri">
              {t('resources.hero_cta_ebooks', lang)}
            </a> */}
          </div>
        </div>

        <div className="dr-res-hero-visual" aria-hidden="true">
          <div
            className="dr-res-icon-wrapper"
            onPointerEnter={moveLantern}
            onPointerMove={moveLantern}
          >
            <span className="dr-res-icon-glow" />
            <img className="dr-res-icon dr-res-icon-default" src={visibleIcon} alt="" width="1080" height="1350" decoding="async" />
            <img className="dr-res-icon dr-res-icon-hover" src={revealIcon} alt="" width="1080" height="1350" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  )
}
