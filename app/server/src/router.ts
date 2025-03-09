import { once } from "node:events";
import { initTRPC } from "@trpc/server";
import Redis from "ioredis";
import { z } from "zod";
import { envConfig } from "./infra/env.server";
import { serverLog } from "./server";
import { allUsers, idSchema, userById, userSchema, type User } from "./user";

export const t = initTRPC.create();

export const appRouter = t.router({
  allUsers: t.procedure.query(allUsers),
  userById: t.procedure
    .input(idSchema)
    .query(async ({ input }) => userById(input)),
  onUpdates: t.procedure
    .input(z.object({ namespace: z.string() }))
    .subscription(async function* ({ input, signal }) {
      const channel = input.namespace;
      const subClient = new Redis(envConfig.VALKEY_URL);

      try {
        await subClient.subscribe(channel);
        serverLog.info({ msg: "Subscribed to Redis channel", channel });

        signal?.addEventListener(
          "abort",
          async () => {
            await subClient.unsubscribe(channel);
            await subClient.quit();
            serverLog.info({ msg: "Unsubscribed from Redis channel", channel });
          },
          { once: true },
        );

        while (!signal?.aborted) {
          try {
            const [receivedChannel, message] = await once(subClient, "message");

            if (receivedChannel === channel) {
              try {
                const users = z.array(userSchema).parse(JSON.parse(message));
                yield usersDecoratedWithHostname(users);
              } catch (e) {
                serverLog.error({ msg: "Error parsing Redis message", e });
                yield message;
              }
            }
          } catch (error) {
            if (!signal?.aborted) {
              serverLog.error({ msg: "Error in Redis subscription", error });
            }
          }
        }
      } catch (error) {
        serverLog.error({ msg: "Redis subscription setup error", error });
        throw error;
      }
    }),
});

function usersDecoratedWithHostname(users: User[]) {
  return users.map((user) => ({
    ...user,
    name: `${user.name} (from ${process.env.HOSTNAME || "local"})`,
  }));
}

export type AppRouter = typeof appRouter;
