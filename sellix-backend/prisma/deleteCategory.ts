import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.category.delete({
    where: {
      name: 'Home', // înlocuiește cu numele categoriei nedorite
    },
  });

  console.log('🗑️ Deleted category:', deleted);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());