import type { Contact } from '@seed/shared'

export default defineEventHandler(() => {
  const date = '2026-01-01T12:00:00.000Z'
  const contacts: Contact[] = [
    {
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Alex Morgan',
      email: 'alex@example.com',
      company: 'Example Studio',
      status: 'active',
      createdAt: date,
      updatedAt: date,
    },
    {
      id: '00000000-0000-4000-8000-000000000002',
      name: 'Sam Taylor',
      email: 'sam@example.com',
      company: 'Sample Labs',
      status: 'lead',
      createdAt: date,
      updatedAt: date,
    },
    {
      id: '00000000-0000-4000-8000-000000000003',
      name: 'Charlie Lee',
      email: 'charlie@example.com',
      company: 'Demo Company',
      status: 'archived',
      createdAt: date,
      updatedAt: date,
    },
  ]
  return { contacts }
})
