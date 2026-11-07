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
  <SeedAuthFrame
    eyebrow="03 / Odzyskaj dostęp"
    title="Nowe hasło."
    accent="Ten sam porządek."
    description="Ustaw nowe hasło i wróć do swojej przestrzeni. Twoje kontakty pozostają na swoim miejscu."
  >
    <div class="mb-8 sm:mb-10">
      <p class="seed-kicker text-muted mb-4">Bezpieczeństwo konta</p>
      <h2 class="text-3xl sm:text-4xl font-semibold tracking-[-0.045em]">
        Ustaw nowe hasło<span class="text-primary">.</span>
      </h2>
      <p class="text-muted text-sm leading-relaxed mt-3">
        Wybierz hasło, którego nie używasz w innych miejscach.
      </p>
    </div>

    <UAlert v-if="message" color="success" variant="outline" :title="message" class="mb-6" />
    <UAlert
      v-if="failure || route.query.error || !route.query.token"
      color="error"
      variant="outline"
      icon="i-lucide-link-2-off"
      :title="failure || 'Link jest nieważny. Poproś o nowy.'"
      class="mb-6"
    />
    <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
      <UFormField name="password" label="Nowe hasło" description="Minimum 12 znaków" required>
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="new-password"
          placeholder="Nowe, bezpieczne hasło"
          size="xl"
          class="w-full"
        />
      </UFormField>
      <UButton
        color="primary"
        type="submit"
        label="Zmień hasło"
        trailing-icon="i-lucide-arrow-up-right"
        size="xl"
        block
        class="justify-between"
        :loading="busy"
        :disabled="!route.query.token || Boolean(message)"
      />
    </UForm>
    <div class="mt-7 pt-6 border-t border-default">
      <UButton
        to="/login"
        color="neutral"
        variant="link"
        icon="i-lucide-arrow-left"
        label="Przejdź do logowania"
        class="p-0 text-sm"
      />
    </div>
  </SeedAuthFrame>
</template>
