<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
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
const {
  data,
  refresh,
  error,
  status: contactsStatus,
} = await useFetch(demo.value ? '/api/demo/contacts' : '/api/contacts')
const query = ref('')
const contacts = computed(() =>
  (data.value?.contacts || []).filter((c) =>
    `${c.name} ${c.email} ${c.company}`.toLowerCase().includes(query.value.toLowerCase()),
  ),
)
const columns: TableColumn<Contact>[] = [
  { accessorKey: 'name', header: 'Imię i nazwisko' },
  { accessorKey: 'company', header: 'Firma' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: 'Akcje' },
]
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
    <UDashboardSidebar
      collapsible
      :ui="{
        header: 'h-24 px-6 border-b border-default',
        body: 'px-5 py-8 gap-8',
        footer: 'p-5 border-t border-default',
      }"
    >
      <template #header="{ collapsed }">
        <NuxtLink to="/" aria-label="Seed CRM, strona główna" class="flex items-baseline gap-2.5">
          <span class="text-primary text-4xl leading-none font-bold tracking-[-0.08em]">s.</span>
          <span v-if="!collapsed" class="text-xl font-semibold tracking-tight"
            >seed<span class="text-muted font-normal"> / crm</span></span
          >
        </NuxtLink>
      </template>
      <template #default="{ collapsed }">
        <div>
          <p v-if="!collapsed" class="seed-kicker px-3 mb-4 text-muted">Przestrzeń robocza</p>
          <UNavigationMenu
            :collapsed="collapsed"
            orientation="vertical"
            :items="[
              { label: 'Kontakty', icon: 'i-lucide-users', to: '/' },
              { label: 'Landing', icon: 'i-lucide-arrow-up-right', to: config.public.landingUrl },
            ]"
            :ui="{ link: 'py-3', linkLabel: 'text-sm', linkLeadingIcon: 'size-4' }"
          />
        </div>
        <div v-if="!collapsed" class="mt-auto border-t border-default pt-6 px-3">
          <p class="seed-kicker text-muted mb-3">01 / Twoja baza</p>
          <p class="text-sm text-muted leading-relaxed">
            Jedna lista. Miejsce na kontakty i kolejne rozmowy.
          </p>
        </div>
      </template>
      <template #footer="{ collapsed }">
        <div class="w-full min-w-0">
          <p v-if="!collapsed" class="seed-kicker text-muted mb-3">
            {{ demo ? 'Tryb podglądu' : 'Twoje konto' }}
          </p>
          <p v-if="!collapsed" class="text-sm truncate mb-4">
            {{ demo ? 'Dane przykładowe' : session?.user?.email }}
          </p>
          <UButton
            v-if="!demo"
            color="neutral"
            variant="ghost"
            :label="collapsed ? undefined : 'Wyloguj się'"
            aria-label="Wyloguj się"
            icon="i-lucide-log-out"
            :block="!collapsed"
            class="justify-start"
            @click="signOut"
          />
          <span v-else-if="!collapsed" class="seed-highlight seed-kicker inline-block px-2 py-1"
            >Gotowe do rozbudowy</span
          >
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel :ui="{ body: 'p-5 sm:p-8 lg:p-10 xl:p-12 gap-8 lg:gap-10' }">
      <template #header>
        <UDashboardNavbar :ui="{ root: 'h-24 px-5 sm:px-8 lg:px-10 xl:px-12', right: 'gap-3' }">
          <template #left>
            <UDashboardSidebarCollapse />
            <span class="seed-kicker text-muted">Przestrzeń robocza / CRM</span>
          </template>
          <template #right>
            <UBadge
              color="neutral"
              variant="outline"
              :label="demo ? 'Tryb demo' : 'Twoja przestrzeń'"
              class="seed-kicker px-2.5 py-1.5"
            />
            <UColorModeButton />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <div class="max-w-7xl w-full mx-auto space-y-8 lg:space-y-10">
          <header class="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            <div>
              <p class="seed-kicker text-muted mb-5">01 / Kontakty</p>
              <h1
                class="seed-title text-[clamp(2.75rem,5vw,4.75rem)] leading-[0.98] tracking-[-0.065em] font-semibold"
              >
                Wszystkie kontakty.<span class="block text-primary">W jednym miejscu.</span>
              </h1>
            </div>
            <p class="text-muted text-base leading-relaxed max-w-xs xl:pb-1">
              Porządkuj relacje, aktualizuj dane i wracaj do ważnych rozmów.
            </p>
          </header>

          <div class="grid grid-cols-3 border-y border-default divide-x divide-default">
            <UCard
              variant="soft"
              class="bg-transparent ring-0"
              :ui="{ body: 'py-5 px-0 sm:py-6 sm:px-5' }"
            >
              <p
                class="seed-stat text-primary text-4xl sm:text-5xl font-semibold tracking-[-0.06em]"
              >
                {{ String(data?.contacts.length || 0).padStart(2, '0') }}
              </p>
              <p class="text-xs sm:text-sm text-muted mt-2">Wszystkie kontakty</p>
            </UCard>
            <UCard
              variant="soft"
              class="bg-transparent ring-0"
              :ui="{ body: 'py-5 px-3 sm:py-6 sm:px-6' }"
            >
              <p
                class="seed-stat text-primary text-4xl sm:text-5xl font-semibold tracking-[-0.06em]"
              >
                {{
                  String(data?.contacts.filter((c) => c.status === 'active').length || 0).padStart(
                    2,
                    '0',
                  )
                }}
              </p>
              <p class="text-xs sm:text-sm text-muted mt-2">Aktywne relacje</p>
            </UCard>
            <UCard
              variant="soft"
              class="bg-transparent ring-0"
              :ui="{ body: 'py-5 px-3 sm:py-6 sm:px-6' }"
            >
              <p
                class="seed-stat text-primary text-4xl sm:text-5xl font-semibold tracking-[-0.06em]"
              >
                {{
                  String(data?.contacts.filter((c) => c.status === 'lead').length || 0).padStart(
                    2,
                    '0',
                  )
                }}
              </p>
              <p class="text-xs sm:text-sm text-muted mt-2">Nowe leady</p>
            </UCard>
          </div>

          <UAlert
            v-if="demo"
            color="neutral"
            variant="outline"
            icon="i-lucide-scan-eye"
            title="Rozejrzyj się. To Twój punkt wyjścia."
            description="Podgląd korzysta z przykładowych kontaktów. Po podłączeniu własnych usług możesz zapisywać i edytować swoje dane."
            :ui="{
              root: 'p-5 sm:p-6 bg-transparent',
              title: 'text-sm font-semibold',
              description: 'text-sm text-muted leading-relaxed mt-1',
              icon: 'text-primary size-5',
            }"
          />

          <section aria-labelledby="contacts-list-title">
            <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <p class="seed-kicker text-muted mb-2">Książka kontaktów</p>
                <h2 id="contacts-list-title" class="text-2xl font-semibold tracking-tight">
                  Twoja lista<span class="text-primary">.</span>
                </h2>
              </div>
              <div class="flex flex-col sm:flex-row gap-3">
                <UInput
                  v-model="query"
                  :disabled="!hydrated"
                  placeholder="Szukaj kontaktu..."
                  aria-label="Szukaj kontaktu"
                  icon="i-lucide-search"
                  size="lg"
                  class="w-full sm:w-60"
                />
                <UButton
                  icon="i-lucide-plus"
                  label="Dodaj kontakt"
                  size="lg"
                  :disabled="demo"
                  class="justify-center"
                  @click="edit()"
                />
              </div>
            </div>

            <UAlert v-if="error" color="error" title="Nie udało się pobrać kontaktów" class="mb-4">
              <template #actions
                ><UButton
                  color="neutral"
                  variant="outline"
                  label="Spróbuj ponownie"
                  @click="refresh()"
              /></template>
            </UAlert>

            <UTable
              :data="contacts"
              :columns="columns"
              :loading="contactsStatus === 'pending'"
              caption="Lista kontaktów"
              class="border-y border-default"
              :ui="{
                th: 'py-4 text-[10px] uppercase tracking-[0.12em] font-medium text-muted bg-transparent',
                td: 'py-6',
                tbody: 'divide-y divide-default',
                empty: 'py-14',
              }"
            >
              <template #name-cell="{ row }">
                <div class="flex items-center gap-3.5">
                  <span
                    class="hidden sm:grid place-items-center shrink-0 size-10 border border-default text-primary text-sm font-medium"
                    aria-hidden="true"
                    >{{
                      row.original.name
                        .split(' ')
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join('')
                    }}</span
                  >
                  <div>
                    <p class="font-medium text-default">{{ row.original.name }}</p>
                    <p class="text-muted text-xs mt-1">{{ row.original.email }}</p>
                  </div>
                </div>
              </template>
              <template #company-cell="{ row }"
                ><span class="text-muted">{{
                  row.original.company || 'Brak firmy'
                }}</span></template
              >
              <template #status-cell="{ row }">
                <UBadge
                  color="neutral"
                  variant="outline"
                  :label="statuses.find((s) => s.value === row.original.status)?.label"
                  :class="[
                    'text-[10px] uppercase tracking-[0.08em] px-2 py-1',
                    row.original.status === 'active' ? 'seed-highlight ring-transparent' : '',
                  ]"
                />
              </template>
              <template #actions-header><span class="sr-only">Akcje</span></template>
              <template #actions-cell="{ row }">
                <div class="flex justify-end gap-1">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-pencil"
                    :aria-label="`Edytuj ${row.original.name}`"
                    :disabled="demo"
                    @click="edit(row.original)"
                  />
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-trash-2"
                    :aria-label="`Usuń ${row.original.name}`"
                    :disabled="demo"
                    @click="deleting = row.original.id"
                  />
                </div>
              </template>
              <template #empty
                ><p class="text-muted">
                  Brak kontaktów. Dodaj pierwszy kontakt lub zmień wyszukiwanie.
                </p></template
              >
            </UTable>
            <div class="flex flex-wrap justify-between gap-3 mt-4 text-xs text-muted">
              <p>
                {{
                  demo
                    ? 'Przykładowe dane. Edycja jest wyłączona.'
                    : 'Każde konto widzi wyłącznie własne kontakty.'
                }}
              </p>
              <p>{{ contacts.length }} z {{ data?.contacts.length || 0 }} kontaktów</p>
            </div>
          </section>
        </div>
      </template>
    </UDashboardPanel>

    <UModal
      v-model:open="open"
      :title="editing ? 'Edytuj kontakt' : 'Dodaj kontakt'"
      description="Podstawowe dane do Twojej książki kontaktów."
      :ui="{ header: 'p-6', body: 'p-6', footer: 'p-6 justify-end' }"
    >
      <template #body>
        <UForm
          id="contact-form"
          :schema="contactInputSchema"
          :state="state"
          class="space-y-5"
          @submit="save"
        >
          <UFormField label="Imię i nazwisko" name="name" required
            ><UInput v-model="state.name" class="w-full" size="lg"
          /></UFormField>
          <UFormField label="E-mail" name="email" required
            ><UInput v-model="state.email" type="email" class="w-full" size="lg"
          /></UFormField>
          <UFormField label="Firma" name="company"
            ><UInput v-model="state.company" class="w-full" size="lg"
          /></UFormField>
          <UFormField label="Status" name="status"
            ><USelect v-model="state.status" :items="statuses" class="w-full" size="lg"
          /></UFormField>
        </UForm>
      </template>
      <template #footer>
        <UButton
          color="neutral"
          variant="outline"
          label="Anuluj"
          :disabled="saving"
          @click="open = false"
        />
        <UButton type="submit" form="contact-form" label="Zapisz kontakt" :loading="saving" />
      </template>
    </UModal>
    <UModal
      :open="Boolean(deleting)"
      title="Usunąć kontakt?"
      description="Ta operacja trwale usuwa kontakt."
      :ui="{ footer: 'justify-end' }"
      @update:open="
        (value) => {
          if (!value) deleting = null
        }
      "
    >
      <template #footer>
        <UButton
          color="neutral"
          variant="outline"
          label="Anuluj"
          :disabled="saving"
          @click="deleting = null"
        />
        <UButton color="error" label="Usuń kontakt" :loading="saving" @click="remove" />
      </template>
    </UModal>
  </UDashboardGroup>
</template>
