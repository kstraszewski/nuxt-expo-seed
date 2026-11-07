<script setup lang="ts">
const config = useRuntimeConfig()
const stack = [
  {
    title: 'Nuxt + Vue',
    icon: 'i-lucide-panels-top-left',
    description: 'Rendering po stronie serwera, routing i API w jednym frameworku.',
  },
  {
    title: 'Nuxt UI',
    icon: 'i-lucide-component',
    description: 'Dostępne komponenty, formularze, tabele i motywy.',
  },
  {
    title: 'Neon + Drizzle',
    icon: 'i-lucide-database',
    description: 'PostgreSQL, typowany schemat i wersjonowane migracje.',
  },
  {
    title: 'Better Auth',
    icon: 'i-lucide-key-round',
    description: 'Logowanie e-mailem i hasłem. Wspólne sesje dla webu i Expo.',
  },
  {
    title: 'Expo',
    icon: 'i-lucide-smartphone',
    description: 'Natywna aplikacja na iOS i Androida oraz podgląd web.',
  },
  {
    title: 'Resend',
    icon: 'i-lucide-mail',
    description: 'Weryfikacja adresu i reset hasła z serwera.',
  },
]
</script>

<template>
  <div>
    <UHeader>
      <template #title
        ><span class="font-semibold tracking-tight"
          >seed<span class="text-muted"> / Nuxt + Expo</span></span
        ></template
      >
      <UNavigationMenu
        :items="[
          { label: 'Stack', to: '#stack' },
          { label: 'Pierwsze kroki', to: '#start' },
        ]"
      />
      <template #right
        ><UColorModeButton /><UButton
          :to="config.public.crmUrl"
          color="neutral"
          variant="outline"
          label="Otwórz CRM"
          trailing-icon="i-lucide-arrow-up-right"
      /></template>
      <template #body
        ><UNavigationMenu
          orientation="vertical"
          :items="[
            { label: 'Stack', to: '#stack' },
            { label: 'Pierwsze kroki', to: '#start' },
            { label: 'CRM', to: config.public.crmUrl },
          ]"
      /></template>
    </UHeader>
    <UMain>
      <UContainer>
        <section class="py-20 sm:py-28 max-w-3xl">
          <UBadge color="neutral" variant="subtle" label="Uniwersalna baza projektu" class="mb-6" />
          <h1 class="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight">
            Zacznij od gotowego<br />stacku technologicznego.
          </h1>
          <p class="mt-6 text-lg text-muted max-w-xl">
            Landing, CRM i aplikacja mobilna w jednym repozytorium. Dodaj własny produkt, podłącz
            usługi i rozwijaj wspólne API.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <UButton
              :to="config.public.crmUrl"
              color="neutral"
              label="Zobacz CRM"
              trailing-icon="i-lucide-arrow-right"
              size="lg"
            />
            <UButton
              :to="config.public.mobileUrl"
              color="neutral"
              variant="outline"
              label="Podgląd aplikacji Expo"
              icon="i-lucide-smartphone"
              size="lg"
            />
          </div>
        </section>
        <section id="stack" class="py-12 border-t border-default">
          <p class="text-sm text-muted uppercase tracking-wider mb-3">
            Jeden stack, trzy aplikacje
          </p>
          <h2 class="text-2xl font-semibold mb-8">Podstawy już są na miejscu.</h2>
          <div class="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
            <UCard v-for="item in stack" :key="item.title"
              ><UIcon :name="item.icon" class="size-6 text-muted mb-4" />
              <h3 class="font-semibold mb-2">{{ item.title }}</h3>
              <p class="text-muted text-sm leading-relaxed">{{ item.description }}</p></UCard
            >
          </div>
        </section>
        <section id="start" class="py-14 border-t border-default grid md:grid-cols-2 gap-8">
          <div>
            <h2 class="text-2xl font-semibold">Od pomysłu do własnego projektu.</h2>
            <p class="mt-4 text-muted">
              Skopiuj repozytorium z GitHuba przez „Use this template”. Instrukcje uruchomienia,
              wdrożeń i pracy agentów znajdziesz w README i AGENTS.md.
            </p>
            <UButton
              class="mt-6"
              to="https://github.com/kstraszewski/nuxt-expo-seed"
              target="_blank"
              color="neutral"
              variant="outline"
              label="Repozytorium na GitHubie"
              icon="i-lucide-code"
            />
          </div>
          <pre
            class="bg-elevated border border-default rounded-lg p-6 text-sm overflow-x-auto leading-8"
          ><code>pnpm install
pnpm setup:env
pnpm dev
# mobile: pnpm dev:mobile</code></pre>
        </section>
      </UContainer>
    </UMain>
    <UFooter
      ><template #left
        ><p class="text-sm text-muted">
          Nuxt + Vue + Expo. Twoja baza pod kolejny projekt.
        </p></template
      ><template #right><UColorModeButton /></template
    ></UFooter>
  </div>
</template>
