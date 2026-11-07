export default defineNuxtConfig({
  extends: ['@seed/ui'],
  compatibilityDate: '2026-11-07',
  modules: ['@nuxt/ui', '@nuxt/eslint', 'nuxt-skill-hub'],
  skillHub: { targets: ['codex'], generationMode: 'prepare', skillName: 'nuxt-landing' },
  css: ['~/assets/css/main.css'],
  ui: { fonts: false },
  devtools: { enabled: true },
  typescript: { strict: true },
  runtimeConfig: {
    public: { crmUrl: 'http://localhost:3001', mobileUrl: 'http://localhost:8081' },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'pl' },
      title: 'Seed | Nuxt + Expo',
      meta: [{ name: 'description', content: 'Uniwersalny starter Nuxt, Vue i Expo.' }],
    },
  },
})
