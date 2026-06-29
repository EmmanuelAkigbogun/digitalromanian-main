const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const isProduction = import.meta.env.PROD

function isLocalApiUrl(value) {
  try {
    const url = new URL(value)
    return ['localhost', '127.0.0.1', '0.0.0.0', '[::1]'].includes(url.hostname)
  } catch {
    return false
  }
}

function normalizeApiBaseUrl(value) {
  if (!value || ['undefined', 'null'].includes(value.toLowerCase())) {
    return '/api'
  }

  const baseUrl = value.replace(/\/+$/, '')

  if (isProduction && /^https?:\/\//i.test(baseUrl) && isLocalApiUrl(baseUrl)) {
    return '/api'
  }

  if (baseUrl.startsWith('/') || /^https?:\/\//i.test(baseUrl)) {
    return baseUrl
  }

  return `/${baseUrl}`
}

const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl)

export function apiEndpoint(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${apiBaseUrl}${normalizedPath}`
}
