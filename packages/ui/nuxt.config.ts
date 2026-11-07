import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  $meta: { name: 'seed-ui' },
  css: [fileURLToPath(new URL('./app/assets/css/main.css', import.meta.url))],
  colorMode: { preference: 'light', fallback: 'light' },
})
