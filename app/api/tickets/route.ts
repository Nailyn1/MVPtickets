import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type {
  CreateTicketRequestDTO,
  CreateTicketResponseDTO,
  GetTicketsResponseDTO,
  UpdateTicketRequestDTO,
  UpdateTicketResponseDTO,
} from "@/lib/dto";
import { getUserById } from "@/lib/services/user.service";
import {
  createTicket,
  getTickets,
  updateTicket,
} from "@/lib/services/ticket.service";

export const runtime = "nodejs";

function getErrorStatus(error: unknown) {
  if (error instanceof Error && error.message === "Forbidden") {
    return 403;
  }

  if (error instanceof Error && error.message === "Unauthorized") {
    return 401;
  }

  if (error instanceof Error) {
    return 400;
  }

  return 500;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await getUserById(userId);
    const tickets = await getTickets(user.id, user.role);

    const response: GetTicketsResponseDTO = {
      tickets,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { error: message },
      { status: getErrorStatus(error) },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateTicketRequestDTO;
    const ticket = await createTicket(body.text, body.userId);

    const response: CreateTicketResponseDTO = {
      ticket,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { error: message },
      { status: getErrorStatus(error) },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      throw new Error("Forbidden");
    }

    const user = await getUserById(userId);
    const body = (await request.json()) as UpdateTicketRequestDTO;
    const ticket = await updateTicket(
      body.ticketId,
      user.role,
      body.status,
      body.managerComment,
    );

    const response: UpdateTicketResponseDTO = {
      ticket,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { error: message },
      { status: getErrorStatus(error) },
    );
  }
}
