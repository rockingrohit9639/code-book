import { z } from 'zod'

export const payloadSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  picture: z.string().url(),
  given_name: z.string(),
  family_name: z.string().optional(),
})
