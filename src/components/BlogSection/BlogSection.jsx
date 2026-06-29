import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { t } from '../../lib/i18n'
import { getBlogPostsAsync } from '../../lib/posts'
import './BlogSection.scss'

function BlogSection() {
  const { lang } = useLanguage()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let active = true

    getBlogPostsAsync(lang).then((items) => {
      if (active) {
        setPosts(items.slice(0, 3))
      }
    })

    return () => {
      active = false
    }
  }, [lang])

  return (
    <section className="dr-blog-section">
      <div className="dr-blog-header">
        <div>
          <span className="dr-blog-eyebrow">{t('blog.section_label', lang)}</span>
          <h2>{t('blog.section_title', lang)}</h2>
        </div>

        <Link to="/resurse" className="dr-blog-view-all">
          {t('blog.view_all', lang)}
        </Link>
      </div>

      <div className="dr-blog-grid">
        {posts.map((post) => (
          <Link className="dr-blog-card" to={post.href} key={post.slug}>
            {post.imageUrl && (
              <div className="dr-blog-card-media">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}

            <div className="dr-blog-card-top">
              <span>{post.category}</span>
              <span>{post.date}</span>
            </div>

            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>

            <div className="dr-blog-card-link">
              {t('blog.read_article', lang)}
              <ArrowRight size={17} aria-hidden="true" />
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="dr-blog-empty">{t('resources.blog_no_results', lang)}</p>
        )}
      </div>
    </section>
  )
}

export default BlogSection
