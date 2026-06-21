"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createTicket } from "@/lib/services/ticket.service";
import { getUserById } from "@/lib/services/user.service";

export async function createTicketAction(formData: FormData) {
  const text = String(formData.get("text") ?? "");
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await getUserById(userId);

  if (user.role === "ADMIN") {
    redirect("/dashboard");
  }

  await createTicket(text, userId);
  redirect("/");
}
