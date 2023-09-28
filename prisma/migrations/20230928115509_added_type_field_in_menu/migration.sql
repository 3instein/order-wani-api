-- CreateEnum
CREATE TYPE "type" AS ENUM ('food', 'drink');

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "type" "type" NOT NULL DEFAULT 'food';
