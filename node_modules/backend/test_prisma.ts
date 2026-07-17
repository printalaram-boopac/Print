import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing Prisma connection with DATABASE_URL from .env...');
  try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Successfully connected! Found users count:', users.length);
  } catch (err: any) {
    console.error('Connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
