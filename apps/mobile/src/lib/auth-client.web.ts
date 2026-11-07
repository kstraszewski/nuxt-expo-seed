import { createAuthClient } from 'better-auth/react'
import { apiURL } from '@/lib/config'

// Browsers store HttpOnly session cookies. Native uses the SecureStore plugin.
export const authClient = createAuthClient({
  baseURL: apiURL || 'http://localhost:3001',
  fetchOptions: { credentials: 'include' },
})

export async function sessionRequestOptions(): Promise<RequestInit> {
  return { credentials: 'include' }
}
