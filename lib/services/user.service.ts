import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { UserDTO } from "@/lib/dto";

function toUserDTO(user: { id: string; name: string; role: Role }): UserDTO {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
  };
}

export async function loginOrCreateUser(
  name: string,
  isAdmin?: boolean,
): Promise<UserDTO> {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Name is required");
  }

  let user = await prisma.user.findUnique({
    where: {
      name: trimmedName,
    },
  });

  if (!user) {
    const role = isAdmin ? Role.ADMIN : Role.CLIENT;

    user = await prisma.user.create({
      data: {
        name: trimmedName,
        role,
      },
    });
  }
  return toUserDTO(user);
}

export async function getUserById(userId: string): Promise<UserDTO> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("Unauthorized");
  }

  return toUserDTO(user);
}
