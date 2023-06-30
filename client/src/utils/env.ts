import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_BEARER_TOKEN_KEY: z.string(),
  VITE_CRYPTO_KEY: z.string(),
  VITE_GOOGLE_CLIENT_ID: z.string(),
})

export const ENV = envSchema.parse(import.meta.env)
