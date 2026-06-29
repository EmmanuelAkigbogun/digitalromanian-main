import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const POSTS_DIR = path.join(ROOT, 'content', 'posts')
const LANGS = ['ro', 'en', 'de']

function parseFrontmatter(rawContent) {
  const match = rawContent.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const frontmatter = {}

  match[1].split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':')
    if (!key || !valueParts.length) return

    frontmatter[key.trim()] = valueParts
      .join(':')
      .trim()
      .replace(/^['"]|['"]$/g, '')
  })

  return frontmatter
}

async function main() {
  const files = (await fs.readdir(POSTS_DIR)).filter((name) => name.endsWith('.md'))

  if (!files.length) {
    console.log('No markdown blog posts found in content/posts.')
    return
  }

  const slugMap = new Map()

  for (const fileName of files) {
    const filePath = path.join(POSTS_DIR, fileName)
    const raw = await fs.readFile(filePath, 'utf8')
    const fm = parseFrontmatter(raw)
    const slug = fm.slug
    const lang = fm.lang

    if (!slug || !LANGS.includes(lang)) continue

    const byLang = slugMap.get(slug) || {}
    byLang[lang] = {
      fileName,
      draft: fm.draft === 'true',
      title: fm.title || '(untitled)',
    }
    slugMap.set(slug, byLang)
  }

  const slugs = Array.from(slugMap.keys()).sort()
  let missingTotal = 0

  console.log(`Checked ${slugs.length} unique slugs.\n`)

  for (const slug of slugs) {
    const byLang = slugMap.get(slug)
    const missing = LANGS.filter((lang) => !byLang[lang])

    if (!missing.length) continue

    missingTotal += missing.length
    console.log(`- ${slug}`)
    console.log(`  missing: ${missing.join(', ')}`)
  }

  if (!missingTotal) {
    console.log('✅ All slugs have ro/en/de variants.')
  } else {
    console.log(`\n⚠️ Missing variants: ${missingTotal}`)
  }

  let publishMismatch = 0

  console.log('\nPublish-state check per slug:')

  for (const slug of slugs) {
    const byLang = slugMap.get(slug)
    const presentLangs = LANGS.filter((lang) => byLang[lang])
    const states = presentLangs.map((lang) => `${lang}:${byLang[lang].draft ? 'draft' : 'live'}`)
    const hasLive = presentLangs.some((lang) => !byLang[lang].draft)
    const hasDraft = presentLangs.some((lang) => byLang[lang].draft)

    if (hasLive && hasDraft) {
      publishMismatch += 1
      console.log(`- ${slug} -> ${states.join(' | ')}`)
    }
  }

  if (!publishMismatch) {
    console.log('✅ No mixed draft/live states across language variants.')
  } else {
    console.log(`⚠️ Slugs with mixed draft/live states: ${publishMismatch}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
