import { z } from 'zod'

export const contactStatusSchema = z.enum(['lead', 'active', 'archived'])

const contactFields = {
  name: z.string().trim().min(1).max(120),
  email: z
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
  company: z.string().trim().max(160),
  status: contactStatusSchema,
}

export const contactInputSchema = z
  .object({
    ...contactFields,
    company: contactFields.company.default(''),
    status: contactFields.status.default('lead'),
  })
  .strict()

export const contactUpdateSchema = z
  .object(contactFields)
  .partial()
  .strict()
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'Provide at least one contact field.',
  })

export const contactIdSchema = z.uuid()

export type ContactInput = z.infer<typeof contactInputSchema>
export type ContactUpdate = z.infer<typeof contactUpdateSchema>
export type ContactStatus = z.infer<typeof contactStatusSchema>

export interface Contact extends ContactInput {
  id: string
  createdAt: string
  updatedAt: string
}

export interface SeedStatus {
  mode: 'demo' | 'live'
  authConfigured: boolean
  emailConfigured: boolean
  databaseConfigured: boolean
}
