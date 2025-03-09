import { useSubscription } from "@trpc/tanstack-react-query";
import { useTRPC } from "./gateway/bff";
import { useQueryClient } from "@tanstack/react-query";
import UserList from "./user-list";

export function UserLists({ pool }: { pool: string }) {
  const queryClient = useQueryClient();
  const bff = useTRPC();

  useSubscription(
    bff.onUpdates.subscriptionOptions(
      { namespace: pool },
      {
        enabled: true,
        onData: (data) => {
          queryClient.setQueryData(bff.allUsers.queryOptions().queryKey, () => {
            return data;
          });
        },
        onError: (err) => console.error(err),
      },
    ),
  );

  return (
    <header className="w-full p-4 bg-gray-900">
      <div className="grid grid-cols-3 gap-4">
        <section className="space-y-4">
          <UserList initialLetters={["l", "p", "g"]} />
        </section>
        <section className="space-y-4">
          <UserList initialLetters={["e", "m", "n"]} />
        </section>
        <section className="space-y-4">
          <UserList initialLetters={["c", "k"]} />
        </section>
      </div>
    </header>
  );
}
