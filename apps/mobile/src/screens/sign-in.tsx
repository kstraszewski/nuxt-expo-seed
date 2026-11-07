import { useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { Button, Column, Host, TextInput } from '@expo/ui'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Notice, Page } from '@/components/page'
import { authClient } from '@/lib/auth-client'
import { api } from '@/lib/api'
import { apiURL, backendConfigured } from '@/lib/config'

export default function AccountScreen() {
  const status = useQuery({
    queryKey: ['status'],
    queryFn: ({ signal }) => api.status(signal),
    enabled: backendConfigured,
  })
  if (!backendConfigured) {
    return (
      <Page title="Connect your account">
        <Notice>
          Accounts are available after you connect EXPO_PUBLIC_API_URL to a configured CRM.
        </Notice>
      </Page>
    )
  }
  if (status.data?.mode !== 'live') {
    return (
      <Page title="Account">
        {status.isLoading ? (
          <ActivityIndicator />
        ) : (
          <Notice error={Boolean(status.error)}>
            {status.error?.message ||
              'This CRM is in demo mode. Set up its database and Better Auth first.'}
          </Notice>
        )}
      </Page>
    )
  }
  return <LiveAccount />
}

function LiveAccount() {
  const session = authClient.useSession()
  const queryClient = useQueryClient()
  const [register, setRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function submit() {
    if (pending) return
    setError('')
    setMessage('')
    if (!email.trim() || !password || (register && !name.trim())) {
      setError('Fill in all fields.')
      return
    }
    setPending(true)
    try {
      const result = register
        ? await authClient.signUp.email({
            name: name.trim(),
            email: email.trim(),
            password,
            callbackURL: `${apiURL}/login`,
          })
        : await authClient.signIn.email({ email: email.trim(), password })
      if (result.error) throw new Error(result.error.message || 'Could not sign in.')
      queryClient.removeQueries({ queryKey: ['contacts'] })
      if (register)
        setMessage(
          'Account created. If email verification is enabled, check your inbox before signing in.',
        )
      else router.replace('/contacts')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not reach the server. Try again.')
    } finally {
      setPending(false)
    }
  }

  async function signOut() {
    if (pending) return
    setPending(true)
    setError('')
    try {
      const result = await authClient.signOut()
      if (result.error) throw new Error(result.error.message || 'Could not sign out.')
      queryClient.removeQueries({ queryKey: ['contacts'] })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not sign out.')
    } finally {
      setPending(false)
    }
  }

  if (session.isPending)
    return (
      <Page title="Account">
        <ActivityIndicator accessibilityLabel="Loading session" />
      </Page>
    )
  if (session.data) {
    return (
      <Page title="Your account" subtitle={session.data.user.email}>
        <Notice>Signed in as {session.data.user.name}.</Notice>
        {error ? <Notice error>{error}</Notice> : null}
        <Host matchContents>
          <Button
            label={pending ? 'Signing out…' : 'Sign out'}
            disabled={pending}
            onPress={() => void signOut()}
          />
        </Host>
      </Page>
    )
  }
  return (
    <Page
      title={register ? 'Create an account' : 'Welcome back'}
      subtitle="Use the same account in the CRM and mobile app."
    >
      {session.error ? (
        <Notice error>Could not load your session. Try signing in again.</Notice>
      ) : null}
      <Host matchContents>
        <Column spacing={16}>
          {register ? (
            <TextInput
              accessibilityLabel="Name"
              placeholder="Name"
              onChangeText={setName}
              autoComplete="name"
              editable={!pending}
              style={{
                width: '100%',
                padding: 12,
                borderWidth: 1,
                borderColor: '#888888',
                borderRadius: 8,
              }}
            />
          ) : null}
          <TextInput
            accessibilityLabel="Email"
            placeholder="Email"
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            editable={!pending}
            style={{
              width: '100%',
              padding: 12,
              borderWidth: 1,
              borderColor: '#888888',
              borderRadius: 8,
            }}
          />
          <TextInput
            accessibilityLabel="Password"
            placeholder="Password"
            onChangeText={setPassword}
            secureTextEntry
            autoComplete={register ? 'new-password' : 'current-password'}
            editable={!pending}
            onSubmitEditing={() => void submit()}
            style={{
              width: '100%',
              padding: 12,
              borderWidth: 1,
              borderColor: '#888888',
              borderRadius: 8,
            }}
          />
          <Button
            label={pending ? 'Please wait…' : register ? 'Create account' : 'Sign in'}
            disabled={pending}
            onPress={() => void submit()}
          />
          <Button
            label={register ? 'I have an account' : 'Create an account'}
            variant="text"
            disabled={pending}
            onPress={() => {
              setRegister(!register)
              setError('')
              setMessage('')
            }}
          />
        </Column>
      </Host>
      {error ? <Notice error>{error}</Notice> : null}
      {message ? <Notice>{message}</Notice> : null}
      <Notice>
        Passwords need at least 12 characters. Verification and password recovery are handled by the
        CRM.
      </Notice>
    </Page>
  )
}
