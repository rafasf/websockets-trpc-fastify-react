import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
    createTRPCClient,
    createWSClient,
    httpBatchLink,
    splitLink,
    wsLink,
} from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "an-app-server/src/router";
import { TRPCProvider } from "./gateway/bff";
import { envConfig } from "./infra/env.client";
import { UserLists } from "./user-lists";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const webSocketClient = createWSClient({
  url: `${envConfig.VITE_BFF_WS_URL}/api/`,
});

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink<AppRouter>({ client: webSocketClient }),
      false: httpBatchLink<AppRouter>({
        url: `${envConfig.VITE_BFF_URL}/api`,
        fetch(url, options) {
          return fetch(url, {
            ...options,
          });
        },
      }),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <UserLists pool="list-1" />
        <ReactQueryDevtools initialIsOpen={false} />
      </TRPCProvider>
    </QueryClientProvider>
  );
}
