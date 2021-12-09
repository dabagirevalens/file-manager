import { PrismaClient } from "@prisma/client";

export const prismaClient = (): PrismaClient => {
    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    })

    return prisma
}