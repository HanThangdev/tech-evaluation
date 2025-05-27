import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined;
}

let prisma: PrismaClient | null = null;

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    if (!global.prismaClient) {
      global.prismaClient = new PrismaClient();
    }

    prisma = global.prismaClient;
  }
}

export default prisma;
