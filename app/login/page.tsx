import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginOrCreateUser } from "@/lib/services/user.service";

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";

    const name = String(formData.get("name") ?? "");
    const role = String(formData.get("role") ?? "CLIENT");
    const user = await loginOrCreateUser(name, role === "ADMIN");

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      path: "/",
    });

    redirect(user.role === "ADMIN" ? "/dashboard" : "/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
      <form
        action={login}
        className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/60"
      >
        <h1 className="text-3xl font-semibold">Представьтесь, пожалуйста</h1>

        <label htmlFor="userName" className="mt-8 block text-sm font-medium">
          Ваше имя
        </label>
        <input
          id="userName"
          name="name"
          type="text"
          placeholder="Введите ваше имя"
          className="mt-3 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        <label htmlFor="role" className="mt-6 block text-sm font-medium">
          Роль
        </label>
        <select
          id="role"
          name="role"
          defaultValue="CLIENT"
          className="mt-3 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="CLIENT">Клиент</option>
          <option value="ADMIN">Администратор</option>
        </select>

        <button
          type="submit"
          className="mt-8 w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          Войти
        </button>
      </form>
    </main>
  );
}
