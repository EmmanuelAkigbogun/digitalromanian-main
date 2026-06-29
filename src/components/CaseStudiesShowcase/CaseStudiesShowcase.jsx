import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import { getCaseStudies } from '../../data/caseStudies'
import './CaseStudiesShowcase.scss'

/* ─────────────────────────────────────────────────────────────────
   LAYOUT — Lando Norris column approach (desktop only)

   Instead of positioning every card absolutely with --case-x/--case-y,
   cards are grouped into flex COLUMNS. The track is a horizontal flex
   row of those columns. Only the track X is translated on scroll.

   Vertical offset inside a column is achieved with:
     • paddingTop on the column  (first card's distance from top)
     • marginTop on 2nd card in same column

   This means nothing overflows vertically on short screens.
   Mobile rendering is unchanged — the media query overrides track to
   flex-direction:column and resets everything as before.
   ───────────────────────────────────────────────────────────────── */

const caseMapEdgePadding = 176
const caseMapStartGap = 154  // intro → first col gap

/*
  Column definitions. Each entry = one .dr-cases-map-col.
  `cards` is ordered array of cards inside that column.
  
  card fields:
    w, h        — --case-w / --case-h on the card
    rotate      — --case-rotate
    paddingTop  — applied as paddingTop on the COLUMN (first card pushes column down)
    marginTop   — applied as marginTop on this card (for 2nd+ cards in same col)
    kind        — class suffix: 'hero' | 'medium' | 'small' | 'ticket'
    showTicket  — renders the ticket widget
  
  colWidth   — width CSS var for the column element
  colGap     — margin-right on this column (gap to next col)
*/
const COLUMN_DEFS = [
  {
    colWidth: 660, colGap: 60,
    paddingTop: 108,
    cards: [
      { w: 640, h: 418, rotate: 0, kind: 'hero' },
    ]
  },
  {
    colWidth: 460, colGap: 56,
    paddingTop: 112,
    cards: [
      { w: 382, h: 225, rotate: -0.35, kind: 'small' },
      { w: 444, h: 282, rotate: 0.20, kind: 'ticket', showTicket: true, marginTop: 44 },
    ]
  },
  {
    colWidth: 680, colGap: 60,
    paddingTop: 122,
    cards: [
      { w: 640, h: 418, rotate: 0.30, kind: 'hero' },
    ]
  },
  {
    colWidth: 480, colGap: 52,
    paddingTop: 158,
    cards: [
      { w: 454, h: 298, rotate: 0.24, kind: 'medium' },
      { w: 396, h: 230, rotate: -0.28, kind: 'small', marginTop: 40 },
    ]
  },
  {
    colWidth: 680, colGap: 60,
    paddingTop: 92,
    cards: [
      { w: 640, h: 418, rotate: -0.25, kind: 'hero' },
    ]
  },
  {
    colWidth: 480, colGap: 52,
    paddingTop: 130,
    cards: [
      { w: 372, h: 248, rotate: 0.18, kind: 'small' },
      { w: 454, h: 298, rotate: -0.20, kind: 'medium', marginTop: 48 },
    ]
  },
]

