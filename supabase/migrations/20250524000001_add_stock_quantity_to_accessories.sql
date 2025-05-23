-- Description: Add stock_quantity column to accessories table
-- Created at: 2025-05-24

-- Add stock_quantity column to accessories table with default value 0
ALTER TABLE "public"."accessories"
ADD COLUMN IF NOT EXISTS "stock_quantity" INTEGER NOT NULL DEFAULT 0;

-- Create index for the new column for better query performance
CREATE INDEX IF NOT EXISTS idx_accessories_stock_quantity ON "public"."accessories" USING btree ("stock_quantity");

-- Update views if needed
-- Currently there are no views that need updating for this column 