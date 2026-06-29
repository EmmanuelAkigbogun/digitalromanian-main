import { promises as fs } from 'node:fs'
import path from 'node:path'
import { emailLayout, escapeHtml, sendMail } from '../_mail.js'
import {
  isBlogPostPublished,
  listNewsletterSubscribersByLang,
  markBlogPostPublished,
} from '../_automationStorage.js'

const siteUrl = process.env.PUBLIC_SITE_URL || 'https://digitalromanian.com'
const weekMs = 7 * 24 * 60 * 60 * 1000
const defaultStartAtUtc = '2026-05-10T22:00:00.000Z' // 11 May 2026, 00:00 GMT+2
const startAtUtc = process.env.BLOG_AUTOMATION_START_UTC || defaultStartAtUtc
const maxAutomatedPosts = Number(process.env.BLOG_AUTOMATION_MAX_POSTS || 20)
const vaultRoFilePath = path.join(process.cwd(), 'api', 'data', 'vault', 'postsVault.ro.json')
const vaultEnFilePath = path.join(process.cwd(), 'api', 'data', 'vault', 'postsVault.en.json')
const vaultDeFilePath = path.join(process.cwd(), 'api', 'data', 'vault', 'postsVault.de.json')
const languageLabels = {
  ro: {
    subjectPrefix: 'Noutate pe blog',
    cta: 'Citește articolul',
  },
  en: {
    subjectPrefix: 'New blog post',
    cta: 'Read the article',
  },
  de: {
    subjectPrefix: 'Neuer Blogbeitrag',
    cta: 'Artikel lesen',
  },
}

function setHeaders(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
}

function sendJson(res, statusCode, payload) {
  setHeaders(res)
  res.statusCode = statusCode
  res.end(JSON.stringify(payload))
}

