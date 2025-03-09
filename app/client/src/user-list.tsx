import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "./gateway/bff";
import type { User } from "an-app-server/src/user";

export default function UserList({
  initialLetters,
}: { initialLetters: string[] }) {
  const bff = useTRPC();
  const { data } = useSuspenseQuery({
    ...bff.allUsers.queryOptions(),
    select: (data: User[]) =>
      data.filter((user) =>
        initialLetters.includes(user.name.toLowerCase().charAt(0)),
      ),
  });

  return data.map((user: User) => <UserCard key={user.id} {...user} />);
}

function UserCard(user: User) {
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden">
      <section className="md:flex">
        <main className="p-8 w-full relative">
          <header>
            <span className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              User Profile
            </span>
            <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
              {user.name}
            </h2>
          </header>
          <p className="mt-2 text-slate-500">{user.bio}</p>
          <footer className="absolute top-2 right-2 text-xs text-gray-400">
            <span>{user.id}</span>
          </footer>
        </main>
      </section>
    </article>
  );
}
