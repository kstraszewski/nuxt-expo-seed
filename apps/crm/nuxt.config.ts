export default defineNuxtConfig({
  extends: ['@seed/ui'],
  compatibilityDate: '2026-11-07',
  modules: ['@nuxt/ui', '@nuxt/eslint', 'nuxt-skill-hub'],
  skillHub: { targets: ['codex'], generationMode: 'prepare', skillName: 'nuxt-crm' },
  css: ['~/assets/css/main.css'],
  ui: { fonts: false },
  devtools: { enabled: true },
  typescript: { strict: true },
  runtimeConfig: { public: { landingUrl: 'http://localhost:3000' } },
  nitro: { externals: { inline: ['@seed/auth', '@seed/db', '@seed/email', '@seed/shared'] } },
  routeRules: { '/api/**': { headers: { 'Cache-Control': 'no-store' } } },
  app: {
    head: {
      htmlAttrs: { lang: 'pl' },
      title: 'Seed | CRM',
      meta: [{ name: 'robots', content: 'noindex, nofollow' }],
    },
  },
})
