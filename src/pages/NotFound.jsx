import { ArrowLeft, FolderOpen, Home, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { t } from '../lib/i18n'
import './NotFound.scss'

export default function NotFound() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const checks = t('not_found.checks', lang)

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  return (
    <main className="dr-not-found-page">
      <div className="dr-not-found-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <section className="dr-not-found-shell" aria-labelledby="not-found-title">
        <div className="dr-not-found-copy">
          <span className="dr-not-found-kicker">{t('not_found.kicker', lang)}</span>

          <h1 id="not-found-title">
            {t('not_found.title', lang)}
            <span>{t('not_found.title_accent', lang)}</span>
          </h1>

          <p>{t('not_found.desc', lang)}</p>

          <div className="dr-not-found-actions">
            <button type="button" onClick={handleBack}>
              <ArrowLeft size={18} aria-hidden="true" />
              {t('not_found.back', lang)}
            </button>

            <Link to="/">
              <Home size={18} aria-hidden="true" />
              {t('not_found.home', lang)}
            </Link>

            <Link className="is-secondary" to="/portofoliu">
              <FolderOpen size={18} aria-hidden="true" />
              {t('not_found.portfolio', lang)}
            </Link>
          </div>

          <ul className="dr-not-found-checks">
            {checks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="dr-not-found-visual" aria-hidden="true">
          <div className="dr-not-found-display">
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </div>

          <div className="dr-not-found-search">
            <Search size={20} aria-hidden="true" />
            <span>{t('not_found.signal', lang)}</span>
          </div>

          <div className="dr-not-found-grid">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>
    </main>
  )
}
