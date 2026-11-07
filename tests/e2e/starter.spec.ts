import { expect, test } from '@playwright/test'

test('landing has stack and working CRM link', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('stacku technologicznego')
  await expect(page.getByRole('heading', { name: 'Neon + Drizzle' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Zobacz CRM' })).toHaveAttribute(
    'href',
    'http://localhost:3001',
  )
})

test('CRM demo searches fixtures and prevents writes', async ({ page, request }) => {
  await page.goto('http://127.0.0.1:3001')
  await expect(page.getByText('Tryb demo', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Dodaj kontakt' })).toBeDisabled()
  await page.getByRole('textbox', { name: 'Szukaj kontaktu' }).fill('Sample Labs')
  await expect(page.getByText('Sam Taylor', { exact: true })).toBeVisible()
  await expect(page.getByText('Alex Morgan', { exact: true })).toHaveCount(0)
  const write = await request.post('http://127.0.0.1:3001/api/contacts', {
    data: { name: 'Forbidden write', email: 'nobody@example.com' },
  })
  expect(write.status()).toBe(503)
  const contacts = await request.get('http://127.0.0.1:3001/api/contacts')
  expect(contacts.status()).toBe(503)
})

test('API exposes safe status and rejects untrusted origins', async ({ request }) => {
  const response = await request.get('http://127.0.0.1:3001/api/status')
  expect(response.headers()['cache-control']).toContain('no-store')
  const status = await response.json()
  expect(status.mode).toBe('demo')
  expect(Object.keys(status).sort()).toEqual([
    'authConfigured',
    'databaseConfigured',
    'emailConfigured',
    'mode',
  ])
  const hostile = await request.post('http://127.0.0.1:3001/api/contacts', {
    headers: { Origin: 'https://evil.example' },
    data: {},
  })
  expect(hostile.status()).toBe(403)
  const session = await request.get('http://127.0.0.1:3001/api/session')
  expect(await session.json()).toEqual({ user: null })
})

test('demo login explains setup and cannot register', async ({ page }) => {
  await page.goto('http://127.0.0.1:3001/login')
  await expect(page.getByText('Logowanie wymaga konfiguracji')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Zaloguj się', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Utwórz konto', exact: true }).click()
  await expect(page.getByRole('textbox', { name: 'Imię', exact: false })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Utwórz konto', exact: true })).toBeDisabled()
})
