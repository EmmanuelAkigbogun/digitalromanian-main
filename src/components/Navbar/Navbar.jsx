import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Home,
  ClipboardList,
  MessageCircle,
  PenLine,
  Calendar,
  Settings,
  Sun,
  Moon,
} from 'lucide-react'
import logoDark from '../../assets/logo-dark.svg'
import logoLight from '../../assets/logo-light.svg'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import './Navbar.scss'


const navItems = [
  { key: 'navbar.home', href: '/', icon: <Home size={24} strokeWidth={2.2} aria-hidden="true" /> },
  { key: 'navbar.services', href: '/servicii', icon: <Settings size={24} strokeWidth={2.2} aria-hidden="true" /> },
  { key: 'navbar.portfolio', href: '/portofoliu', icon: <ClipboardList size={24} strokeWidth={2.2} aria-hidden="true" /> },
  { key: 'navbar.resources', href: '/resurse', icon: <PenLine size={24} strokeWidth={2.2} aria-hidden="true" /> },
  { key: 'navbar.contact', href: '/contact', icon: <MessageCircle size={24} strokeWidth={2.2} aria-hidden="true" /> },
]

function Navbar() {
  const { lang } = useLanguage()
  const [theme, setTheme] = useState(() => {
    const attrTheme = document.documentElement.getAttribute('data-theme')
    if (attrTheme === 'light' || attrTheme === 'dark') return attrTheme

    const storedTheme = window.localStorage.getItem('dr-theme')
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme

    return 'dark'
  })
  const [touchedLabel, setTouchedLabel] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  const isDark = theme === 'dark'
  const logo = isDark ? logoLight : logoDark

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('dr-theme', theme)
  }, [theme])

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <>
      <header className={`navbar-shell ${isScrolled ? 'is-scrolled' : ''}`}>
        <a href="/" className="navbar-logo" aria-label="Digital Romanian" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
          <img src={logo} alt="Digital Romanian logo" width="500" height="500" decoding="async" />
        </a>

        <nav className="navbar-glass desktop-nav" aria-label={t('navbar.main_navigation', lang)}>
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.href}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            >
              {t(item.key, lang)}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <button
            className="theme-icon-toggle desktop-theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={t('navbar.change_theme', lang)}
          >
            {isDark
              ? <Moon size={22} strokeWidth={2.2} aria-hidden="true" />
              : <Sun size={22} strokeWidth={2.2} aria-hidden="true" />}
          </button>

          <Link
            to="/consultanta?service=offer&source=navbar-desktop"
            className="consultation-button desktop-consultation"
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
          >
            {t('navbar.book', lang)}
          </Link>
        </div>
      </header>

      <nav className="mobile-bottom-nav" aria-label={t('navbar.mobile_navigation', lang)}>
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.href}
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? 'is-active' : ''} ${
                touchedLabel === item.key ? 'is-touched' : ''
              }`
            }
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'instant' })
              setTouchedLabel(item.key)
              window.clearTimeout(window.__drMobileNavTimer)
              window.__drMobileNavTimer = window.setTimeout(() => {
                setTouchedLabel('')
              }, 900)
            }}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{t(item.key, lang)}</span>
          </NavLink>
        ))}

        <NavLink
          to="/consultanta?service=offer&source=navbar-mobile"
          className={({ isActive }) =>
            `mobile-nav-item mobile-consultation ${isActive ? 'is-active' : ''} ${
              touchedLabel === 'navbar.book' ? 'is-touched' : ''
            }`
          }
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'instant' })
            setTouchedLabel('navbar.book')

            window.clearTimeout(window.__drMobileNavTimer)
            window.__drMobileNavTimer = window.setTimeout(() => {
              setTouchedLabel('')
            }, 900)
          }}
        >
          <span className="mobile-nav-icon">
            <Calendar size={24} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="mobile-nav-label">{t('navbar.book', lang)}</span>
        </NavLink>
      </nav>

      <button
        className="theme-icon-toggle mobile-theme-toggle"
        type="button"
        onClick={toggleTheme}
        aria-label={t('navbar.change_theme', lang)}
      >
        {isDark
          ? <Moon size={22} strokeWidth={2.2} aria-hidden="true" />
          : <Sun size={22} strokeWidth={2.2} aria-hidden="true" />}
      </button>
    </>
  )
}

export default Navbar
