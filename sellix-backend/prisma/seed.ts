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

  const electronics = await prisma.category.findUnique({ where: { name: 'Electronics' } });
  const vehicles = await prisma.category.findUnique({ where: { name: 'Vehicles' } });
  const books = await prisma.category.findUnique({ where: { name: 'Books' } });
  const realEstate = await prisma.category.findUnique({ where: { name: 'Real Estate' } });
  const clothing = await prisma.category.findUnique({ where: { name: 'Clothing' } });
  const services = await prisma.category.findUnique({ where: { name: 'Services' } });

  if (realEstate) {
    await prisma.subcategory.createMany({
      data: [
        { name: 'Houses', categoryId: realEstate.id },
        { name: 'Apartments', categoryId: realEstate.id },
        { name: 'Land', categoryId: realEstate.id },
        { name: 'Commercial Properties', categoryId: realEstate.id },
        { name: 'Vacation Rentals', categoryId: realEstate.id },
        { name: 'Other Real Estate', categoryId: realEstate.id }
      ],
      skipDuplicates: true,
    });
  }

  if (clothing) {
    await prisma.subcategory.createMany({
      data: [
        { name: 'Men\'s Clothing', categoryId: clothing.id },
        { name: 'Women\'s Clothing', categoryId: clothing.id },
        { name: 'Children\'s Clothing', categoryId: clothing.id },
        { name: 'Accessories', categoryId: clothing.id },
        { name: 'Footwear', categoryId: clothing.id },
        { name: 'Other Clothing', categoryId: clothing.id }
      ],
      skipDuplicates: true,
    });
  }

  if (services) {
    await prisma.subcategory.createMany({
      data: [
        { name: 'Home Services', categoryId: services.id },
        { name: 'Personal Services', categoryId: services.id },
        { name: 'Professional Services', categoryId: services.id },
        { name: 'Event Services', categoryId: services.id },
        { name: 'Other Services', categoryId: services.id }
      ],
      skipDuplicates: true,
    });
  }

  if (electronics) {
    await prisma.subcategory.createMany({
      data: [
        { name: 'Phones', categoryId: electronics.id },
        { name: 'Laptops', categoryId: electronics.id },
        { name: 'TVs', categoryId: electronics.id },
      ],
      skipDuplicates: true,
    });
  }

  if (vehicles) {
    await prisma.subcategory.createMany({
      data: [
        { name: 'Cars', categoryId: vehicles.id },
        { name: 'Motorcycles', categoryId: vehicles.id },
        { name: 'Bicycles', categoryId: vehicles.id },
        { name: 'Trucks', categoryId: vehicles.id },
        { name: 'Trailers', categoryId: vehicles.id },
        { name: 'Other Vehicles', categoryId: vehicles.id }
      ],
      skipDuplicates: true,
    });
  }

  if (books) {
    await prisma.subcategory.createMany({
      data: [
        { name: 'Novels', categoryId: books.id },
        { name: 'Comics', categoryId: books.id },
        { name: 'Textbooks', categoryId: books.id },
        { name: 'E-books', categoryId: books.id },
        { name: 'Academic Books', categoryId: books.id },
        { name: 'Children\'s Books', categoryId: books.id },
        { name: 'Cookbooks', categoryId: books.id },
        { name: 'Self-help', categoryId: books.id },
        { name: 'Biographies', categoryId: books.id },
        { name: 'Christianity', categoryId: books.id },
        { name: 'Other Books', categoryId: books.id }
      ],
      skipDuplicates: true,
    });
  }

  console.log('✅ Categories & subcategories seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());