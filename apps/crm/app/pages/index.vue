<script setup lang="ts">
import { contactInputSchema, type Contact, type ContactInput } from '@seed/shared'
import { authClient } from '~/utils/auth-client'
const hydrated = ref(false)
onMounted(() => {
  hydrated.value = true
})
const config = useRuntimeConfig()
const { data: status } = await useFetch('/api/status')
const demo = computed(() => status.value?.mode !== 'live')
const { data: session } = await useFetch('/api/session')
if (!demo.value && !session.value?.user) await navigateTo('/login')
const { data, refresh, error } = await useFetch(demo.value ? '/api/demo/contacts' : '/api/contacts')
const query = ref('')
const contacts = computed(() =>
  (data.value?.contacts || []).filter((c) =>
    `${c.name} ${c.email} ${c.company}`.toLowerCase().includes(query.value.toLowerCase()),
  ),
)
const open = ref(false)
const editing = ref<string | null>(null)
const saving = ref(false)
const deleting = ref<string | null>(null)
const toast = useToast()
const state = reactive<ContactInput>({ name: '', email: '', company: '', status: 'lead' })
const statuses = [
  { label: 'Lead', value: 'lead' },
  { label: 'Aktywny', value: 'active' },
  { label: 'Archiwum', value: 'archived' },
]
function edit(contact?: Contact) {
  editing.value = contact?.id || null
  Object.assign(
    state,
    contact
      ? {
          name: contact.name,
          email: contact.email,
          company: contact.company,
          status: contact.status,
        }
      : { name: '', email: '', company: '', status: 'lead' },
  )
  open.value = true
}
async function save() {
  saving.value = true
  try {
    if (editing.value)
      await $fetch(`/api/contacts/${editing.value}`, { method: 'PATCH', body: state })
    else await $fetch('/api/contacts', { method: 'POST', body: state })
    open.value = false
    await refresh()
    toast.add({ title: 'Kontakt zapisany', color: 'success' })
  } catch {
    toast.add({
      title: 'Nie udało się zapisać kontaktu',
      description: 'Sprawdź dane i spróbuj ponownie.',
      color: 'error',
    })
  } finally {
    saving.value = false
  }
}
async function remove() {
  if (!deleting.value) return
  saving.value = true
  try {
    await $fetch(`/api/contacts/${deleting.value}`, { method: 'DELETE' })
    deleting.value = null
    await refresh()
  } catch {
    toast.add({ title: 'Nie udało się usunąć kontaktu', color: 'error' })
  } finally {
    saving.value = false
  }
}
async function signOut() {
  await authClient.signOut()
  await navigateTo('/login')
}
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <template #header><span class="font-semibold px-2">seed / CRM</span></template>
      <template #default="{ collapsed }"
        ><UNavigationMenu
          :collapsed="collapsed"
          orientation="vertical"
          :items="[
            { label: 'Kontakty', icon: 'i-lucide-users', to: '/' },
            { label: 'Landing', icon: 'i-lucide-arrow-up-right', to: config.public.landingUrl },
          ]"
      /></template>
      <template #footer
        ><div class="p-2 w-full">
          <p class="text-xs text-muted mb-3">
            {{ demo ? 'Podgląd startera' : session?.user?.email }}
          </p>
          <UButton
            v-if="!demo"
            color="neutral"
            variant="ghost"
            label="Wyloguj"
            icon="i-lucide-log-out"
            @click="signOut"
          /><UColorModeButton /></div
      ></template>
    </UDashboardSidebar>
    <UDashboardPanel>
      <template #header
        ><UDashboardNavbar title="Kontakty"
          ><template #leading><UDashboardSidebarCollapse /></template
          ><template #right
            ><UBadge
              color="neutral"
              variant="subtle"
              :label="demo ? 'Tryb demo' : 'Twoja przestrzeń'" /></template></UDashboardNavbar
      ></template>
      <template #body>
        <UAlert
          v-if="demo"
          color="neutral"
          variant="subtle"
          icon="i-lucide-info"
          title="Przykładowe dane, gotowe do zastąpienia"
          description="To podgląd bez bazy i kont. Uzupełnij zmienne Neon, Better Auth i Resend, następnie ustaw SEED_MODE=live. Instrukcje są w README."
        />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <UCard
            ><p class="text-sm text-muted">Kontakty</p>
            <p class="text-3xl font-semibold mt-2">{{ data?.contacts.length || 0 }}</p></UCard
          >
          <UCard
            ><p class="text-sm text-muted">Aktywne</p>
            <p class="text-3xl font-semibold mt-2">
              {{ data?.contacts.filter((c) => c.status === 'active').length || 0 }}
            </p></UCard
          >
          <UCard
            ><p class="text-sm text-muted">Nowe leady</p>
            <p class="text-3xl font-semibold mt-2">
              {{ data?.contacts.filter((c) => c.status === 'lead').length || 0 }}
            </p></UCard
          >
        </div>
        <div class="flex flex-wrap justify-between gap-4 mb-4">
          <UInput
            v-model="query"
            :disabled="!hydrated"
            placeholder="Szukaj kontaktu..."
            aria-label="Szukaj kontaktu"
            icon="i-lucide-search"
            class="w-full sm:w-80"
          /><UButton
            color="neutral"
            icon="i-lucide-plus"
            label="Dodaj kontakt"
            :disabled="demo"
            @click="edit()"
          />
        </div>
        <UAlert v-if="error" color="error" title="Nie udało się pobrać kontaktów" class="mb-4"
          ><template #actions
            ><UButton
              color="neutral"
              variant="outline"
              label="Spróbuj ponownie"
              @click="refresh()" /></template
        ></UAlert>
        <div class="overflow-x-auto rounded-lg border border-default">
          <table class="w-full text-sm text-left">
            <caption class="sr-only">
              Lista kontaktów
            </caption>
            <thead class="bg-elevated text-muted">
              <tr>
                <th scope="col" class="p-4 font-medium">Imię i nazwisko</th>
                <th scope="col" class="p-4 font-medium">Firma</th>
                <th scope="col" class="p-4 font-medium">Status</th>
                <th scope="col" class="p-4 font-medium"><span class="sr-only">Akcje</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contact in contacts" :key="contact.id" class="border-t border-default">
                <td class="p-4">
                  <p class="font-medium">{{ contact.name }}</p>
                  <p class="text-muted mt-1">{{ contact.email }}</p>
                </td>
                <td class="p-4 text-muted">{{ contact.company || 'Brak firmy' }}</td>
                <td class="p-4">
                  <UBadge
                    color="neutral"
                    variant="subtle"
                    :label="statuses.find((s) => s.value === contact.status)?.label"
                  />
                </td>
                <td class="p-4">
                  <div class="flex justify-end gap-1">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-pencil"
                      :aria-label="`Edytuj ${contact.name}`"
                      :disabled="demo"
                      @click="edit(contact)"
                    /><UButton
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-trash-2"
                      :aria-label="`Usuń ${contact.name}`"
                      :disabled="demo"
                      @click="deleting = contact.id"
                    />
                  </div>
                </td>
              </tr>
              <tr v-if="!contacts.length">
                <td colspan="4" class="p-12 text-center text-muted">
                  Brak kontaktów. Dodaj pierwszy kontakt lub zmień wyszukiwanie.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-muted mt-4">
          {{
            demo
              ? 'W podglądzie edycja jest wyłączona.'
              : 'Każde konto widzi wyłącznie własne kontakty.'
          }}
        </p>
      </template>
    </UDashboardPanel>
    <UModal
      v-model:open="open"
      :title="editing ? 'Edytuj kontakt' : 'Dodaj kontakt'"
      description="Podstawowe dane kontaktu."
    >
      <template #body
        ><UForm
          id="contact-form"
          :schema="contactInputSchema"
          :state="state"
          class="space-y-4"
          @submit="save"
          ><UFormField label="Imię i nazwisko" name="name" required
            ><UInput v-model="state.name" class="w-full" /></UFormField
          ><UFormField label="E-mail" name="email" required
            ><UInput v-model="state.email" type="email" class="w-full" /></UFormField
          ><UFormField label="Firma" name="company"
            ><UInput v-model="state.company" class="w-full" /></UFormField
          ><UFormField label="Status" name="status"
            ><USelect v-model="state.status" :items="statuses" class="w-full" /></UFormField></UForm
      ></template>
      <template #footer
        ><UButton color="neutral" variant="outline" label="Anuluj" @click="open = false" /><UButton
          type="submit"
          form="contact-form"
          color="neutral"
          label="Zapisz"
          :loading="saving"
      /></template>
    </UModal>
    <UModal
      :open="Boolean(deleting)"
      title="Usunąć kontakt?"
      description="Ta operacja trwale usuwa kontakt."
      @update:open="
        (value) => {
          if (!value) deleting = null
        }
      "
      ><template #footer
        ><UButton
          color="neutral"
          variant="outline"
          label="Anuluj"
          @click="deleting = null" /><UButton
          color="error"
          label="Usuń kontakt"
          :loading="saving"
          @click="remove" /></template
    ></UModal>
  </UDashboardGroup>
</template>
