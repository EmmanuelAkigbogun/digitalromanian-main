import { useLanguage } from '../context/useLanguage'
import { t } from '../lib/i18n'

function Blog() {
  const { lang } = useLanguage()

  return <h1>{t('blog.section_label', lang)}</h1>
}

export default Blog
