import { ArrowDown, LayoutTemplate, MonitorSmartphone, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import { getCaseStudies } from '../../data/caseStudies'
import balancepawsImage from '../../assets/case-studies/balancepaws.png'
import miciNegoestiMobileImage from '../../assets/case-studies/miciNegoestiMobile.png'
import './PortfolioAbout.scss'

export default function PortfolioAbout() {
  const { lang } = useLanguage()
  const caseStudiesCount = getCaseStudies(lang).length

  return (
    <section className="dr-portfolio-about">
      <div className="dr-about-block">
        <div className="dr-about-left">
          <h1>{t('portfolio.about_title', lang)}</h1>

          <p>{t('portfolio.about_desc', lang)}</p>

          <a href="#studii-de-caz" className="dr-about-primary">
            {t('portfolio.about_cta', lang)}
            <ArrowDown size={18} aria-hidden="true" />
          </a>

          <div className="dr-about-trust-row" aria-label={t('common.services_benefits_label', lang)}>
            {t('portfolio.about_benefits', lang).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="dr-portfolio-visual" aria-label={t('common.portfolio_preview', lang)}>
          <Link to="/portofoliu/balancepaws" className="dr-featured-project">
            <div className="dr-featured-bar" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <img
              src={balancepawsImage}
              alt="Magazin online Balance Paws pentru produse pet care"
              width="1423"
              height="732"
              decoding="async"
            />
            <div className="dr-featured-meta">
              <strong>Balance Paws</strong>
              <span>{t('portfolio.about_featured.meta', lang)}</span>
            </div>
          </Link>

          <div className="dr-proof-card dr-proof-card-cases">
            <i>
              <Users size={17} aria-hidden="true" />
            </i>
            <strong>{caseStudiesCount}</strong>
            <span>{t('portfolio.about_stats.case_studies', lang)}</span>
          </div>

          <div className="dr-proof-card dr-proof-card-templates">
            <i>
              <LayoutTemplate size={17} aria-hidden="true" />
            </i>
            <strong>50</strong>
            <span>{t('portfolio.about_stats.templates', lang)}</span>
          </div>

          <Link to="/portofoliu/micinegoesti" className="dr-mobile-preview">
            <div>
              <MonitorSmartphone size={16} aria-hidden="true" />
              <span>{t('portfolio.about_featured.mobile_preview', lang)}</span>
            </div>
            <img
              src={miciNegoestiMobileImage}
              alt="Previzualizare mobilă pentru website-ul Mici de Negoiești"
              width="286"
              height="638"
              decoding="async"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
