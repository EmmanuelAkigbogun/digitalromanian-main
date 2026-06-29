import { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  Globe,
  PenTool,
  Palette,
  Server,
  FileText,
  Rocket,
  Megaphone,
} from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'

const modalStepMeta = [
  { number: '01', icon: Building2 },
  { number: '02', icon: Globe },
  { number: '03', icon: PenTool },
  { number: '04', icon: Palette },
  { number: '05', icon: Server },
  { number: '06', icon: FileText },
  { number: '07', icon: Rocket },
  { number: '08', icon: Megaphone },
]

function RoadmapModal({ isOpen, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { lang } = useLanguage()
  const translatedModalStepContent = t('roadmap.modal_steps', lang)
  const modalStepContent = Array.isArray(translatedModalStepContent) ? translatedModalStepContent : []
  const modalSteps = modalStepMeta.map((step, index) => ({
    ...step,
    ...modalStepContent[index],
  }))
  const modalStepsLength = modalSteps.length
  const activeStep = modalSteps[activeIndex]
  const ActiveIcon = activeStep.icon
  const touchStartXRef = useRef(null)
  const touchStartYRef = useRef(null)
  const timelineStepRefs = useRef([])

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? 'hidden' : ''
    document.body.style.overflow = isOpen ? 'hidden' : ''
    document.body.classList.toggle('roadmap-modal-open', isOpen)

    function handleKeyDown(event) {
      if (!isOpen) return
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') setActiveIndex((c) => c < modalStepsLength - 1 ? c + 1 : c)
      if (event.key === 'ArrowLeft') setActiveIndex((c) => c > 0 ? c - 1 : c)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.classList.remove('roadmap-modal-open')
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, modalStepsLength, onClose])

  useEffect(() => {
    if (!isOpen) return

    const activeStepButton = timelineStepRefs.current[activeIndex]
    if (!activeStepButton) return

    activeStepButton.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [activeIndex, isOpen])

  function nextCard() {
    setActiveIndex((c) => c < modalSteps.length - 1 ? c + 1 : c)
  }

  function prevCard() {
    setActiveIndex((c) => c > 0 ? c - 1 : c)
  }

  function handleTouchStart(event) {
    const touch = event.changedTouches?.[0]
    if (!touch) return
    touchStartXRef.current = touch.clientX
    touchStartYRef.current = touch.clientY
  }

  function handleTouchEnd(event) {
    const touch = event.changedTouches?.[0]
    const startX = touchStartXRef.current
    const startY = touchStartYRef.current

    touchStartXRef.current = null
    touchStartYRef.current = null

    if (!touch || startX === null || startY === null) return

    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY
    const swipeThreshold = 40

    if (Math.abs(deltaX) <= Math.abs(deltaY)) return
    if (Math.abs(deltaX) < swipeThreshold) return

    if (deltaX < 0) {
      nextCard()
    } else {
      prevCard()
    }
  }

  if (!isOpen) return null

  return (
    <div className="drm-overlay is-open">
      <div className="drm-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="drm-ambient drm-ambient-1" aria-hidden="true" />
      <div className="drm-ambient drm-ambient-2" aria-hidden="true" />

      <div className="drm-stage">
        <button
          className="drm-nav drm-prev drm-nav-top"
          type="button"
          aria-label={t('roadmap.modal_prev', lang)}
          onClick={prevCard}
          disabled={activeIndex === 0}
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>

        <article
          key={activeStep.number}
          className="drm-card active"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drm-card-title"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className="drm-close drm-close-inside"
            type="button"
            aria-label={t('roadmap.modal_close', lang)}
            onClick={onClose}
          >
            <X size={24} color="#ffffff" aria-hidden="true" />
          </button>

          <div className="drm-card-icon">
            <ActiveIcon size={22} aria-hidden="true" />
          </div>
          <div className="drm-chip">{activeStep.number}</div>
          <h3 id="drm-card-title">{activeStep.title}</h3>
          <p>{activeStep.description}</p>
          <ul>
            {activeStep.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <span className="drm-card-hint">{t('roadmap.modal_hint', lang)}</span>
        </article>

        <button
          className="drm-nav drm-next drm-nav-bottom"
          type="button"
          aria-label={t('roadmap.modal_next', lang)}
          onClick={nextCard}
          disabled={activeIndex === modalSteps.length - 1}
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>

      <div className="drm-progress">
        {String(activeIndex + 1).padStart(2, '0')} / {String(modalSteps.length).padStart(2, '0')}
      </div>

      <div className="drm-bottom-timeline" aria-label={t('roadmap.modal_timeline_label', lang)}>
        <div className="dr-roadmap-timeline">
          <div className="dr-roadmap-timeline-track" />
          {modalSteps.map((step, index) => (
            <button
              key={step.number}
              type="button"
              ref={(element) => {
                timelineStepRefs.current[index] = element
              }}
              className={`dr-roadmap-timeline-step${index === activeIndex ? ' is-active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={t('roadmap.modal_step_label', lang)
                .replace('{number}', step.number)
                .replace('{title}', step.title)}
            >
              <span className="dr-roadmap-timeline-icon">
                <step.icon size={17} aria-hidden="true" />
              </span>
              <span className="dr-roadmap-timeline-title">{step.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoadmapModal
