<script setup lang="ts">
import { z } from 'zod'
import { authClient } from '~/utils/auth-client'
const hydrated = ref(false)
onMounted(() => {
  hydrated.value = true
})
const { data: status } = await useFetch('/api/status')
const mode = ref<'login' | 'signup' | 'forgot'>('login')
const state = reactive({ name: '', email: '', password: '' })
const schema = computed(() =>
  z.object({
    email: z.email('Podaj poprawny e-mail'),
    ...(mode.value === 'signup' ? { name: z.string().min(2, 'Podaj imię') } : {}),
    ...(mode.value !== 'forgot' ? { password: z.string().min(12, 'Minimum 12 znaków') } : {}),
  }),
)
const title = computed(() =>
  mode.value === 'signup'
    ? 'Utwórz konto'
    : mode.value === 'forgot'
      ? 'Zresetuj hasło'
      : 'Zaloguj się',
)
const busy = ref(false)
const message = ref('')
const failure = ref('')
function toggleMode() {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  message.value = ''
  failure.value = ''
}
async function submit() {
  busy.value = true
  message.value = ''
  failure.value = ''
  try {
    if (mode.value === 'forgot') {
      const result = await authClient.requestPasswordReset({
        email: state.email,
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (result.error) throw new Error(result.error.message)
      message.value = 'Jeśli konto istnieje, otrzymasz wiadomość z instrukcją resetowania hasła.'
    } else if (mode.value === 'signup') {
      const result = await authClient.signUp.email({
        ...state,
        callbackURL: window.location.origin,
      })
      if (result.error) throw new Error(result.error.message)
      message.value = status.value?.emailConfigured
        ? 'Sprawdź skrzynkę i potwierdź adres e-mail.'
        : 'Konto utworzone. Możesz się zalogować.'
    } else {
      const result = await authClient.signIn.email({ email: state.email, password: state.password })
      if (result.error) throw new Error(result.error.message)
      await navigateTo('/')
    }
  } catch (error) {
    failure.value = error instanceof Error ? error.message : 'Spróbuj ponownie.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <SeedAuthFrame
    title="Jedno konto."
    accent="Wspólny dostęp."
    description="Zaloguj się i wróć do swoich kontaktów. Ta sama przestrzeń czeka na Ciebie w CRM i aplikacji mobilnej."
  >
    <div class="mb-8 sm:mb-10">
      <p class="seed-kicker text-muted mb-4">
        {{
          mode === 'signup'
            ? '01 / Nowy początek'
            : mode === 'forgot'
              ? '03 / Odzyskaj dostęp'
              : '01 / Witaj ponownie'
        }}
      </p>
      <h2 class="text-3xl sm:text-4xl font-semibold tracking-[-0.045em]">
        {{ title }}<span class="text-primary">.</span>
      </h2>
      <p class="text-muted text-sm leading-relaxed mt-3">
        {{
          mode === 'signup'
            ? 'Podaj swoje dane, żeby utworzyć własną przestrzeń.'
            : mode === 'forgot'
              ? 'Wyślemy Ci link do ustawienia nowego hasła.'
              : 'Podaj adres e-mail i hasło do swojego konta.'
        }}
      </p>
    </div>

    <UAlert
      v-if="status?.mode !== 'live'"
      color="neutral"
      variant="outline"
      icon="i-lucide-info"
      title="Oglądasz podgląd startera"
      description="Logowanie będzie dostępne po podłączeniu własnych usług. Teraz możesz obejrzeć CRM z przykładowymi danymi."
      class="mb-7"
      :ui="{
        root: 'bg-transparent p-5',
        icon: 'text-primary',
        title: 'font-semibold',
        description: 'text-muted leading-relaxed',
      }"
    />
    <UAlert v-if="message" color="success" variant="outline" :title="message" class="mb-6" />
    <UAlert v-if="failure" color="error" variant="outline" :title="failure" class="mb-6" />

    <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
      <UFormField v-if="mode === 'signup'" label="Imię" name="name" required>
        <UInput
          v-model="state.name"
          autocomplete="name"
          placeholder="Twoje imię"
          size="xl"
          class="w-full"
        />
      </UFormField>
      <UFormField label="E-mail" name="email" required>
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="ty@example.com"
          size="xl"
          class="w-full"
        />
      </UFormField>
      <UFormField
        v-if="mode !== 'forgot'"
        label="Hasło"
        name="password"
        description="Minimum 12 znaków"
        required
      >
        <UInput
          v-model="state.password"
          type="password"
          :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'"
          placeholder="Twoje hasło"
          size="xl"
          class="w-full"
        />
      </UFormField>
      <UButton
        type="submit"
        color="primary"
        block
        size="xl"
        class="justify-between"
        trailing-icon="i-lucide-arrow-up-right"
        :loading="busy"
        :disabled="status?.mode !== 'live'"
        :label="
          mode === 'signup' ? 'Utwórz konto' : mode === 'forgot' ? 'Wyślij link' : 'Zaloguj się'
        "
      />
    </UForm>

    <div class="mt-7 pt-6 border-t border-default flex flex-wrap justify-between gap-x-4 gap-y-3">
      <UButton
        color="neutral"
        variant="link"
        :label="mode === 'login' ? 'Utwórz konto' : 'Wróć do logowania'"
        :disabled="!hydrated"
        class="p-0 text-sm"
        @click="toggleMode"
      />
      <UButton
        v-if="mode === 'login'"
        color="neutral"
        variant="link"
        label="Nie pamiętam hasła"
        :disabled="!hydrated"
        class="p-0 text-sm"
        @click="mode = 'forgot'"
      />
    </div>
  </SeedAuthFrame>
</template>
