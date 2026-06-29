import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './ScrollToTopButton.scss'

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)
  const { lang } = useLanguage()

  useEffect(() => {
    function handleScroll() {
      const shouldShow = window.scrollY > 400
      setVisible(shouldShow)
      document.documentElement.setAttribute('data-scroll-top-visible', shouldShow ? 'true' : 'false')
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.documentElement.removeAttribute('data-scroll-top-visible')
    }
  }, [])

  function handleClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={`scroll-to-top${visible ? ' scroll-to-top--visible' : ''}`}
      type="button"
      onClick={handleClick}
      aria-label={t('common.back_to_top', lang)}
    >
      <ChevronUp size={22} strokeWidth={2.4} aria-hidden="true" />
    </button>
  )
}

export default ScrollToTopButton
