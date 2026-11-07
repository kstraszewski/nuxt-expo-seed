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
  <UContainer class="min-h-screen flex flex-col items-center justify-center py-12 gap-6">
    <NuxtLink to="/" class="text-muted text-sm">seed / CRM</NuxtLink>
    <UCard class="w-full max-w-md"
      ><template #header
        ><h1 class="text-xl font-semibold">
          {{
            mode === 'signup'
              ? 'Utwórz konto'
              : mode === 'forgot'
                ? 'Zresetuj hasło'
                : 'Zaloguj się'
          }}
        </h1></template
      >
      <UAlert
        v-if="status?.mode !== 'live'"
        color="neutral"
        title="Logowanie wymaga konfiguracji"
        description="Publiczny podgląd działa w trybie demo. Podłącz własne usługi według README."
        class="mb-6"
      />
      <UAlert v-if="message" color="success" :title="message" class="mb-6" />
      <UAlert v-if="failure" color="error" :title="failure" class="mb-6" />
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="submit">
        <UFormField v-if="mode === 'signup'" label="Imię" name="name" required
          ><UInput v-model="state.name" autocomplete="name" class="w-full"
        /></UFormField>
        <UFormField label="E-mail" name="email" required
          ><UInput v-model="state.email" type="email" autocomplete="email" class="w-full"
        /></UFormField>
        <UFormField
          v-if="mode !== 'forgot'"
          label="Hasło"
          name="password"
          description="Minimum 12 znaków"
          required
          ><UInput
            v-model="state.password"
            type="password"
            :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'"
            class="w-full"
        /></UFormField>
        <UButton
          type="submit"
          color="neutral"
          block
          :loading="busy"
          :disabled="status?.mode !== 'live'"
          :label="
            mode === 'signup' ? 'Utwórz konto' : mode === 'forgot' ? 'Wyślij link' : 'Zaloguj się'
          "
        />
      </UForm>
      <div class="mt-5 flex flex-wrap justify-between gap-2">
        <UButton
          color="neutral"
          variant="link"
          :label="mode === 'login' ? 'Utwórz konto' : 'Wróć do logowania'"
          :disabled="!hydrated"
          @click="toggleMode"
        /><UButton
          v-if="mode === 'login'"
          color="neutral"
          variant="link"
          label="Nie pamiętam hasła"
          :disabled="!hydrated"
          @click="mode = 'forgot'"
        />
      </div> </UCard
    ><UButton to="/" color="neutral" variant="link" label="Wróć do CRM" />
  </UContainer>
</template>
