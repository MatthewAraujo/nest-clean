import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(8080)
})

export type Env = z.infer<typeof envSchema>