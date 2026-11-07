import { createContact } from '@seed/db'
import { contactInputSchema } from '@seed/shared'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const parsed = contactInputSchema.safeParse(await readBody(event))
  if (!parsed.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'Niepoprawne dane kontaktu.',
      data: parsed.error.flatten(),
    })
  setResponseStatus(event, 201)
  return { contact: await createContact(getDb(), user.id, parsed.data) }
})
