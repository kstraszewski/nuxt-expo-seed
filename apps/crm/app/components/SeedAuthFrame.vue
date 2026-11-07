<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    accent: string
    description: string
  }>(),
  { eyebrow: '02 / Dostęp do przestrzeni' },
)
</script>

<template>
  <div class="min-h-svh bg-default">
    <UContainer class="max-w-7xl">
      <header class="h-24 sm:h-28 flex items-center justify-between gap-4 border-b border-default">
        <NuxtLink to="/" aria-label="Seed CRM, strona główna" class="flex items-baseline gap-2.5">
          <span class="text-primary text-4xl leading-none font-bold tracking-[-0.08em]">s.</span>
          <span class="text-xl font-semibold tracking-tight"
            >seed<span class="text-muted font-normal"> / crm</span></span
          >
        </NuxtLink>
        <div class="flex items-center gap-2 sm:gap-5">
          <UButton
            to="/"
            color="neutral"
            variant="link"
            icon="i-lucide-arrow-left"
            label="Wróć do CRM"
            class="text-xs sm:text-sm"
          />
          <UColorModeButton />
        </div>
      </header>

      <main class="grid lg:grid-cols-[1fr_1fr] lg:min-h-[calc(100svh-12rem)]">
        <div
          class="py-12 sm:py-16 lg:py-20 lg:pr-14 xl:pr-24 lg:border-r border-default flex flex-col justify-between gap-10 lg:gap-20"
        >
          <div>
            <p class="seed-kicker text-muted mb-6 lg:mb-8">{{ eyebrow }}</p>
            <h1
              class="seed-title text-[clamp(3rem,5vw,5rem)] leading-[0.98] tracking-[-0.065em] font-semibold"
            >
              {{ title }}<span class="block text-primary">{{ accent }}</span>
            </h1>
            <p class="text-base sm:text-lg text-muted leading-relaxed max-w-sm mt-6 lg:mt-8">
              {{ description }}
            </p>
          </div>
          <div class="hidden lg:block">
            <div class="flex items-center gap-3 mb-5">
              <span class="size-2 bg-primary" /><span class="seed-kicker text-muted"
                >Jedna przestrzeń. Web + mobile.</span
              >
            </div>
            <p class="border-t border-default pt-5 text-sm text-muted max-w-sm">
              Twoje konto łączy CRM i aplikację mobilną. Dane kontaktów zostają w Twojej
              przestrzeni.
            </p>
          </div>
        </div>

        <div class="lg:pl-14 xl:pl-24 pt-2 pb-16 lg:py-20 flex items-center">
          <div class="w-full max-w-md mx-auto lg:mx-0"><slot /></div>
        </div>
      </main>

      <footer
        class="border-t border-default py-6 flex flex-wrap justify-between gap-3 text-xs text-muted"
      >
        <p>seed / Twoja baza pod kolejny projekt</p>
        <span class="seed-kicker">Zacznij od dobrych podstaw.</span>
      </footer>
    </UContainer>
  </div>
</template>