function isAuthorized(req) {
  if (!process.env.CRON_SECRET) return true
  return req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`
}

async function getNextDuePost() {
  const raw = await fs.readFile(vaultRoFilePath, 'utf8')
  const vault = JSON.parse(raw)
  const posts = Array.isArray(vault?.articles)
    ? [...vault.articles]
      .sort((a, b) => (a.number || 0) - (b.number || 0))
      .slice(0, maxAutomatedPosts)
    : []

  if (!posts.length) return null

  const now = new Date()
  const startMs = new Date(startAtUtc).getTime()

  for (let index = 0; index < posts.length; index += 1) {
    const post = posts[index]
    const slug = post?.slug
    if (!slug) continue

    const alreadyPublished = await isBlogPostPublished(slug)
    if (alreadyPublished) continue

    const dueAt = new Date(startMs + index * weekMs)

    if (now < dueAt) {
      return {
        due: false,
        nextDueAt: dueAt.toISOString(),
        slug,
      }
    }

    return {
      due: true,
      slug,
      title: post.title,
      excerpt: post.excerpt,
      publishAt: dueAt.toISOString(),
    }
  }

  return {
    due: false,
    finished: true,
    message: 'all_posts_published',
  }
}

async function getLocalizedPostsBySlug(slug) {
  const [roRaw, enRaw, deRaw] = await Promise.all([
    fs.readFile(vaultRoFilePath, 'utf8'),
    fs.readFile(vaultEnFilePath, 'utf8'),
    fs.readFile(vaultDeFilePath, 'utf8'),
  ])

  const roVault = JSON.parse(roRaw)
  const enVault = JSON.parse(enRaw)
  const deVault = JSON.parse(deRaw)

  const roPost = roVault?.articles?.find((item) => item.slug === slug)
  const enPost = enVault?.articles?.find((item) => item.slug === slug)
  const dePost = deVault?.articles?.find((item) => item.slug === slug)

  return {
    ro: roPost,
    en: enPost,
    de: dePost,
  }
}

async function sendPostToSubscribersByLang(post, subscribers, lang = 'ro') {
  const labels = languageLabels[lang] || languageLabels.ro
  const postUrl = `${siteUrl}/resurse/${post.slug}`

  const chunkSize = 20

  for (let index = 0; index < subscribers.length; index += chunkSize) {
    const batch = subscribers.slice(index, index + chunkSize)

    await Promise.all(batch.map((subscriber) => {
      const to = subscriber?.email
      if (!to) return Promise.resolve()

      return sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: `${labels.subjectPrefix}: ${post.title}`,
        html: emailLayout(`
          <h2>${escapeHtml(post.title)}</h2>
          <p>${escapeHtml(post.excerpt || '')}</p>
          <p><a href="${postUrl}">${labels.cta}</a></p>
        `),
      })
    }))
  }

  return postUrl
}

export default async function handler(req, res) {
  setHeaders(res)

  if (req.method !== 'GET' && req.method !== 'POST') {
    sendJson(res, 405, { success: false, error: 'method_not_allowed' })
    return
  }

  if (!isAuthorized(req)) {
    sendJson(res, 401, { success: false, error: 'unauthorized' })
    return
  }

  try {
    const nextPost = await getNextDuePost()

    if (!nextPost) {
      sendJson(res, 200, { success: true, message: 'no_due_post' })
      return
    }

    if (!nextPost.due) {
      sendJson(res, 200, {
        success: true,
        message: nextPost.message || 'next_post_not_due',
        nextDueAt: nextPost.nextDueAt,
        slug: nextPost.slug,
      })
      return
    }

    const localizedPosts = await getLocalizedPostsBySlug(nextPost.slug)
    const [roSubscribers, enSubscribers, deSubscribers] = await Promise.all([
      listNewsletterSubscribersByLang('ro'),
      listNewsletterSubscribersByLang('en'),
      listNewsletterSubscribersByLang('de'),
    ])

    const roPost = localizedPosts.ro || nextPost
    const enPost = localizedPosts.en || roPost
    const dePost = localizedPosts.de || roPost

    const [roPostUrl, enPostUrl, dePostUrl] = await Promise.all([
      sendPostToSubscribersByLang(roPost, roSubscribers, 'ro'),
      sendPostToSubscribersByLang(enPost, enSubscribers, 'en'),
      sendPostToSubscribersByLang(dePost, deSubscribers, 'de'),
    ])

    await markBlogPostPublished(nextPost.slug)

    const totalNotified = roSubscribers.length + enSubscribers.length + deSubscribers.length

    await sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `Auto blog publish: ${nextPost.title}`,
      html: `
        <h2>Publicare automată rulată</h2>
        <p><strong>Articol:</strong> ${escapeHtml(nextPost.title)}</p>
        <p><strong>Slug:</strong> ${escapeHtml(nextPost.slug)}</p>
        <p><strong>Link RO:</strong> <a href="${roPostUrl}">${roPostUrl}</a></p>
        <p><strong>Link EN:</strong> <a href="${enPostUrl}">${enPostUrl}</a></p>
        <p><strong>Link DE:</strong> <a href="${dePostUrl}">${dePostUrl}</a></p>
        <p><strong>Abonați notificați RO:</strong> ${roSubscribers.length}</p>
        <p><strong>Abonați notificați EN:</strong> ${enSubscribers.length}</p>
        <p><strong>Abonați notificați DE:</strong> ${deSubscribers.length}</p>
        <p><strong>Total notificați:</strong> ${totalNotified}</p>
      `,
    })

    sendJson(res, 200, {
      success: true,
      published: true,
      slug: nextPost.slug,
      publishAt: nextPost.publishAt,
      subscribersNotified: {
        ro: roSubscribers.length,
        en: enSubscribers.length,
        de: deSubscribers.length,
        total: totalNotified,
      },
    })
  } catch (error) {
    console.error(error)
    sendJson(res, 500, { success: false, error: 'cron_publish_failed' })
  }
}
