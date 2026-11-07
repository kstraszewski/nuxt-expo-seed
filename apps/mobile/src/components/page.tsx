import type { ReactNode } from 'react'
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'

export function Page({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  const dark = useColorScheme() === 'dark'
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: dark ? '#111111' : '#fafafa' }}
      contentContainerStyle={styles.page}
    >
      <View style={styles.header}>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: dark ? '#fafafa' : '#111111' }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: dark ? '#bcbcbc' : '#555555' }]}>{subtitle}</Text>
        ) : null}
      </View>
      {children}
    </ScrollView>
  )
}

export function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  const dark = useColorScheme() === 'dark'
  return (
    <Text
      accessibilityRole={error ? 'alert' : undefined}
      style={[styles.notice, { color: dark ? '#eeeeee' : '#333333' }]}
    >
      {children}
    </Text>
  )
}

export const styles = StyleSheet.create({
  page: {
    padding: 24,
    paddingBottom: 48,
    gap: 24,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  header: { gap: 12 },
  title: { fontSize: 32, fontWeight: '600' },
  subtitle: { fontSize: 17, lineHeight: 25 },
  notice: { fontSize: 15, lineHeight: 23 },
})
