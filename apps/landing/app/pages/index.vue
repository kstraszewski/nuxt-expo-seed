<script setup lang="ts">
import StackPoster from '~/components/StackPoster.vue'
const runtimeConfig = useRuntimeConfig()
const appLinks = computed(() => ({
  crmUrl: String(runtimeConfig.public.crmUrl),
  mobileUrl: String(runtimeConfig.public.mobileUrl),
}))
const navigation = [
  { label: 'Możliwości', to: '#stack' },
  { label: 'Pierwsze kroki', to: '#start' },
]
const stack = [
  {
    number: '01',
    title: 'Nuxt + Vue',
    icon: 'i-lucide-panels-top-left',
    description:
      'Od pierwszej strony po rozbudowaną aplikację. Routing, SSR i API w jednym miejscu.',
    tag: 'Twoja aplikacja web',
  },
  {
    number: '02',
    title: 'Nuxt UI',
    icon: 'i-lucide-component',
    description:
      'Dostępne komponenty. Wspólny motyw. Formularze i interakcje, które pasują do siebie.',
    tag: 'Jeden język interfejsu',
  },
  {
    number: '03',
    title: 'Neon + Drizzle',
    icon: 'i-lucide-database',
    description:
      'PostgreSQL, typowany model danych i migracje. Przygotowane pod Twój pierwszy kontakt.',
    tag: 'Dane pod kontrolą',
  },
  {
    number: '04',
    title: 'Better Auth',
    icon: 'i-lucide-key-round',
    description:
      'Konto, sesja i bezpieczny dostęp. Wspólne logowanie dla CRM i aplikacji mobilnej.',
    tag: 'Web + mobile',
  },
  {
    number: '05',
    title: 'Expo',
    icon: 'i-lucide-smartphone',
    description:
      'Ten sam produkt na iOS i Androidzie. Gotowy początek z nawigacją i połączeniem z CRM.',
    tag: 'Bliżej użytkownika',
  },
  {
    number: '06',
    title: 'Resend',
    icon: 'i-lucide-mail',
    description:
      'Potwierdzenie adresu i reset hasła. Wiadomości, które domykają przepływ logowania.',
    tag: 'E-maile transakcyjne',
  },
]
</script>

