import { useState } from 'react'
import {
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
import RoadmapModal from './RoadmapModal'
import './Roadmap.scss'

const timelineStepMeta = [
  { number: '01', icon: Building2 },
  { number: '02', icon: Globe },
  { number: '03', icon: PenTool },
  { number: '04', icon: Palette },
  { number: '05', icon: Server },
  { number: '06', icon: FileText },
  { number: '07', icon: Rocket },
  { number: '08', icon: Megaphone },
]

function Roadmap() {
  const [roadmapOpen, setRoadmapOpen] = useState(false)
  const [openCount, setOpenCount] = useState(0)
  const { lang } = useLanguage()
  const timelineStepTitles = t('roadmap.steps', lang)

  function openModal() {
    setOpenCount((c) => c + 1)
    setRoadmapOpen(true)
  }

  return (
    <section className="dr-roadmap-section">
      <div className="dr-roadmap-shell">
        <div className="dr-roadmap-header">
          <span>{t('roadmap.section_label', lang)}</span>
          <h2>{t('roadmap.section_title', lang)}</h2>
          <p>{t('roadmap.section_desc', lang)}</p>
        </div>

        <div className="dr-roadmap-timeline" aria-label={t('roadmap.modal_timeline_label', lang)}>
          <div className="dr-roadmap-timeline-track" />
          {timelineStepMeta.map(({ number, icon: Icon }, index) => (
            <div key={number} className="dr-roadmap-timeline-step">
              <div className="dr-roadmap-timeline-icon">
                <Icon size={17} aria-hidden="true" />
              </div>
              <span className="dr-roadmap-timeline-title">{timelineStepTitles[index]}</span>
            </div>
          ))}
        </div>

        <div className="dr-roadmap-cta">
          <button
            type="button"
            onClick={openModal}
            aria-label={t('roadmap.cta', lang)}
          >
            {t('roadmap.cta', lang)}
          </button>
        </div>
      </div>

      <RoadmapModal
        key={openCount}
        isOpen={roadmapOpen}
        onClose={() => setRoadmapOpen(false)}
      />
    </section>
  )
}

export default Roadmap
