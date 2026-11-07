<script setup lang="ts">
import { z } from 'zod'
import { authClient } from '~/utils/auth-client'
const route = useRoute()
const schema = z.object({ password: z.string().min(12, 'Minimum 12 znaków') })
const state = reactive({ password: '' })
const busy = ref(false)
const message = ref('')
const failure = ref('')
async function submit() {
  busy.value = true
  try {
    const token = typeof route.query.token === 'string' ? route.query.token : ''
    const result = await authClient.resetPassword({ newPassword: state.password, token })
    if (result.error) throw new Error(result.error.message)
    message.value = 'Hasło zostało zmienione. Możesz się zalogować.'
  } catch (error) {
    failure.value = error instanceof Error ? error.message : 'Nie udało się zmienić hasła.'
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <UContainer class="max-w-md py-20"
    ><UCard
      ><h1 class="text-xl font-semibold mb-6">Nowe hasło</h1>
      <UAlert v-if="message" color="success" :title="message" class="mb-4" /><UAlert
        v-if="failure || route.query.error"
        color="error"
        :title="failure || 'Link jest nieważny. Poproś o nowy.'"
        class="mb-4" /><UForm :schema="schema" :state="state" @submit="submit"
        ><UFormField name="password" label="Hasło" required
          ><UInput
            v-model="state.password"
            type="password"
            autocomplete="new-password"
            class="w-full" /></UFormField
        ><UButton
          class="mt-4"
          color="neutral"
          type="submit"
          label="Zmień hasło"
          :loading="busy"
          :disabled="!route.query.token || Boolean(message)" /></UForm
      ><UButton
        class="mt-4"
        to="/login"
        color="neutral"
        variant="link"
        label="Przejdź do logowania" /></UCard
  ></UContainer>
</template>
