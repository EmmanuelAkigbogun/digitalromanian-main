import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import { getBlogPostsAsync } from '../../lib/posts'
import './ResourcesBlog.scss'

const categoryFilterIds = ['all', 'website', 'seo', 'design', 'marketing', 'automation']

export default function ResourcesBlog() {
  const { lang } = useLanguage()
  const [posts, setPosts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const translatedCategoryLabels = t('resources.blog_categories', lang)
  const categoryLabels = Array.isArray(translatedCategoryLabels) ? translatedCategoryLabels : []
  const categories = categoryFilterIds.map((id, index) => ({
    id,
    label: categoryLabels[index] || id,
  }))

  useEffect(() => {
    let active = true

    getBlogPostsAsync(lang).then((items) => {
      if (active) {
        setPosts(items)
      }
    })

    return () => {
      active = false
    }
  }, [lang])

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts

    return posts.filter((post) => {
      const normalizedCategory = `${post.category} ${post.title} ${post.excerpt}`.toLowerCase()
      return normalizedCategory.includes(selectedCategory)
    })
  }, [posts, selectedCategory])

  return (
    <section className="dr-res-blog" id="resurse-ghiduri">
      <div className="dr-res-blog-shell">
        <div className="dr-res-blog-main">
          <div className="dr-res-blog-header">
            <h2>{t('resources.blog_guides_title', lang)}</h2>
          </div>

          <div className="dr-res-posts">
            {filteredPosts.map((post) => (
              <Link to={post.href} className="dr-res-post" key={post.slug}>
                {post.imageUrl && (
                  <div className="dr-res-post-media">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                <div>
                  <span>{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>

                <div className="dr-res-post-bottom">
                  <span>{post.date}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </div>
              </Link>
            ))}

            {filteredPosts.length === 0 && (
              <p className="dr-res-empty">{t('resources.blog_no_results', lang)}</p>
            )}
          </div>
        </div>

        <aside className="dr-res-sidebar">
          <div className="dr-sidebar-box">
            <h3>{t('resources.blog_sidebar_title', lang)}</h3>

            <div className="dr-sidebar-cats">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={selectedCategory === category.id ? 'is-active' : ''}
                  aria-pressed={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="dr-sidebar-box">
            <h3>{t('resources.blog_sidebar_clarity_title', lang)}</h3>
            <p>{t('resources.blog_sidebar_clarity_desc', lang)}</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
