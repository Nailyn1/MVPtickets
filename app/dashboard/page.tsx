import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HistoryTable } from "@/app/history/history-table";
import { getTickets } from "@/lib/services/ticket.service";
import { getUserById } from "@/lib/services/user.service";

async function logout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/login");
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await getUserById(userId);

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const tickets = await getTickets(user.id, user.role);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-500">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              Панель администратора
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              {user.name} · Администратор
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <a
              href="https://t.me/+oOZ9dEjJgLkxMjMy"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Получать уведомления
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-zinc-200"
              >
                Выйти
              </button>
            </form>
          </div>
        </div>

        <HistoryTable tickets={tickets} isAdmin />
      </div>
    </main>
  );
}
