<script setup lang="ts">
const props = defineProps<{ crmUrl: string; mobileUrl: string }>()
const selected = ref(1)
const hydrated = ref(false)
onMounted(() => {
  hydrated.value = true
})
const applications = computed(() => [
  {
    name: 'Landing',
    description: 'Pierwsze wrażenie. Twoja historia.',
    icon: 'i-lucide-panels-top-left',
    to: '#stack',
    number: '01',
  },
  {
    name: 'CRM',
    description: 'Twoi klienci. Twoja przestrzeń.',
    icon: 'i-lucide-users',
    to: props.crmUrl,
    number: '02',
  },
  {
    name: 'Mobile',
    description: 'Ten sam produkt. Bliżej użytkownika.',
    icon: 'i-lucide-smartphone',
    to: props.mobileUrl,
    number: '03',
  },
])
const active = computed(() => applications.value[selected.value]!)
</script>

<template>
  <UCard
    class="seed-poster stack-poster"
    variant="solid"
    :ui="{ body: 'p-6 sm:p-7 flex-1 flex flex-col' }"
  >
    <div class="flex justify-between items-center gap-4 seed-kicker text-[9px]">
      <span>Jedna baza. Wiele możliwości.</span>
      <UIcon name="i-lucide-arrow-up-right" class="size-5" />
    </div>
    <div class="stack-stage" aria-hidden="true">
      <div class="stack-orbit" aria-hidden="true" />
      <div class="stack-sculpture">
        <div
          v-for="(app, index) in applications"
          :key="app.name"
          class="stack-layer"
          :class="[`stack-layer-${index}`, { 'is-selected': selected === index }]"
        >
          <span class="stack-layer-label"
            ><span>{{ app.number }} / {{ app.name }}</span
            ><UIcon :name="app.icon" class="size-6"
          /></span>
        </div>
      </div>
    </div>
    <div class="mt-auto">
      <div class="flex items-end justify-between gap-4">
        <p class="poster-heading">Pomysł.<br />Kod. Produkt.</p>
        <UIcon name="i-lucide-arrow-up-right" class="poster-arrow size-10" />
      </div>
      <div class="poster-selection" aria-live="polite">
        <div>
          <div class="poster-tabs" role="group" aria-label="Wybierz aplikację do podglądu">
            <UButton
              v-for="(app, index) in applications"
              :key="app.name"
              variant="link"
              color="neutral"
              class="poster-tab"
              :class="{ 'is-selected': selected === index }"
              :aria-pressed="selected === index"
              :disabled="!hydrated"
              :aria-label="`Pokaż ${app.name}`"
              @click="selected = index"
              >{{ app.name }}</UButton
            >
          </div>
          <p class="text-xs mt-1 opacity-80">{{ active.description }}</p>
        </div>
        <UButton
          :to="active.to"
          variant="link"
          color="neutral"
          :aria-label="`Otwórz ${active.name}`"
          icon="i-lucide-arrow-up-right"
          class="poster-open"
        />
      </div>
    </div>
  </UCard>
</template>

<style scoped>
.stack-poster {
  display: flex;
  flex-direction: column;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 620px;
  box-shadow: none;
}
.stack-poster::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  content: '';
  background-image:
    linear-gradient(rgb(255 255 255 / 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 0.08) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 80% 65% at 50% 44%, black 20%, transparent 80%);
}
.stack-stage {
  position: relative;
  height: 320px;
  margin-block: 22px 4px;
}
.stack-orbit {
  position: absolute;
  inset: 5% 2%;
  border: 1px dashed rgb(255 255 255 / 0.3);
  border-radius: 50%;
  transform: rotate(-24deg) scaleY(0.68);
}
.stack-sculpture {
  position: absolute;
  width: 73%;
  height: 200px;
  left: 14%;
  top: 64px;
  transform-style: preserve-3d;
  transform: perspective(950px) rotateX(53deg) rotateZ(-34deg);
}
.stack-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 24px;
  border: 1px solid rgb(255 255 255 / 0.7);
  color: var(--seed-poster-text);
  background: var(--seed-poster-bg);
  transform-style: preserve-3d;
  transition:
    transform 250ms var(--seed-ease),
    background-color 250ms var(--seed-ease);
  justify-content: stretch;
}
.stack-layer::after {
  position: absolute;
  left: -1px;
  right: -1px;
  top: 100%;
  height: 19px;
  content: '';
  border: 1px solid rgb(255 255 255 / 0.6);
  background: color-mix(in srgb, var(--seed-poster-bg), black 15%);
  transform-origin: top;
  transform: rotateX(-90deg);
}
.stack-layer-0 {
  transform: translateZ(-56px);
  background: color-mix(in srgb, var(--seed-poster-bg), white 85%);
  color: var(--seed-poster-bg);
}
.stack-layer-1 {
  transform: translateZ(0);
}
.stack-layer-2 {
  transform: translateZ(56px);
  background: var(--seed-highlight-bg);
  color: var(--seed-highlight-text);
  border-color: var(--seed-highlight-bg);
}
.stack-layer-2::after {
  background: color-mix(in srgb, var(--seed-highlight-bg), black 18%);
  border-color: var(--seed-highlight-bg);
}
.stack-layer.is-selected {
  outline: 2px solid var(--seed-poster-text);
  outline-offset: 6px;
}
.stack-layer-label {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.02em;
}
.poster-tabs {
  display: flex;
  gap: 20px;
  margin-block: 0;
}
.poster-tab {
  min-height: 32px;
  padding-block: 0;
  padding-inline: 0;
  color: var(--seed-poster-text);
  opacity: 0.7;
}
.poster-tab.is-selected {
  opacity: 1;
  text-decoration: underline;
  text-underline-offset: 7px;
  text-decoration-color: var(--seed-highlight-bg);
}
.poster-tab:hover {
  color: var(--seed-highlight-bg);
  opacity: 1;
}
.poster-heading {
  font-size: clamp(34px, 3vw, 44px);
  line-height: 1.04;
  letter-spacing: -0.055em;
  font-weight: 500;
}
.poster-arrow {
  color: var(--seed-highlight-bg);
}
.poster-selection {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
  padding-top: 17px;
  border-top: 1px solid rgb(255 255 255 / 0.35);
}
.poster-open {
  color: var(--seed-poster-text);
}
.poster-open:hover {
  color: var(--seed-highlight-bg);
}
.stack-layer:focus-visible {
  outline: 3px solid var(--seed-poster-text);
  outline-offset: 8px;
}
@media (hover: hover) {
  .stack-layer-0:hover {
    transform: translateZ(-44px);
  }
  .stack-layer-1:hover {
    transform: translateZ(12px);
  }
  .stack-layer-2:hover {
    transform: translateZ(68px);
    background: var(--seed-highlight-bg);
  }
}
@media (max-width: 760px) {
  .stack-poster {
    min-height: 600px;
  }
  .stack-stage {
    height: 300px;
  }
}
@media (max-width: 390px) {
  .stack-sculpture {
    top: 66px;
    height: 165px;
  }
  .stack-stage {
    height: 275px;
    margin-block: 18px 0;
  }
  .stack-poster {
    min-height: 560px;
  }
}
</style>
