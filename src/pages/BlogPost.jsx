import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { marked } from 'marked'
import { useLanguage } from '../context/useLanguage'
import { t } from '../lib/i18n'
import { getPostBySlug } from '../lib/posts'
import './BlogPost.scss'

export default function BlogPost() {
  const { slug } = useParams()
  const { lang } = useLanguage()
  const [copied, setCopied] = useState(false)
  const post = useMemo(() => {
    return getPostBySlug(slug, lang)
  }, [slug, lang])

  const html = useMemo(() => {
    if (!post) return ''
    return marked.parse(post.body)
  }, [post])

  const shareUrl = useMemo(() => {
    if (!post) return ''
    if (typeof window !== 'undefined') return `${window.location.origin}/resurse/${post.slug}`
    return `https://digitalromanian.com/resurse/${post.slug}`
  }, [post])

  const shareText = useMemo(() => {
    if (!post) return ''
    return `${post.title} — ${post.excerpt}`
  }, [post])

  const handleCopyLink = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  if (!post) {
    return (
      <section className="dr-blogpost">
        <div className="dr-blogpost-shell">
          <h2>{t('blog.not_found', lang)}</h2>
          <Link to="/resurse" className="dr-blogpost-back">← {t('navbar.resources', lang)}</Link>
        </div>
      </section>
    )
  }

  return (
    <article className="dr-blogpost">
      <div className="dr-blogpost-shell">
        <Link to="/resurse" className="dr-blogpost-back">← {t('navbar.resources', lang)}</Link>

        <header className="dr-blogpost-header">
          <span className="dr-blogpost-category">{post.category}</span>
          <h1>{post.title}</h1>
          <p className="dr-blogpost-date">{post.date}</p>

          {post.imageUrl && (
            <div className="dr-blogpost-cover">
              <img
                src={post.imageUrl}
                alt={post.title}
                loading="eager"
                decoding="async"
              />
            </div>
          )}

          <section className="dr-share-box" aria-label={t('common.share', lang)}>
            <p className="dr-share-title">{t('common.share', lang)}</p>
            <div className="dr-share-actions">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                target="_blank"
                rel="nofollow noreferrer"
              >
                {t('common.share_whatsapp', lang)}
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="nofollow noreferrer"
              >
                {t('common.share_facebook', lang)}
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.excerpt)}`}
                target="_blank"
                rel="nofollow noreferrer"
              >
                {t('common.share_linkedin', lang)}
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="nofollow noreferrer"
              >
                {t('common.share_x', lang)}
              </a>
              <button type="button" onClick={handleCopyLink}>
                {copied ? t('common.share_copied', lang) : t('common.share_copy', lang)}
              </button>
            </div>
          </section>
        </header>

        <div
          className="dr-blogpost-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  )
}
