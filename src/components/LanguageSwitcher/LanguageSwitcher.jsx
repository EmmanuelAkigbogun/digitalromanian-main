import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './LanguageSwitcher.scss'

const LANG_LABELS = {
  ro: 'RO',
  de: 'DE',
  en: 'EN',
  fr: 'FR',
  nl: 'NL',
}

export default function LanguageSwitcher() {
  const { lang, setLang, LANGS = ['ro', 'en', 'de'] } = useLanguage()
  const [open, setOpen] = useState(false)
  const closeTimer = useRef(null)
  const switcherRef = useRef(null)

  function handleOpen(event) {
    if (event.pointerType && event.pointerType !== 'mouse') return

    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }

  function handleClose(event) {
    if (event.pointerType && event.pointerType !== 'mouse') return

    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setOpen(false)
    }, 1000)
  }

  useEffect(() => {
    if (!open) return undefined

    function closeOnOutsidePointer(event) {
      if (!switcherRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const currentLang = lang || 'ro'
  const otherLangs = LANGS.filter((l) => l !== currentLang)

  return (
    <div
      ref={switcherRef}
      className={`lang-switcher-bubble${open ? ' open' : ''}`}
      onPointerEnter={handleOpen}
      onPointerLeave={handleClose}
    >
      <button
        className="lang-bubble main"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('common.change_language', currentLang)}
        tabIndex={0}
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          window.clearTimeout(closeTimer.current)
          setOpen((v) => !v)
        }}
      >
        {LANG_LABELS[currentLang] || currentLang.toUpperCase()}
      </button>

      <div className="lang-bubbles-quarter" role="menu" aria-hidden={!open}>
        {otherLangs.map((l) => (
          <button
            key={l}
            className="lang-bubble"
            onClick={() => {
              window.clearTimeout(closeTimer.current)
              setLang(l)
              setOpen(false)
            }}
            tabIndex={open ? 0 : -1}
            type="button"
            role="menuitem"
            aria-label={t('common.change_language_to', currentLang).replace(
              '{language}',
              LANG_LABELS[l] || l.toUpperCase(),
            )}
          >
            {LANG_LABELS[l] || l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
