import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'Electronics' },
      { name: 'Real Estate' },
      { name: 'Vehicles' },
      { name: 'Clothing' },
      { name: 'Books' },
      { name: 'Services' },
    ],
    skipDuplicates: true, 
  });

  console.log('✅ Categories seeded successfully');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());