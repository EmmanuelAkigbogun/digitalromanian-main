import PortfolioAbout from '../components/PortfolioAbout/PortfolioAbout'
import CaseStudiesShowcase from '../components/CaseStudiesShowcase/CaseStudiesShowcase'
import TemplatesShowcase from '../components/TemplatesShowcase/TemplatesShowcase'
import InactivityNewsletterPopup from '../components/InactivityNewsletterPopup/InactivityNewsletterPopup'
import { useLanguage } from '../context/useLanguage'
import { t } from '../lib/i18n'

function Portfolio() {
  const { lang } = useLanguage()

  return (
    <>
      <PortfolioAbout />
      <CaseStudiesShowcase />
      <TemplatesShowcase
        title={t('portfolio.templates_title', lang)}
        subtitle={t('portfolio.templates_subtitle', lang)}
        paginated
        perPage={12}
      />
      <InactivityNewsletterPopup inactivityMs={30000} />
    </>
  )
}

export default Portfolio
