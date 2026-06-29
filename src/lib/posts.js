const postFiles = import.meta.glob('../../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const blogImages = import.meta.glob('../assets/blog-posts/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

const DEFAULT_LANG = 'ro'

function parseFrontmatterValue(value) {
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '')

  if (trimmed === 'true') return true
  if (trimmed === 'false') return false

  if (/^-?\d+$/.test(trimmed)) {
    return Number(trimmed)
  }

  return trimmed
}

function parseFrontmatter(rawContent) {
  const match = rawContent.match(/^---\n([\s\S]*?)\n---/)
  const frontmatter = {}

  if (!match) return frontmatter

  match[1].split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':')
    if (!key || !valueParts.length) return

    frontmatter[key.trim()] = parseFrontmatterValue(valueParts.join(':'))
  })

  return frontmatter
}

function resolveBlogImage(imageField) {
  if (!imageField && imageField !== 0) return null

  const normalizedValue = String(imageField).trim()
  const fileName = /\.(png|jpg|jpeg|webp)$/i.test(normalizedValue)
    ? normalizedValue.split('/').pop()
    : `${normalizedValue}.png`

  return blogImages[`../assets/blog-posts/${fileName}`] || null
}

function getRawPosts() {
  return Object.entries(postFiles)
    .map(([path, rawContent]) => {
      const data = parseFrontmatter(rawContent)
      const fallbackSlug = path.split('/').pop().replace('.md', '')
      const slug = data.slug || fallbackSlug

      return {
        title: data.title || 'Articol fără titlu',
        category: data.category || 'Blog',
        excerpt: data.excerpt || '',
        date: data.date || 'În curând',
        lang: data.lang || DEFAULT_LANG,
        draft: Boolean(data.draft),
        imageUrl: resolveBlogImage(data.image || data.imageNumber),
        slug,
        href: `/resurse/${slug}`,
        body: rawContent.replace(/^---\n[\s\S]*?\n---\n?/, ''),
      }
    })
}

function selectLocalizedVariants(posts, lang = DEFAULT_LANG, { publishedOnly = false } = {}) {
  const grouped = new Map()

  posts.forEach((post) => {
    const list = grouped.get(post.slug) || []
    list.push(post)
    grouped.set(post.slug, list)
  })

  return Array.from(grouped.values()).map((variants) => {
    const candidatePool = publishedOnly
      ? variants.filter((variant) => !variant.draft)
      : variants

    const pool = candidatePool.length ? candidatePool : variants
    return pool.find((variant) => variant.lang === lang) || null
  })
}

export function getBlogPosts(lang = DEFAULT_LANG) {
  const rawPosts = getRawPosts()

  return selectLocalizedVariants(rawPosts, lang, { publishedOnly: true })
    .filter(Boolean)
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPostBySlug(slug, lang = DEFAULT_LANG) {
  const posts = selectLocalizedVariants(getRawPosts(), lang, { publishedOnly: true })
    .filter(Boolean)
    .filter((post) => !post.draft)
  const post = posts.find((item) => item.slug === slug)

  if (!post) return null

  return {
    ...post,
  }
}

export async function getBlogPostsAsync(lang = DEFAULT_LANG) {
  return getBlogPosts(lang)
}

export async function getPostBySlugAsync(slug, lang = DEFAULT_LANG) {
  return getPostBySlug(slug, lang)
}
