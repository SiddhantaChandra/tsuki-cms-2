-- Description: Add category_id and description columns to accessories table
-- Created at: 2025-05-23

-- Add category_id column to accessories table
ALTER TABLE "public"."accessories"
ADD COLUMN IF NOT EXISTS "category_id" UUID REFERENCES "public"."categories"(id);

-- Add description column to accessories table
ALTER TABLE "public"."accessories"
ADD COLUMN IF NOT EXISTS "description" TEXT;

-- Create index for the new columns for better query performance
CREATE INDEX IF NOT EXISTS idx_accessories_category_id ON "public"."accessories" USING btree ("category_id");

-- Recreate the collection_stats view to include accessories
-- This follows the pattern used for cards and slabs in the existing view
CREATE OR REPLACE VIEW "public"."collection_stats"
WITH (security_invoker='on') AS
SELECT 'Cards'::TEXT AS item_type, 
       COUNT(*) AS total_count,
       (SELECT COUNT(*) 
        FROM public.cards c
        JOIN public.categories cat ON c.category_id = cat.id
        WHERE cat.slug = 'pokemon') AS pokemon_count,
       (SELECT COUNT(*) 
        FROM public.cards c
        JOIN public.categories cat ON c.category_id = cat.id
        WHERE cat.slug = 'one-piece') AS onepiece_count
FROM public.cards
UNION ALL
SELECT 'Slabs'::TEXT AS item_type, 
       COUNT(*) AS total_count,
       (SELECT COUNT(*) 
        FROM public.slabs s
        JOIN public.categories cat ON s.category_id = cat.id
        WHERE cat.slug = 'pokemon') AS pokemon_count,
       (SELECT COUNT(*) 
        FROM public.slabs s
        JOIN public.categories cat ON s.category_id = cat.id
        WHERE cat.slug = 'one-piece') AS onepiece_count
FROM public.slabs
UNION ALL
SELECT 'Accessories'::TEXT AS item_type,
       COUNT(*) AS total_count,
       (SELECT COUNT(*) 
        FROM public.accessories a
        JOIN public.categories cat ON a.category_id = cat.id
        WHERE cat.slug = 'pokemon') AS pokemon_count,
       (SELECT COUNT(*) 
        FROM public.accessories a
        JOIN public.categories cat ON a.category_id = cat.id
        WHERE cat.slug = 'one-piece') AS onepiece_count
FROM public.accessories
UNION ALL
-- Continue with existing PSA Slabs section and other grading companies
SELECT 'PSA Slabs'::TEXT AS item_type, 
       COUNT(*) AS total_count,
       (SELECT COUNT(*) 
        FROM public.slabs s_1
        JOIN public.categories cat ON s_1.category_id = cat.id
        JOIN public.grade_companies gc_1 ON s_1.grade_company_id = gc_1.id
        WHERE cat.slug = 'pokemon' AND gc_1.slug = 'psa') AS pokemon_count,
       (SELECT COUNT(*) 
        FROM public.slabs s_1
        JOIN public.categories cat ON s_1.category_id = cat.id
        JOIN public.grade_companies gc_1 ON s_1.grade_company_id = gc_1.id
        WHERE cat.slug = 'one-piece' AND gc_1.slug = 'psa') AS onepiece_count
FROM public.slabs s
JOIN public.grade_companies gc ON s.grade_company_id = gc.id
WHERE gc.slug = 'psa'
UNION ALL
SELECT 'BGS Slabs'::TEXT AS item_type, 
       COUNT(*) AS total_count,
       (SELECT COUNT(*) 
        FROM public.slabs s_1
        JOIN public.categories cat ON s_1.category_id = cat.id
        JOIN public.grade_companies gc_1 ON s_1.grade_company_id = gc_1.id
        WHERE cat.slug = 'pokemon' AND gc_1.slug = 'bgs') AS pokemon_count,
       (SELECT COUNT(*) 
        FROM public.slabs s_1
        JOIN public.categories cat ON s_1.category_id = cat.id
        JOIN public.grade_companies gc_1 ON s_1.grade_company_id = gc_1.id
        WHERE cat.slug = 'one-piece' AND gc_1.slug = 'bgs') AS onepiece_count
FROM public.slabs s
JOIN public.grade_companies gc ON s.grade_company_id = gc.id
WHERE gc.slug = 'bgs'
UNION ALL
SELECT 'CGC Slabs'::TEXT AS item_type, 
       COUNT(*) AS total_count,
       (SELECT COUNT(*) 
        FROM public.slabs s_1
        JOIN public.categories cat ON s_1.category_id = cat.id
        JOIN public.grade_companies gc_1 ON s_1.grade_company_id = gc_1.id
        WHERE cat.slug = 'pokemon' AND gc_1.slug = 'cgc') AS pokemon_count,
       (SELECT COUNT(*) 
        FROM public.slabs s_1
        JOIN public.categories cat ON s_1.category_id = cat.id
        JOIN public.grade_companies gc_1 ON s_1.grade_company_id = gc_1.id
        WHERE cat.slug = 'one-piece' AND gc_1.slug = 'cgc') AS onepiece_count
FROM public.slabs s
JOIN public.grade_companies gc ON s.grade_company_id = gc.id
WHERE gc.slug = 'cgc'
UNION ALL
SELECT 'ARS Slabs'::TEXT AS item_type, 
       COUNT(*) AS total_count,
       (SELECT COUNT(*) 
        FROM public.slabs s_1
        JOIN public.categories cat ON s_1.category_id = cat.id
        JOIN public.grade_companies gc_1 ON s_1.grade_company_id = gc_1.id
        WHERE cat.slug = 'pokemon' AND gc_1.slug = 'ars') AS pokemon_count,
       (SELECT COUNT(*) 
        FROM public.slabs s_1
        JOIN public.categories cat ON s_1.category_id = cat.id
        JOIN public.grade_companies gc_1 ON s_1.grade_company_id = gc_1.id
        WHERE cat.slug = 'one-piece' AND gc_1.slug = 'ars') AS onepiece_count
FROM public.slabs s
JOIN public.grade_companies gc ON s.grade_company_id = gc.id
WHERE gc.slug = 'ars';

-- Create category-specific accessory views
CREATE OR REPLACE VIEW "public"."pokemon_accessories"
WITH (security_invoker='on') AS
SELECT a.id, a.name, a.slug, a.image_urls, a.thumbnail_url,
       a.category_id, a.accessory_type, a.price, a.description, a.created_at
FROM public.accessories a
JOIN public.categories cat ON a.category_id = cat.id
WHERE cat.slug = 'pokemon';

CREATE OR REPLACE VIEW "public"."onepiece_accessories"
WITH (security_invoker='on') AS
SELECT a.id, a.name, a.slug, a.image_urls, a.thumbnail_url,
       a.category_id, a.accessory_type, a.price, a.description, a.created_at
FROM public.accessories a
JOIN public.categories cat ON a.category_id = cat.id
WHERE cat.slug = 'one-piece'; 