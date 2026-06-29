import { promises as fs } from 'node:fs'
import path from 'node:path'
import { listPublishedBlogSlugs } from '../_automationStorage.js'

const defaultStartAtUtc = '2026-05-10T22:00:00.000Z' // 11 May 2026, 00:00 GMT+2
const weekMs = 7 * 24 * 60 * 60 * 1000

function setHeaders(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
}

function sendJson(res, statusCode, payload) {
  setHeaders(res)
  res.statusCode = statusCode
  res.end(JSON.stringify(payload))
}

function normalizeLang(lang) {
  return ['ro', 'en', 'de'].includes(lang) ? lang : 'ro'
}

async function readVault(lang = 'ro') {
  const normalizedLang = normalizeLang(lang)
  const filePath = path.join(process.cwd(), 'api', 'data', 'vault', `postsVault.${normalizedLang}.json`)
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

function getPublishDateBySlug(roPosts, slug) {
  const startAtUtc = process.env.BLOG_AUTOMATION_START_UTC || defaultStartAtUtc
  const startMs = new Date(startAtUtc).getTime()
  const maxAutomatedPosts = Number(process.env.BLOG_AUTOMATION_MAX_POSTS || 20)

  const sorted = [...roPosts]
    .sort((a, b) => (a.number || 0) - (b.number || 0))
    .slice(0, maxAutomatedPosts)

  const index = sorted.findIndex((post) => post.slug === slug)
  if (index === -1) return null

  return new Date(startMs + index * weekMs).toISOString()
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { success: false, error: 'method_not_allowed' })
    return
  }

  try {
    const slug = req.query?.slug
    const lang = normalizeLang(req.query?.lang)

    if (!slug) {
      sendJson(res, 400, { success: false, error: 'missing_slug' })
      return
    }

    const [roVault, langVault, publishedSlugs] = await Promise.all([
      readVault('ro'),
      readVault(lang),
      listPublishedBlogSlugs(),
    ])

    const publishedSet = new Set(publishedSlugs)
    if (!publishedSet.has(slug)) {
      sendJson(res, 404, { success: false, error: 'post_not_published' })
      return
    }

    const roPosts = Array.isArray(roVault?.articles) ? roVault.articles : []
    const langPosts = Array.isArray(langVault?.articles) ? langVault.articles : []

    const localized = langPosts.find((post) => post.slug === slug)
    const fallback = roPosts.find((post) => post.slug === slug)
    const source = localized || fallback

    if (!source) {
      sendJson(res, 404, { success: false, error: 'post_not_found' })
      return
    }

    const publishAt = getPublishDateBySlug(roPosts, slug)

    sendJson(res, 200, {
      success: true,
      post: {
        slug,
        title: source.title || fallback?.title || 'Articol fără titlu',
        category: source.content_cluster || fallback?.content_cluster || 'Blog',
        excerpt: source.excerpt || fallback?.excerpt || '',
        date: publishAt,
        body: source.article_body || fallback?.article_body || '',
      },
    })
  } catch (error) {
    console.error(error)
    sendJson(res, 500, { success: false, error: 'blog_post_fetch_failed' })
  }
}