<template>
  <div id="top">
    <a href="#main" class="skip-link">Przejdź do treści</a>
    <UHeader
      class="landing-header"
      :ui="{ container: 'landing-header-container' }"
      :toggle="{ color: 'neutral', variant: 'ghost', icon: 'i-lucide-plus', label: 'Menu' }"
    >
      <template #title
        ><span class="seed-brand"
          ><UIcon name="i-lucide-box" class="seed-brand-mark" /><span
            >seed<span class="font-normal text-muted"> / base</span></span
          ></span
        ></template
      >
      <template #right
        ><nav class="hidden lg:flex items-center gap-8" aria-label="Nawigacja główna">
          <UButton
            v-for="item in navigation"
            :key="item.to"
            v-bind="item"
            color="neutral"
            variant="link"
          /><UButton
            :to="appLinks.crmUrl"
            color="neutral"
            variant="link"
            label="Otwórz CRM"
            trailing-icon="i-lucide-arrow-up-right"
          /><UColorModeButton /></nav
      ></template>
      <template #body
        ><UNavigationMenu
          :items="[...navigation, { label: 'Otwórz CRM', to: appLinks.crmUrl }]"
          orientation="vertical" /><UColorModeButton class="mt-4"
      /></template>
    </UHeader>
    <main id="main">
      <UContainer class="landing-wrap">
        <section class="landing-hero" aria-labelledby="hero-title">
          <div class="hero-intro">
            <p class="seed-kicker mb-6">
              Nuxt. Vue. Expo. <span class="text-muted ml-2">Twój następny projekt.</span>
            </p>
            <h1 id="hero-title" class="hero-title">
              Twórz.<br />Rozwijaj.<br /><span class="text-primary">Po swojemu.</span>
            </h1>
            <p class="hero-copy">
              Landing, CRM i aplikacja mobilna. Spójna baza technologiczna, z którą od razu możesz
              zacząć budować swój produkt.
            </p>
            <div class="hero-actions">
              <UButton
                :to="appLinks.crmUrl"
                color="neutral"
                size="lg"
                label="Zobacz CRM"
                trailing-icon="i-lucide-arrow-down-right"
                class="hero-primary"
              /><UButton
                :to="appLinks.mobileUrl"
                color="neutral"
                variant="link"
                label="Otwórz Expo"
                trailing-icon="i-lucide-arrow-up-right"
              /><UButton
                to="https://github.com/kstraszewski/nuxt-expo-seed"
                target="_blank"
                color="neutral"
                variant="link"
                label="Kod źródłowy"
                trailing-icon="i-lucide-arrow-up-right"
              />
            </div>
            <div class="hero-facts" aria-label="Zawartość startera">
              <div>
                <p class="seed-stat text-primary">03</p>
                <p class="text-sm mt-2">aplikacje</p>
                <p class="text-xs text-muted mt-1">Web, CRM i mobile</p>
              </div>
              <div>
                <p class="seed-stat text-primary">01</p>
                <p class="text-sm mt-2">wspólne repo</p>
                <p class="text-xs text-muted mt-1">Gotowe pod Twój produkt</p>
              </div>
            </div>
          </div>
          <StackPoster v-bind="appLinks" />
          <div class="hero-foot">
            <span class="flex items-center gap-2"
              ><span class="size-1.5 rounded-full bg-primary" />Od pomysłu do pierwszej
              wersji.</span
            ><span
              >Open source <UIcon name="i-lucide-arrow-up-right" class="size-3.5 ml-2 align-middle"
            /></span>
          </div>
        </section>
        <section id="stack" class="stack-section" aria-labelledby="stack-title">
          <div class="section-heading">
            <div>
              <p class="seed-kicker text-muted mb-3">Fundament pod Twój produkt</p>
              <h2 id="stack-title" class="seed-title">
                Dobry stack.<br class="sm:hidden" />
                <span class="seed-highlight">Dobry początek.</span>
              </h2>
            </div>
            <span class="seed-kicker text-muted hidden sm:block">01 / 06</span>
          </div>
          <div class="stack-grid">
            <UCard
              v-for="item in stack"
              :key="item.title"
              variant="outline"
              class="stack-card"
              :ui="{ body: 'h-full p-0 sm:p-0' }"
              ><div class="flex items-center justify-between mb-9">
                <span class="seed-kicker text-muted">{{ item.number }} / FUNDAMENT</span
                ><UIcon :name="item.icon" class="size-5 text-primary" />
              </div>
              <h3 class="text-2xl font-medium tracking-[-0.04em] mb-3">{{ item.title }}</h3>
              <p class="text-muted text-[15px] leading-relaxed max-w-xs">{{ item.description }}</p>
              <p class="mt-auto pt-8 text-xs text-muted">
                <span class="inline-block pb-1 border-b border-default">{{ item.tag }}</span>
              </p></UCard
            >
          </div>
        </section>
        <section id="start" class="start-section" aria-labelledby="start-title">
          <div>
            <p class="seed-kicker text-muted mb-5">Mniej konfiguracji. Więcej tworzenia.</p>
            <h2 id="start-title" class="seed-title">
              Zacznij tutaj.<br /><span class="text-primary">Reszta jest Twoja.</span>
            </h2>
            <p class="text-muted leading-relaxed max-w-sm mt-5">
              Utwórz projekt z szablonu, uruchom go lokalnie i nadaj mu własny kierunek. Instrukcje
              dla Ciebie i agentów są już w repozytorium.
            </p>
            <UButton
              class="mt-7"
              to="https://github.com/kstraszewski/nuxt-expo-seed/generate"
              target="_blank"
              color="neutral"
              size="lg"
              label="Użyj tego szablonu"
              trailing-icon="i-lucide-arrow-up-right"
            />
          </div>
          <UCard class="setup-card" :ui="{ body: 'p-0 sm:p-0' }"
            ><div class="px-6 py-4 border-b border-default flex items-center justify-between">
              <span class="seed-kicker text-muted">Twój pierwszy terminal</span
              ><UIcon name="i-lucide-terminal" class="size-4 text-primary" />
            </div>
            <pre
              class="px-6 py-7 text-sm leading-9 overflow-x-auto"
            ><code><span class="text-muted"># Zainstaluj. Uruchom. Buduj.</span>
pnpm install
pnpm setup:env
pnpm dev

<span class="text-muted"># Aplikacja mobilna</span>
pnpm dev:mobile</code></pre>
            <div class="px-6 py-4 border-t border-default text-xs text-muted">
              Node 22.22+ · pnpm 10 · Własne zmienne w .env
            </div></UCard
          >
        </section>
      </UContainer>
    </main>
    <UContainer class="landing-wrap"
      ><footer class="landing-footer">
        <span class="seed-brand text-lg"
          >seed<span class="text-muted font-normal"> / base</span></span
        >
        <p class="text-xs text-muted">Twoja baza pod kolejny projekt.</p>
        <UColorModeButton /></footer
    ></UContainer>
  </div>
</template>

