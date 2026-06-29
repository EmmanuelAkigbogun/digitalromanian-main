import { promises as fs } from 'node:fs'
import path from 'node:path'
import { listPublishedBlogSlugs } from './_automationStorage.js'

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

function getPublishedScheduleMap(posts) {
  const startAtUtc = process.env.BLOG_AUTOMATION_START_UTC || defaultStartAtUtc
  const startMs = new Date(startAtUtc).getTime()
  const maxAutomatedPosts = Number(process.env.BLOG_AUTOMATION_MAX_POSTS || 20)

  const sorted = [...posts]
    .sort((a, b) => (a.number || 0) - (b.number || 0))
    .slice(0, maxAutomatedPosts)

  return sorted.map((post, index) => ({
    slug: post.slug,
    publishAt: new Date(startMs + index * weekMs).toISOString(),
    index,
  }))
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { success: false, error: 'method_not_allowed' })
    return
  }

  try {
    const lang = normalizeLang(req.query?.lang)
    const [roVault, langVault, publishedSlugs] = await Promise.all([
      readVault('ro'),
      readVault(lang),
      listPublishedBlogSlugs(),
    ])

    const roPosts = Array.isArray(roVault?.articles) ? roVault.articles : []
    const langPosts = Array.isArray(langVault?.articles) ? langVault.articles : []
    const schedule = getPublishedScheduleMap(roPosts)
    const publishedSet = new Set(publishedSlugs)
    const langBySlug = new Map(langPosts.map((post) => [post.slug, post]))
    const roBySlug = new Map(roPosts.map((post) => [post.slug, post]))

    const posts = schedule
      .filter((item) => item.slug && publishedSet.has(item.slug))
      .map((item) => {
        const localized = langBySlug.get(item.slug) || roBySlug.get(item.slug)
        const fallback = roBySlug.get(item.slug)

        return {
          slug: item.slug,
          title: localized?.title || fallback?.title || 'Articol fără titlu',
          category: localized?.content_cluster || fallback?.content_cluster || 'Blog',
          excerpt: localized?.excerpt || fallback?.excerpt || '',
          date: item.publishAt,
          href: `/resurse/${item.slug}`,
        }
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    sendJson(res, 200, { success: true, posts })
  } catch (error) {
    console.error(error)
    sendJson(res, 500, { success: false, error: 'blog_fetch_failed' })
  }
}
