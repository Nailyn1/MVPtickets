"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  }

  return (
    <main className="flex h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
      <section className="w-full max-w-lg text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-zinc-500">
          MVP
        </p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Система управления заявками
        </h1>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            href="/create"
            className="rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Оставить заявку
          </Link>
          <Link
            href="/history"
            className="rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-lg font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-100 focus:outline-none focus:ring-4 focus:ring-zinc-200"
          >
            Мои заявки
          </Link>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 rounded-xl px-4 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-zinc-200"
        >
          Выйти
        </button>
      </section>
    </main>
  );
}
