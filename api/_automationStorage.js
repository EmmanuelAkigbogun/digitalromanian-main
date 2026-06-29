import { Redis } from '@upstash/redis'

const SUBSCRIBERS_HASH_KEY = 'dr:newsletter:subscribers'
const PUBLISHED_SET_KEY = 'dr:blog:published'

const isProduction = process.env.NODE_ENV === 'production'
const localSubscribers = new Map()
const localPublished = new Set()

let redisClient

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null

  if (!redisClient) {
    redisClient = new Redis({ url, token })
  }

  return redisClient
}

function ensureStorageAvailable() {
  const redis = getRedisClient()
  if (redis) return redis

  if (!isProduction) {
    return null
  }

  throw new Error('Secure storage is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.')
}

export async function upsertNewsletterSubscriber({ email, source = 'unknown', lang = 'ro' }) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail) return

  const normalizedLang = ['ro', 'en', 'de'].includes(lang) ? lang : 'ro'

  const payload = {
    email: normalizedEmail,
    source,
    lang: normalizedLang,
    subscribedAt: new Date().toISOString(),
  }

  const redis = ensureStorageAvailable()

  if (redis) {
    await redis.hset(SUBSCRIBERS_HASH_KEY, {
      [normalizedEmail]: JSON.stringify(payload),
    })
    return
  }

  localSubscribers.set(normalizedEmail, payload)
}

export async function listNewsletterSubscribers() {
  const redis = ensureStorageAvailable()

  if (redis) {
    const raw = await redis.hgetall(SUBSCRIBERS_HASH_KEY)
    if (!raw || typeof raw !== 'object') return []

    return Object.values(raw)
      .map((value) => {
        try {
          return JSON.parse(value)
        } catch {
          return null
        }
      })
      .filter(Boolean)
  }

  return Array.from(localSubscribers.values())
}

export async function listNewsletterSubscribersByLang(lang = 'ro') {
  const normalizedLang = ['ro', 'en', 'de'].includes(lang) ? lang : 'ro'
  const subscribers = await listNewsletterSubscribers()

  return subscribers.filter((subscriber) => {
    const subscriberLang = ['ro', 'en', 'de'].includes(subscriber?.lang)
      ? subscriber.lang
      : 'ro'
    return subscriberLang === normalizedLang
  })
}

export async function isBlogPostPublished(slug) {
  const redis = ensureStorageAvailable()

  if (redis) {
    const exists = await redis.sismember(PUBLISHED_SET_KEY, slug)
    return Boolean(exists)
  }

  return localPublished.has(slug)
}

export async function listPublishedBlogSlugs() {
  const redis = ensureStorageAvailable()

  if (redis) {
    const slugs = await redis.smembers(PUBLISHED_SET_KEY)
    return Array.isArray(slugs) ? slugs : []
  }

  return Array.from(localPublished)
}

export async function markBlogPostPublished(slug) {
  const redis = ensureStorageAvailable()

  if (redis) {
    await redis.sadd(PUBLISHED_SET_KEY, slug)
    return
  }

  localPublished.add(slug)
}
