import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const POSTS_DIR = path.join(ROOT, 'content', 'posts')

function getArgValue(flag) {
  const index = process.argv.indexOf(flag)
  if (index === -1) return null
  return process.argv[index + 1] || null
}

function hasFlag(flag) {
  return process.argv.includes(flag)
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null

  const data = {}
  match[1].split('\n').forEach((line) => {
    const [key, ...rest] = line.split(':')
    if (!key || !rest.length) return
    data[key.trim()] = rest.join(':').trim().replace(/^['"]|['"]$/g, '')
  })

  return {
    data,
    block: match[0],
    content: match[1],
  }
}

function setDraftValue(frontmatterBlock, draftValue) {
  const nextLine = `draft: ${draftValue}`

  if (/^draft:\s*(true|false)\s*$/m.test(frontmatterBlock)) {
    return frontmatterBlock.replace(/^draft:\s*(true|false)\s*$/m, nextLine)
  }

  return `${frontmatterBlock}\n${nextLine}`
}

async function main() {
  const slugArg = getArgValue('--slug')
  const statusArg = getArgValue('--status') || 'published'
  const langArg = getArgValue('--lang')
  const allFlag = hasFlag('--all')

  const targetDraftValue = statusArg === 'draft' ? 'true' : 'false'

  const files = (await fs.readdir(POSTS_DIR)).filter((name) => name.endsWith('.md'))
  const targetSlugs = slugArg
    ? slugArg.split(',').map((item) => item.trim()).filter(Boolean)
    : []

  let updated = 0

  for (const fileName of files) {
    const filePath = path.join(POSTS_DIR, fileName)
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = parseFrontmatter(raw)
    if (!parsed) continue

    const postSlug = parsed.data.slug
    const postLang = parsed.data.lang

    const matchesScope = allFlag
      || (targetSlugs.length > 0 && targetSlugs.includes(postSlug))

    if (!matchesScope) continue
    if (langArg && postLang !== langArg) continue

    const nextFrontmatter = setDraftValue(parsed.content, targetDraftValue)
    const nextRaw = raw.replace(parsed.block, `---\n${nextFrontmatter}\n---`)

    if (nextRaw !== raw) {
      await fs.writeFile(filePath, nextRaw, 'utf8')
      updated += 1
    }
  }

  console.log(`Updated ${updated} file(s).`)

  if (!allFlag && targetSlugs.length === 0) {
    console.log('Tip: use --slug <slug> or --all')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
