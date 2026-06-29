import { useLanguage } from '../context/useLanguage'
import { t } from '../lib/i18n'

function Consultation() {
  const { lang } = useLanguage()

  return <h1>{t('consulting.hero_title', lang)}</h1>
}

export default Consultation
