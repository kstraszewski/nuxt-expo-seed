import { fetch } from 'expo/fetch'
import type { Contact, ContactInput } from '@seed/shared'
import { apiURL, backendConfigured } from '@/lib/config'
import { sessionRequestOptions } from '@/lib/auth-client'

export type BackendStatus = {
  mode: 'demo' | 'live'
  authConfigured: boolean
  emailConfigured: boolean
  databaseConfigured: boolean
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!backendConfigured)
    throw new Error('Configure EXPO_PUBLIC_API_URL to connect your CRM backend.')
  const session = await sessionRequestOptions()
  const response = await fetch(`${apiURL}${path}`, {
    ...session,
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...session.headers,
      ...options.headers,
    },
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      statusMessage?: string
      message?: string
    } | null
    throw new Error(body?.statusMessage || body?.message || `Request failed (${response.status}).`)
  }
  return response.json() as Promise<T>
}

export const api = {
  status: (signal?: AbortSignal) => request<BackendStatus>('/api/status', { signal }),
  contacts: (signal?: AbortSignal) => request<{ contacts: Contact[] }>('/api/contacts', { signal }),
  demoContacts: (signal?: AbortSignal) =>
    request<{ contacts: Contact[] }>('/api/demo/contacts', { signal }),
  createContact: (input: ContactInput) =>
    request<{ contact: Contact }>('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
}
