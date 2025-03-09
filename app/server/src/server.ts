import cors from "@fastify/cors";
import ws from "@fastify/websocket";
import {
  type CreateFastifyContextOptions,
  type FastifyTRPCPluginOptions,
  fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { envConfig } from "./infra/env.server";
import { type AppRouter, appRouter } from "./router";

function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? "anonymous" };
  return { req, res, user };
}

const server = fastify({
  logger: true,
  maxParamLength: 5000,
});

if (!envConfig.BEHIND_PROXY) {
  server.log.info({ proxy: "no" });
  server.register(cors, {
    origin: ["http://localhost:3001"],
  });
} else {
  server.log.info({ proxy: "yes" });
}

server.register(ws);
server.register(fastifyTRPCPlugin, {
  prefix: "/api/",
  useWSS: true,
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      server.log.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

export const serverLog = server.log;

(async () => {
  try {
    await server.listen({ port: envConfig.PORT, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
