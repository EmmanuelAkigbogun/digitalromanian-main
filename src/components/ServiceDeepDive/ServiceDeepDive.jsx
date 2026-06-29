import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './ServiceDeepDive.scss'

export default function ServiceDeepDive() {
  const [active, setActive] = useState(null)
  const { lang } = useLanguage()
  const translatedServices = t('service_deep_dive.items', lang)
  const services = Array.isArray(translatedServices) ? translatedServices : []

  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : ''

    function closeOnEscape(event) {
      if (event.key === 'Escape') setActive(null)
    }

    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [active])

  return (
    <section className="dr-deep-services">
      {/* Hidden SVG filter for liquid-glass turbulence distortion */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="dr-glass-distort" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.008" numOctaves="3" seed="3" stitchTiles="stitch" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="dr-deep-header">
        <h2>{t('service_deep_dive.section_title', lang)}</h2>
      </div>

      <div className="dr-deep-list">
        <div className="dr-deep-grid">
        {services.map((s) => (
          <button
            key={s.id}
            id={s.id}
            className="dr-deep-card"
            type="button"
            onClick={() => setActive(s)}
          >
            <h3>{s.title}</h3>
            <p>{s.short}</p>
            <span className="dr-deep-link">
              {t('service_deep_dive.details_link', lang)}
              <ArrowRight size={16} aria-hidden="true" />
            </span>
          </button>
        ))}
        </div>
      </div>

      {active && (
        <div className="dr-modal-overlay is-open" onClick={() => setActive(null)}>
          <div
            className="dr-modal-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dr-deep-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="dr-modal-orb dr-modal-orb-one" aria-hidden="true" />
            <span className="dr-modal-orb dr-modal-orb-two" aria-hidden="true" />
            <button
              className="dr-modal-close"
              type="button"
              aria-label={t('common.close', lang)}
              onClick={() => setActive(null)}
            >
              <X size={22} aria-hidden="true" />
            </button>
            <div className="dr-modal-content dr-deep-modal-content">
              <h3 id="dr-deep-modal-title">{active.title}</h3>
              <h4>{t('service_deep_dive.includes_label', lang)}</h4>
              <ul>
                {active.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>

              {active.entry?.length > 0 && (
                <div className="dr-deep-entry-points">
                  <h4>{t('service_deep_dive.entry_points_label', lang)}</h4>
                  <div>
                    {active.entry.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="dr-modal-cta dr-deep-modal-cta">
                <Link to={`/consultanta?service=${active.id}&source=deep-dive`}>
                  {t('service_deep_dive.offer_cta', lang)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
