import { createAuthClient } from 'better-auth/react'
import { expoClient } from '@better-auth/expo/client'
import * as SecureStore from 'expo-secure-store'
import { apiURL } from '@/lib/config'

export const authClient = createAuthClient({
  baseURL: apiURL || 'http://localhost:3001',
  plugins: [
    expoClient({
      scheme: 'nuxt-expo-seed',
      storagePrefix: 'nuxt-expo-seed',
      storage: SecureStore,
    }),
  ],
})

export async function sessionRequestOptions(): Promise<RequestInit> {
  const cookie = await authClient.getCookie()
  return {
    credentials: 'omit',
    headers: cookie ? { Cookie: cookie } : {},
  }
}
