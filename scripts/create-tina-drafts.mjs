import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const VAULT_DIR = path.join(ROOT, 'api', 'data', 'vault')
const POSTS_DIR = path.join(ROOT, 'content', 'posts')
const LANGS = ['ro', 'en', 'de']

function normalizeLang(input, fallback) {
  const value = String(input || '').toLowerCase()
  return LANGS.includes(value) ? value : fallback
}

function q(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/"/g, '\\"')
}

async function readVault(lang) {
  const filePath = path.join(VAULT_DIR, `postsVault.${lang}.json`)
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

function dateFromNumber(number) {
  const base = new Date('2026-05-11T00:00:00.000Z')
  const n = Number(number || 1)
  base.setUTCDate(base.getUTCDate() - Math.max(0, n - 1))
  return base.toISOString()
}

function toMarkdown(post, lang) {
  const imageFile = `${Number(post.number || 1)}.png`

  return `---
slug: ${post.slug}
lang: ${lang}
title: "${q(post.title || 'Untitled')}"
category: "${q(post.content_cluster || 'Blog')}"
excerpt: "${q(post.excerpt || '')}"
date: ${dateFromNumber(post.number)}
draft: true
image: ${imageFile}
---
${String(post.article_body || '').trim()}
`
}

async function main() {
  await fs.mkdir(POSTS_DIR, { recursive: true })

  const existing = await fs.readdir(POSTS_DIR)
  await Promise.all(
    existing
      .filter((name) => name.endsWith('.md'))
      .map((name) => fs.unlink(path.join(POSTS_DIR, name))),
  )

  let written = 0

  for (const fallback of LANGS) {
    const vault = await readVault(fallback)
    const lang = normalizeLang(vault.language, fallback)
    const articles = Array.isArray(vault.articles) ? vault.articles : []

    for (const post of articles) {
      if (!post?.slug) continue
      const fileName = `${String(post.number || 0).padStart(2, '0')}-${post.slug}.${lang}.md`
      const filePath = path.join(POSTS_DIR, fileName)
      await fs.writeFile(filePath, toMarkdown(post, lang), 'utf8')
      written += 1
    }
  }

  console.log(`Created ${written} Tina drafts in content/posts.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
