import { deleteContact } from '@seed/db'
import { contactIdSchema } from '@seed/shared'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = contactIdSchema.safeParse(getRouterParam(event, 'id'))
  if (!id.success) throw createError({ statusCode: 400, statusMessage: 'Niepoprawne ID kontaktu.' })
  if (!(await deleteContact(getDb(), user.id, id.data)))
    throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono kontaktu.' })
  return { success: true }
})