/* Assign each case-study item to a slot in a column definition */
function buildColumnLayout(items) {
  // Pair each item with its column def and intra-column card slot
  const colGroups = []   // [{ def, items: [{ item, globalIndex, slot }] }]
  let itemIdx = 0
  let defIdx = 0

  while (itemIdx < items.length) {
    const def = COLUMN_DEFS[defIdx % COLUMN_DEFS.length]
    const group = { def, cards: [] }

    for (let c = 0; c < def.cards.length && itemIdx < items.length; c++) {
      group.cards.push({
        item: items[itemIdx],
        globalIndex: itemIdx,
        slot: def.cards[c],
      })
      itemIdx++
    }

    colGroups.push(group)
    defIdx++
  }

  // Estimate total track width → scroll height
  const colsWidth = colGroups.reduce((acc, g) => acc + g.def.colWidth + g.def.colGap, 0)
  const trackWidth = caseMapEdgePadding * 2
    + 450 /* intro */ + caseMapStartGap
    + colsWidth
    + 96 /* statement margin */ + 760 /* statement width */
  const scrollHeight = Math.max(2600, Math.round(trackWidth * 0.62))

  return { colGroups, scrollHeight, trackWidth }
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────────── */
function CaseStudiesShowcase({
  showMoreButton = false,
  paginated = false,
  perPage = 6,
  initialCount = 6,
}) {
  const mapSectionRef = useRef(null)
  const mapViewportRef = useRef(null)
  const mapTrackRef = useRef(null)

  const [visibleCount, setVisibleCount] = useState(initialCount)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeCaseIndex, setActiveCaseIndex] = useState(null)

  const { lang } = useLanguage()
  const caseStudies = useMemo(() => getCaseStudies(lang), [lang])
  const layout = useMemo(() => buildColumnLayout(caseStudies), [caseStudies])

  const totalPages = Math.max(1, Math.ceil(caseStudies.length / perPage))
  const pageIndex = Math.min(currentPage, totalPages)

  const visibleCases = paginated
    ? caseStudies.slice((pageIndex - 1) * perPage, pageIndex * perPage)
    : showMoreButton
      ? caseStudies.slice(0, visibleCount)
      : caseStudies.slice(0, initialCount)

  const usesMapLayout = !paginated && !showMoreButton

  function activateCase(index) { setActiveCaseIndex(index) }
  function releaseCase(index = null) {
    setActiveCaseIndex((cur) => {
      if (index !== null && cur !== index) return cur
      return null
    })
  }

  /* ── Horizontal scroll sync ── */
  useEffect(() => {
    if (!usesMapLayout) return

    const section = mapSectionRef.current
    const viewport = mapViewportRef.current
    const track = mapTrackRef.current
    if (!section || !viewport || !track) return

    let frameId = 0

    function syncMobileFocus() {
      const sectionRect = section.getBoundingClientRect()
      if (
        sectionRect.bottom < window.innerHeight * 0.28 ||
        sectionRect.top > window.innerHeight * 0.72
      ) {
        setActiveCaseIndex((cur) => (cur === null ? cur : null))
        return
      }
      const center = window.innerHeight / 2
      const cards = Array.from(track.querySelectorAll('[data-case-index]'))
      let closestIndex = null
      let closestDist = Number.POSITIVE_INFINITY
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const mid = rect.top + rect.height / 2
        const dist = Math.abs(mid - center)
        if (dist < closestDist) { closestDist = dist; closestIndex = Number(card.dataset.caseIndex) }
      })
      setActiveCaseIndex((cur) => cur === closestIndex ? cur : closestIndex)
    }

    function syncHorizontalScroll() {
      frameId = 0
      if (window.matchMedia('(max-width: 900px)').matches) {
        track.style.transform = 'translate3d(0,0,0)'
        section.style.setProperty('--case-scroll-progress', '0')
        syncMobileFocus()
        return
      }
      const sectionRect = section.getBoundingClientRect()
      const scrollDist = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.max(0, Math.min(1, -sectionRect.top / scrollDist))
      const maxShift = Math.max(0, track.scrollWidth - viewport.clientWidth)
      track.style.transform = `translate3d(${-(maxShift * progress)}px, 0, 0)`
      section.style.setProperty('--case-scroll-progress', progress.toFixed(3))
    }

    function requestSync() {
      if (frameId) return
      frameId = window.requestAnimationFrame(syncHorizontalScroll)
    }

    syncHorizontalScroll()
    window.addEventListener('scroll', requestSync, { passive: true })
    window.addEventListener('resize', requestSync)

    return () => {
      window.removeEventListener('scroll', requestSync)
      window.removeEventListener('resize', requestSync)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [caseStudies.length, usesMapLayout])

  /* ── MAP RENDER ── */
  if (usesMapLayout) {
    return (
      <section
        className="dr-cases-section dr-cases-section--map"
        id="studii-de-caz"
        ref={mapSectionRef}
        style={{ '--cases-scroll-height': `${layout.scrollHeight}px` }}
      >
        <div
          className="dr-cases-map"
          ref={mapViewportRef}
          onPointerLeave={() => releaseCase()}
        >
          <div
            className="dr-cases-map-scroller"
            aria-label={t('case_studies.section_title', lang)}
          >
            <div
              className={`dr-cases-map-track ${activeCaseIndex !== null ? 'has-active-case' : ''}`}
              ref={mapTrackRef}
              style={{
                '--cases-edge-padding': `${caseMapEdgePadding}px`,
                '--cases-start-gap': `${caseMapStartGap}px`,
              }}
            >
              {/* INTRO */}
              <div className="dr-cases-map-intro">
                <span className="dr-cases-eyebrow">Digital Romanian</span>
                <h2>{t('case_studies.section_title', lang)}</h2>
              </div>

              {/* COLUMNS */}
              {layout.colGroups.map((group, colIdx) => (
                <div
                  key={colIdx}
                  className="dr-cases-map-col"
                  style={{
                    width: `${group.def.colWidth}px`,
                    '--col-padding-top': `${group.def.paddingTop}px`,
                    paddingTop: `var(--col-padding-top)`,
                    marginRight: `${group.def.colGap}px`,
                  }}
                >
                  {group.cards.map(({ item, globalIndex: idx, slot }, cardIdx) => {
                    const imageUrl = item.imageUrl || item.showcaseImageUrl
                    const imageWidth = item.showcaseImageWidth || item.imageWidth
                    const imageHeight = item.showcaseImageHeight || item.imageHeight
                    const fit = item.showcaseFit || 'contain'
                    const caseLabel = `${item.title}, ${item.status}`

                    const cardClasses = [
                      'dr-case-map-card',
                      `dr-case-map-card--${item.id}`,
                      `dr-case-map-card--${slot.kind}`,
                      `dr-case-map-card--fit-${fit}`,
                      activeCaseIndex === idx ? 'is-active-case' : '',
                    ].filter(Boolean).join(' ')

                    return (
                      <a
                        key={item.title}
                        href={item.href}
                        className={cardClasses}
                        data-case-index={idx}
                        style={{
                          '--case-w': `${slot.w}px`,
                          '--case-h': `${slot.h}px`,
                          '--case-rotate': `${slot.rotate}deg`,
                          '--case-image-position': item.showcaseImagePosition || 'center',
                          // 2nd+ card in column: push down via marginTop
                          ...(slot.marginTop != null ? { marginTop: `${slot.marginTop}px` } : {}),
                        }}
                        aria-label={t('case_studies.view_case', lang).replace('{title}', item.title)}
                        onPointerEnter={() => activateCase(idx)}
                        onPointerLeave={() => releaseCase(idx)}
                        onFocus={() => activateCase(idx)}
                        onBlur={() => releaseCase(idx)}
                      >
                        <span className="dr-case-map-label">{caseLabel}</span>

                        {item.showcaseCaption && item.showcaseCaptionPosition === 'top' && (
                          <span className="dr-case-map-caption dr-case-map-caption--top">
                            {item.showcaseCaption}
                          </span>
                        )}

                        {/*
                          .dr-case-map-frame has position:relative + overflow:hidden
                          so .dr-case-map-copy is absolutely positioned INSIDE and
                          clipped — it never bleeds onto neighbouring cards.
                        */}
                        <span className="dr-case-map-frame">
                          <img
                            src={imageUrl}
                            alt={item.imageAlt || `${item.title} - proiect web Digital Romanian`}
                            width={imageWidth}
                            height={imageHeight}
                            loading="lazy"
                            decoding="async"
                          />
                          <span className="dr-case-map-copy">
                            <strong>{item.title}</strong>
                            <span>{item.excerpt}</span>
                          </span>
                        </span>
                        {slot.showTicket && (
                          <span className="dr-case-map-ticket" aria-hidden="true">
                            <span>{String(idx + 1).padStart(2, '0')}</span>
                            <i /><i />
                          </span>
                        )}
                        {item.showcaseCaption && item.showcaseCaptionPosition !== 'top' && (
                          <span className="dr-case-map-caption">{item.showcaseCaption}</span>
                        )}


                      </a>
                    )
                  })}
                </div>
              ))}

              {/* STATEMENT */}
              <div className="dr-cases-map-statement">
                <p>{t('case_studies.map_statement', lang)}</p>
                <Link to="/portofoliu#studii-de-caz" className="dr-cases-map-link">
                  {t('case_studies.view_all', lang)}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ── GRID / PAGINATED RENDER (unchanged) ── */
  return (
    <section className="dr-cases-section" id="studii-de-caz">
      <div className="dr-cases-header">
        <div>
          <h2>{t('case_studies.section_title', lang)}</h2>
        </div>
        {!paginated && (
          <Link to="/portofoliu#studii-de-caz" className="dr-cases-view-all">
            {t('case_studies.view_all', lang)}
          </Link>
        )}
      </div>

      <div className="dr-cases-grid">
        {visibleCases.map((item) => (
          <Link key={item.title} to={item.href} className="dr-case-card">
            <div className="dr-case-preview">
              <div className="dr-case-placeholder">
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt || `${item.title} - proiect web Digital Romanian`}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  loading="lazy"
                  decoding="async"
                />
                <span>{item.domain}</span>
              </div>
              <div className="dr-case-overlay">
                <span>{item.status}</span>
                <ArrowRight size={20} aria-hidden="true" />
              </div>
            </div>
            <div className="dr-case-content">
              <div className="dr-case-meta">
                <span>{item.type}</span>
                <span>{item.status}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      {paginated && (
        <div className="dr-cases-pagination">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={pageIndex === 1}
          >
            {t('templates.pagination_prev', lang)}
          </button>
          <span>
            {t('templates.pagination_label', lang)
              .replace('{page}', pageIndex)
              .replace('{total}', totalPages)}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageIndex === totalPages}
          >
            {t('templates.pagination_next', lang)}
          </button>
        </div>
      )}

      {showMoreButton && visibleCount < caseStudies.length && (
        <div className="dr-cases-more-wrap">
          <button
            className="dr-cases-more"
            type="button"
            onClick={() => setVisibleCount((c) => c + 3)}
          >
            {t('case_studies.view_more', lang)}
          </button>
        </div>
      )}
    </section>
  )
}

export default CaseStudiesShowcase
