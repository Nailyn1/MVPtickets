"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getUserById } from "@/lib/services/user.service";
import { updateTicket } from "@/lib/services/ticket.service";

export async function answerTicketAction(formData: FormData) {
  const ticketId = String(formData.get("ticketId") ?? "");
  const managerComment = String(formData.get("managerComment") ?? "");
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    throw new Error("Forbidden");
  }

  const user = await getUserById(userId);
  await updateTicket(ticketId, user.role, "ANSWERED", managerComment);
  revalidatePath("/history");
  revalidatePath("/dashboard");
}
