import { updateContact } from '@seed/db'
import { contactIdSchema, contactUpdateSchema } from '@seed/shared'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = contactIdSchema.safeParse(getRouterParam(event, 'id'))
  const input = contactUpdateSchema.safeParse(await readBody(event))
  if (!id.success || !input.success)
    throw createError({ statusCode: 400, statusMessage: 'Niepoprawne dane kontaktu.' })
  const contact = await updateContact(getDb(), user.id, id.data, input.data)
  if (!contact) throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono kontaktu.' })
  return { contact }
})
