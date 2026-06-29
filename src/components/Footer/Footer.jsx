import { Link } from 'react-router-dom'
import { Mail, Send } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import logoDark from '../../assets/logo-dark.svg'
import logoLight from '../../assets/logo-light.svg'
import anpcImage from '../../assets/anpc.webp'
import solImage from '../../assets/sol.webp'
import './Footer.scss'

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

function Footer() {
  const { lang } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo-wrap" role="img" aria-label="Digital Romanian logo">
            <img src={logoLight} alt="" aria-hidden="true" width="500" height="500" loading="lazy" decoding="async" className="footer-logo footer-logo-dark" />
            <img src={logoDark} alt="" aria-hidden="true" width="500" height="500" loading="lazy" decoding="async" className="footer-logo footer-logo-light" />
          </div>

          <p>{t('footer.brand_desc', lang)}</p>

          <span className="footer-copy">
            {t('footer.copyright', lang).replace('{year}', new Date().getFullYear())}
          </span>
        </div>

        <div className="footer-column">
          <h3>{t('footer.useful_links', lang)}</h3>
          <Link to="/servicii">{t('navbar.services', lang)}</Link>
          <Link to="/portofoliu">{t('navbar.portfolio', lang)}</Link>
          <Link to="/resurse">{t('navbar.resources', lang)}</Link>
          <Link to="/contact">{t('navbar.contact', lang)}</Link>
          <Link to="/politica-de-confidentialitate">{t('footer.privacy_policy', lang)}</Link>
          <a href="/sitemap.xml">{t('footer.sitemap', lang)}</a>
        </div>

        <div className="footer-legal">
          <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noreferrer">
            <img src={anpcImage} alt={t('footer.anpc_alt', lang)} loading="lazy" decoding="async" />
          </a>

          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">
            <img src={solImage} alt={t('footer.sol_alt', lang)} loading="lazy" decoding="async" />
          </a>

          <h3>Digital Romanian SRL</h3>
          <p><strong>CUI:</strong> 54325192</p>
          <p><strong>Nr. Reg. Com.:</strong> J2026019369002</p>
          <p><strong>EUID:</strong> ROONRC.J2026019369002</p>
          <a href="https://digitalromanian.com">digitalromanian.com</a>
        </div>

        <div className="footer-newsletter">
          <h3>{t('navbar.contact', lang)}</h3>
          <p>{t('footer.contact_desc', lang)}</p>

          <a className="footer-email-box" href="mailto:contact@digitalromanian.com">
            <span>contact@digitalromanian.com</span>
            <Send size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="footer-socials">
        <a href="https://www.youtube.com/@digitalromanian" target="_blank" rel="noreferrer">
          Youtube <YoutubeIcon />
        </a>

        <a href="https://www.instagram.com/digitalromanian/" target="_blank" rel="noreferrer">
          Instagram <InstagramIcon />
        </a>

        <a href="https://www.linkedin.com/company/digital-romanian/?viewAsMember=true" target="_blank" rel="noreferrer">
          LinkedIn <LinkedinIcon />
        </a>

        <a href="mailto:contact@digitalromanian.com">
          Email <Mail size={20} aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}

export default Footer
