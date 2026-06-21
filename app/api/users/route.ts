import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type {
  UserLoginRequestDTO,
  UserLoginResponseDTO,
} from "@/lib/dto";
import { loginOrCreateUser } from "@/lib/services/user.service";

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UserLoginRequestDTO;
    const user = await loginOrCreateUser(body.name, body.isAdmin);

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      path: "/",
    });

    const response: UserLoginResponseDTO = {
      user,
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
