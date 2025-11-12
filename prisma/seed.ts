import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@prisma.io",
    },
  });
  
  console.log({ alice, bob });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });