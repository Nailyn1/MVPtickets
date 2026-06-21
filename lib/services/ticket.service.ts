import { Role, Status as PrismaStatus, type Ticket } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { Status, TicketDTO } from "@/lib/dto";
import { analyzeTicketWithAI } from "../ai";
import { sendTelegramNotification } from "../telegram";

function toTicketDTO(ticket: Ticket): TicketDTO {
  return {
    id: ticket.id,
    text: ticket.text,
    status: ticket.status,
    managerComment: ticket.managerComment,
    aiSummary: ticket.aiSummary,
    aiCategory: ticket.aiCategory,
    aiPriority: ticket.aiPriority,
    aiNextStep: ticket.aiNextStep,
    userId: ticket.userId,
    createdAt: ticket.createdAt.toISOString(),
  };
}

export async function createTicket(
  text: string,
  userId: string,
): Promise<TicketDTO> {
  const trimmedText = text.trim();

  if (!trimmedText) {
    throw new Error("Text is required");
  }

  if (trimmedText.length > 300) {
    throw new Error("Text must be 300 characters or less");
  }

  const aiData = await analyzeTicketWithAI(text);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  const userName = user!.name;

  const ticket = await prisma.ticket.create({
    data: {
      text: trimmedText,
      userId,
      status: PrismaStatus.IN_PROGRESS,
      aiSummary: aiData.aiSummary,
      aiCategory: aiData.aiCategory,
      aiPriority: aiData.aiPriority,
      aiNextStep: aiData.aiNextStep,
    },
  });

  sendTelegramNotification(ticket, userName);

  return toTicketDTO(ticket);
}

export async function getTickets(
  userId: string,
  userRole: string,
): Promise<TicketDTO[]> {
  const tickets = await prisma.ticket.findMany({
    where: userRole === Role.ADMIN ? undefined : { userId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tickets.map(toTicketDTO);
}

export async function updateTicket(
  ticketId: string,
  userRole: string,
  status?: Status,
  managerComment?: string,
): Promise<TicketDTO> {
  if (userRole !== Role.ADMIN) {
    throw new Error("Forbidden");
  }

  const ticket = await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status,
      managerComment,
    },
  });

  return toTicketDTO(ticket);
}