<style scoped>
.landing-header :deep(.landing-header-container) {
  width: calc(100% - 64px);
  max-width: 1200px;
  padding-inline: 0;
  margin-inline: auto;
}
.landing-wrap {
  max-width: 1200px;
  padding-inline: 0;
  margin-inline: auto;
  width: calc(100% - 64px);
}
.landing-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
  gap: 0 64px;
  padding-top: 58px;
  align-items: stretch;
}
.hero-intro {
  padding-block: 0 6px;
}
.hero-title {
  font-size: clamp(68px, 7.1vw, 102px);
  font-weight: 600;
  line-height: 0.96;
  letter-spacing: -0.065em;
  margin-left: -4px;
}
.hero-copy {
  max-width: 420px;
  margin-top: 30px;
  font-size: 18px;
  line-height: 1.6;
  color: var(--ui-text-muted);
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 30px;
}
.hero-primary {
  min-height: 48px;
  padding-inline: 20px;
  gap: 36px;
}
.hero-facts {
  display: flex;
  gap: 26px;
  margin-top: 27px;
}
.hero-facts > div + div {
  border-left: 1px solid var(--ui-border);
  padding-left: 26px;
}
.hero-foot {
  grid-column: 1/-1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding-block: 32px 27px;
  margin-top: 12px;
  border-bottom: 1px solid var(--ui-border);
  color: var(--ui-text-muted);
  font-size: 12px;
}
.stack-section {
  padding-block: 80px 70px;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  margin-bottom: 34px;
}
.stack-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--ui-border);
}
.stack-card {
  border-radius: 0;
  padding: 32px 28px 34px 0;
  box-shadow: none;
  background: transparent;
  border-bottom: 1px solid var(--ui-border);
  display: flex;
}
.stack-card :deep(> div) {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.stack-card:nth-child(3n + 2),
.stack-card:nth-child(3n + 3) {
  padding-left: 28px;
  border-left: 1px solid var(--ui-border);
}
.start-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: 100px;
  padding-block: 64px 85px;
  border-top: 1px solid var(--ui-border);
}
.setup-card {
  background: var(--ui-bg-elevated);
}
.landing-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding-block: 24px;
  border-top: 1px solid var(--ui-border);
}
.skip-link {
  position: fixed;
  left: 12px;
  top: 12px;
  z-index: 100;
  padding: 12px 18px;
  background: var(--ui-bg-inverted);
  color: var(--ui-text-inverted);
  transform: translateY(-160%);
}
.skip-link:focus {
  transform: none;
}
@media (min-width: 1280px) {
  .landing-header :deep(.landing-header-container) {
    width: 100%;
  }
  .landing-wrap {
    width: 100%;
  }
}
@media (max-width: 1100px) {
  .landing-hero {
    gap: 0 36px;
  }
  .hero-title {
    font-size: 76px;
  }
  .hero-actions {
    gap: 8px 12px;
  }
  .start-section {
    gap: 48px;
  }
}
@media (max-width: 900px) {
  .hero-title {
    font-size: 65px;
  }
  .hero-copy {
    font-size: 17px;
  }
  .landing-hero {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 0 28px;
  }
}
@media (max-width: 760px) {
  .landing-header :deep(.landing-header-container) {
    width: calc(100% - 40px);
  }
  .landing-wrap {
    width: calc(100% - 40px);
  }
  .landing-hero {
    grid-template-columns: 1fr;
    padding-top: 40px;
    gap: 35px;
  }
  .hero-title {
    font-size: clamp(57px, 12.5vw, 90px);
  }
  .hero-intro .seed-kicker {
    font-size: 9px;
  }
  .hero-copy {
    margin-top: 28px;
    font-size: 17px;
    max-width: 440px;
  }
  .hero-actions {
    margin-top: 25px;
    gap: 8px 14px;
  }
  .hero-primary {
    flex-basis: 100%;
    justify-content: space-between;
  }
  .hero-facts {
    margin-top: 25px;
  }
  .hero-foot {
    margin-top: -12px;
    padding-block: 0 24px;
    font-size: 11px;
  }
  .stack-section {
    padding-block: 56px 40px;
  }
  .stack-grid {
    grid-template-columns: 1fr 1fr;
  }
  .stack-card:nth-child(n) {
    padding: 26px 20px 28px 0;
    border-left: none;
  }
  .stack-card:nth-child(2n) {
    padding-left: 20px;
    border-left: 1px solid var(--ui-border);
  }
  .start-section {
    grid-template-columns: 1fr;
    gap: 36px;
    padding-block: 44px 56px;
  }
}
@media (max-width: 440px) {
  .stack-grid {
    grid-template-columns: 1fr;
  }
  .stack-card:nth-child(n) {
    padding: 27px 0;
    border-left: none;
  }
  .landing-footer {
    gap: 12px;
  }
  .landing-footer p {
    max-width: 120px;
    text-align: center;
  }
  .hero-foot {
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
