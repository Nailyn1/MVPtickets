import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTickets } from "@/lib/services/ticket.service";
import { getUserById } from "@/lib/services/user.service";
import { HistoryTable } from "./history-table";

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await getUserById(userId);

  if (user.role === "ADMIN") {
    redirect("/dashboard");
  }

  const tickets = await getTickets(user.id, user.role);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/"
          className="inline-flex rounded-xl px-1 py-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-zinc-200"
        >
          Назад
        </Link>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-500">
              История
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Мои заявки</h1>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm">
            {user.name} · Клиент
          </div>
        </div>

        <HistoryTable tickets={tickets} isAdmin={false} />
      </div>
    </main>
  );
}
