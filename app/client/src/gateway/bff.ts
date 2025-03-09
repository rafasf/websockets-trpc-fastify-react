import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "an-app-server/src/router";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
