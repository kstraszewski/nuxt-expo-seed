import { Button, Column, Host } from '@expo/ui'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ActivityIndicator } from 'react-native'
import { Notice, Page } from '@/components/page'
import { api } from '@/lib/api'
import { backendConfigured } from '@/lib/config'

export default function HomeScreen() {
  const status = useQuery({
    queryKey: ['status'],
    queryFn: ({ signal }) => api.status(signal),
    enabled: backendConfigured,
  })
  return (
    <Page
      title="A place to start."
      subtitle="A small Expo app connected to the same account and contacts as the Nuxt CRM."
    >
      {!backendConfigured ? (
        <Notice>Standalone preview. Connect your CRM to enable accounts and saved contacts.</Notice>
      ) : null}
      {status.isLoading ? <ActivityIndicator accessibilityLabel="Checking connection" /> : null}
      {status.error ? <Notice error>Could not reach the CRM. {status.error.message}</Notice> : null}
      {status.data ? (
        <Notice>
          {status.data.mode === 'live'
            ? 'CRM connected. Your account can save contacts.'
            : 'CRM is in demo mode. Contacts are read-only examples.'}
        </Notice>
      ) : null}
      <Host matchContents>
        <Column spacing={12}>
          <Button label="Open contacts" onPress={() => router.push('/contacts')} />
          <Button label="Account" variant="outlined" onPress={() => router.push('/sign-in')} />
          {backendConfigured ? (
            <Button label="Check connection" variant="text" onPress={() => void status.refetch()} />
          ) : null}
        </Column>
      </Host>
      <Notice>
        Expo Router navigation, native controls and secure sessions. The visual style is
        intentionally neutral so each project can make it its own.
      </Notice>
    </Page>
  )
}
