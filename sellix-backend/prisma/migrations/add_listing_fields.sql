-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_categoryId_fkey";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "categoryId",
DROP COLUMN "currency",
DROP COLUMN "price",
DROP COLUMN "type";

-- DropTable
DROP TABLE "Category";

-- DropEnum
DROP TYPE "Currency";

-- DropEnum
DROP TYPE "ListingType";

