import { z } from "zod";

const envSchema = z.object({
  PORT: z.number().describe("Service port").default(3000),
  SVC_USERS_URL: z
    .string()
    .url()
    .describe("URL for users service")
    .default("https://jsonplaceholder.typicode.com"),
  VALKEY_URL: z
    .string()
    .describe("Valkey full URL")
    .default("redis://localhost:6379"),
  BEHIND_PROXY: z
    .preprocess((value) => String(value).toLowerCase() === "true" ? true : false, z.boolean())
    .describe("Is behind a proxy")
    .default(false),
});

export const envConfig = envSchema.parse(process.env);
