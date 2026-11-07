import { useRef, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Button, Column, Host, TextInput, type TextInputRef } from '@expo/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { contactInputSchema, type Contact } from '@seed/shared'
import { Notice, Page } from '@/components/page'
import { authClient } from '@/lib/auth-client'
import { api } from '@/lib/api'
import { backendConfigured } from '@/lib/config'

const previewContacts: Contact[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Alex Example',
    email: 'alex@example.com',
    company: 'Example Studio',
    status: 'lead',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Sam Example',
    email: 'sam@example.com',
    company: 'Sample Company',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
]

export default function ContactsScreen() {
  const status = useQuery({
    queryKey: ['status'],
    queryFn: ({ signal }) => api.status(signal),
    enabled: backendConfigured,
  })
  if (!backendConfigured)
    return (
      <ContactList
        contacts={previewContacts}
        header={
          <Notice>
            Standalone preview. These are read-only example contacts. Connect your CRM to use your
            own contacts.
          </Notice>
        }
      />
    )
  if (status.data?.mode === 'demo') return <DemoContacts />
  if (!status.data) {
    return (
      <Page title="Contacts">
        {status.isLoading ? (
          <ActivityIndicator />
        ) : (
          <Notice error>{status.error?.message || 'Waiting for a connection.'}</Notice>
        )}
        <Host matchContents>
          <Button label="Retry" onPress={() => void status.refetch()} />
        </Host>
      </Page>
    )
  }
  return <LiveContacts />
}

function DemoContacts() {
  const query = useQuery({
    queryKey: ['demo-contacts'],
    queryFn: ({ signal }) => api.demoContacts(signal),
  })
  return (
    <ContactList
      contacts={query.data?.contacts ?? []}
      loading={query.isLoading}
      error={query.error?.message}
      refresh={() => void query.refetch()}
      header={
        <Notice>Demo mode. These read-only examples are separate from real account data.</Notice>
      }
    />
  )
}

function LiveContacts() {
  const session = authClient.useSession()
  if (session.isPending)
    return (
      <Page title="Contacts">
        <ActivityIndicator accessibilityLabel="Loading session" />
      </Page>
    )
  if (!session.data) {
    return (
      <Page title="Your contacts">
        <Notice>Sign in to see and save your contacts.</Notice>
        {session.error ? <Notice error>Could not load your session.</Notice> : null}
        <Host matchContents>
          <Button label="Sign in" onPress={() => router.push('/sign-in')} />
        </Host>
      </Page>
    )
  }
  return <AccountContacts userId={session.data.user.id} />
}

function AccountContacts({ userId }: { userId: string }) {
  const client = useQueryClient()
  const query = useQuery({
    queryKey: ['contacts', userId],
    queryFn: ({ signal }) => api.contacts(signal),
  })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [validation, setValidation] = useState('')
  const nameRef = useRef<TextInputRef>(null)
  const emailRef = useRef<TextInputRef>(null)
  const companyRef = useRef<TextInputRef>(null)
  const mutation = useMutation({
    mutationFn: api.createContact,
    onSuccess: async () => {
      setName('')
      setEmail('')
      setCompany('')
      nameRef.current?.clear()
      emailRef.current?.clear()
      companyRef.current?.clear()
      await client.invalidateQueries({ queryKey: ['contacts', userId] })
    },
  })

  function save() {
    if (mutation.isPending) return
    setValidation('')
    const parsed = contactInputSchema.safeParse({ name, email, company, status: 'lead' })
    if (!parsed.success) {
      setValidation(parsed.error.issues[0]?.message || 'Check the contact details.')
      return
    }
    mutation.mutate(parsed.data)
  }

  return (
    <ContactList
      contacts={query.data?.contacts ?? []}
      loading={query.isLoading}
      refreshing={query.isRefetching}
      error={query.error?.message}
      refresh={() => void query.refetch()}
      header={
        <View style={{ gap: 16 }}>
          <Notice>Add a contact. Changes are saved in your account and shared with the CRM.</Notice>
          <Host matchContents>
            <Column spacing={12}>
              <TextInput
                ref={nameRef}
                accessibilityLabel="Contact name"
                placeholder="Name"
                onChangeText={setName}
                editable={!mutation.isPending}
                style={inputStyle}
              />
              <TextInput
                ref={emailRef}
                accessibilityLabel="Contact email"
                placeholder="Email"
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!mutation.isPending}
                style={inputStyle}
              />
              <TextInput
                ref={companyRef}
                accessibilityLabel="Company"
                placeholder="Company (optional)"
                onChangeText={setCompany}
                editable={!mutation.isPending}
                style={inputStyle}
              />
              <Button
                label={mutation.isPending ? 'Saving…' : 'Add contact'}
                disabled={mutation.isPending}
                onPress={save}
              />
            </Column>
          </Host>
          {validation || mutation.error ? (
            <Notice error>{validation || mutation.error?.message}</Notice>
          ) : null}
          {mutation.isSuccess ? <Notice>Contact saved.</Notice> : null}
        </View>
      }
    />
  )
}

const inputStyle = {
  width: '100%' as const,
  padding: 12,
  borderWidth: 1,
  borderColor: '#888888',
  borderRadius: 8,
}

function ContactList({
  contacts,
  header,
  loading,
  refreshing,
  error,
  refresh,
}: {
  contacts: Contact[]
  header: React.ReactNode
  loading?: boolean
  refreshing?: boolean
  error?: string
  refresh?: () => void
}) {
  const dark = useColorScheme() === 'dark'
  const color = dark ? '#fafafa' : '#111111'
  return (
    <FlatList
      data={contacts}
      keyExtractor={(contact) => contact.id}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: dark ? '#111111' : '#fafafa' }}
      contentContainerStyle={styles.list}
      refreshing={refreshing ?? false}
      onRefresh={refresh}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text accessibilityRole="header" style={[styles.title, { color }]}>
            Contacts
          </Text>
          {header}
          {error ? <Notice error>{error}</Notice> : null}
          {refresh ? (
            <Host matchContents>
              <Button label="Refresh" variant="text" disabled={loading} onPress={refresh} />
            </Host>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator accessibilityLabel="Loading contacts" />
        ) : !error ? (
          <Notice>No contacts yet. Add your first contact above.</Notice>
        ) : undefined
      }
      renderItem={({ item }) => (
        <View style={[styles.contact, { borderColor: dark ? '#444444' : '#dddddd' }]}>
          <Text style={[styles.name, { color }]}>{item.name}</Text>
          <Text selectable style={{ color }}>
            {item.email}
          </Text>
          {item.company ? <Text style={{ color }}>{item.company}</Text> : null}
          <Text style={{ color }}>{item.status}</Text>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 24,
    paddingBottom: 48,
    gap: 16,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  header: { gap: 20, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '600' },
  contact: { padding: 20, borderWidth: 1, borderRadius: 12, gap: 8 },
  name: { fontSize: 18, fontWeight: '600' },
})
