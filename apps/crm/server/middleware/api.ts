export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/')) return
  setHeader(event, 'Cache-Control', 'no-store')
  const origin = getHeader(event, 'origin')
  const base = new URL(process.env.BETTER_AUTH_URL || 'http://localhost:3001').origin
  const allowed = new Set([
    base,
    ...(process.env.TRUSTED_ORIGINS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  ])
  if (origin) {
    if (!allowed.has(origin))
      throw createError({ statusCode: 403, statusMessage: 'Origin is not allowed.' })
    setHeader(event, 'Access-Control-Allow-Origin', origin)
    setHeader(event, 'Access-Control-Allow-Credentials', 'true')
    setHeader(event, 'Vary', 'Origin')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    setHeader(
      event,
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Expo-Origin, X-Requested-With, Cookie',
    )
  }
  if (getMethod(event) === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }
})
