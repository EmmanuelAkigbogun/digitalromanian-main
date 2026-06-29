import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './ServicesShowcase.scss'

const serviceIds = ['software', 'website', 'branding', 'automation', 'social-media']

function ServicesShowcase() {
  const [selectedService, setSelectedService] = useState(null)
  const { lang } = useLanguage()
  const services = serviceIds.map((id) => ({
    id,
    title: t(`services.${id}.title`, lang),
    short: t(`services.${id}.short`, lang),
    subtitle: t(`services.${id}.subtitle`, lang),
    points: t(`services.${id}.points`, lang),
  }))

  useEffect(() => {
    document.body.style.overflow = selectedService ? 'hidden' : ''

    function closeOnEscape(event) {
      if (event.key === 'Escape') setSelectedService(null)
    }

    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedService])

  return (
    <section className="dr-services-section">
      <div className="dr-services-shell">
        <div className="dr-services-header">
          <h2>{t('services.section_title', lang)}</h2>
          <p>{t('services.section_subtitle', lang)}</p>
        </div>

        <div className="dr-services-list">
          {services.map((service) => (
            <button
              key={service.title}
              id={service.id}
              className="dr-service-row"
              type="button"
              onClick={() => setSelectedService(service)}
              aria-label={`${t('service_deep_dive.details_link', lang)}: ${service.title}`}
            >
              <span className="dr-service-title">{service.title}</span>

              <span className="dr-service-short">
                {service.short.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </span>

              <span className="dr-service-arrow">
                <ArrowRight size={20} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </div>
      {selectedService && (
        <div
          className="dr-modal-overlay is-open"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="dr-modal-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dr-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="dr-modal-orb dr-modal-orb-one" aria-hidden="true" />
            <span className="dr-modal-orb dr-modal-orb-two" aria-hidden="true" />

            <button
              className="dr-modal-close"
              type="button"
              aria-label={t('common.close', lang)}
              onClick={() => setSelectedService(null)}
            >
              <ArrowRight size={22} aria-hidden="true" />
            </button>

            <div className="dr-modal-content">
              <h3 id="dr-modal-title">{selectedService.title}</h3>
              <p>{selectedService.subtitle}</p>

              <ul>
                {selectedService.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ServicesShowcase
