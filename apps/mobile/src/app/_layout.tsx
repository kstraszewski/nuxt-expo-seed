import { useState } from 'react'
import { Stack } from 'expo-router/stack'
import { ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function RootLayout() {
  const dark = useColorScheme() === 'dark'
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
      }),
  )
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider value={dark ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Seed' }} />
          <Stack.Screen name="contacts" options={{ title: 'Contacts' }} />
          <Stack.Screen name="sign-in" options={{ title: 'Account' }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
