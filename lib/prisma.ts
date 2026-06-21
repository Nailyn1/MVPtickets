import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }

  const connectionUrl = new URL(databaseUrl);

  if (!connectionUrl.searchParams.has("sslmode")) {
    connectionUrl.searchParams.set("sslmode", "require");
  }

  connectionUrl.searchParams.set("uselibpqcompat", "true");

  const adapter = new PrismaPg({
    connectionString: connectionUrl.toString(),
  });

  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
export default prisma;
