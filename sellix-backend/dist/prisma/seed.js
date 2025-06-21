"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.category.createMany({
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
        const electronics = yield prisma.category.findUnique({ where: { name: 'Electronics' } });
        const vehicles = yield prisma.category.findUnique({ where: { name: 'Vehicles' } });
        const books = yield prisma.category.findUnique({ where: { name: 'Books' } });
        const realEstate = yield prisma.category.findUnique({ where: { name: 'Real Estate' } });
        const clothing = yield prisma.category.findUnique({ where: { name: 'Clothing' } });
        const services = yield prisma.category.findUnique({ where: { name: 'Services' } });
        if (realEstate) {
            yield prisma.subcategory.createMany({
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
            yield prisma.subcategory.createMany({
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
            yield prisma.subcategory.createMany({
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
            yield prisma.subcategory.createMany({
                data: [
                    { name: 'Phones', categoryId: electronics.id },
                    { name: 'Laptops', categoryId: electronics.id },
                    { name: 'TVs', categoryId: electronics.id },
                ],
                skipDuplicates: true,
            });
        }
        if (vehicles) {
            yield prisma.subcategory.createMany({
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
            yield prisma.subcategory.createMany({
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
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
