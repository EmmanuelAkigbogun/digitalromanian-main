import { Search, Lightbulb, Code, Rocket } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './ProcessSection.scss'

const stepIcons = [Search, Lightbulb, Code, Rocket]

function ProcessSection() {
  const { lang } = useLanguage()
  const translatedSteps = t('process.steps', lang)
  const steps = (Array.isArray(translatedSteps) ? translatedSteps : []).map((step, index) => ({
    ...step,
    icon: stepIcons[index] || Search,
  }))

  return (
    <section className="dr-process">
      <h2>{t('process.section_title', lang)}</h2>

      <div className="dr-process-grid">
        {steps.map((step) => {
          const Icon = step.icon

          return (
            <div key={step.title} className="dr-process-card">
              <Icon size={36} aria-hidden="true" />
              <div className="dr-process-text">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ProcessSection
