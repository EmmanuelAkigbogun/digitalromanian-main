import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './PlansSection.scss'

function PlansSection() {
  const { lang } = useLanguage()
  const translatedPlans = t('plans.items', lang)
  const plans = Array.isArray(translatedPlans) ? translatedPlans : []

  return (
    <section className="dr-plans">
      <h2>{t('plans.section_title', lang)}</h2>

      <div className="dr-plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.title}
            className={`dr-plan-card ${plan.highlight ? 'is-highlight' : ''}`}
          >
            <h3>{plan.title}</h3>
            <p className="dr-plan-desc">{plan.desc}</p>

            <ul className="dr-plan-features">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link
              className="dr-plan-btn"
              to={`/consultanta?service=${plan.serviceId}&source=plans`}
            >
              {t('plans.cta', lang)}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PlansSection
