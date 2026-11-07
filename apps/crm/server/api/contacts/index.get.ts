import { listContacts } from '@seed/db'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  return { contacts: await listContacts(getDb(), user.id) }
})
