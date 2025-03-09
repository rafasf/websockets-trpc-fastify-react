import { z } from "zod";

const envSchema = z.object({
  VITE_BFF_URL: z
    .string()
    .url()
    .describe("URL for the BFF")
    .default("http://localhost:3000"),
  VITE_BFF_WS_URL: z
    .string()
    .url()
    .describe("Websocket URL for the BFF")
    .default("ws://localhost:3000"),
});

export const envConfig = envSchema.parse(import.meta.env);
