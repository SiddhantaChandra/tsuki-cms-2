-- Create views for specialized queries and data organization

-- View for PSA graded slabs
CREATE OR REPLACE VIEW "public"."psa_slabs" 
WITH (security_invoker='on') AS
SELECT s.id, s.name, s.slug, s.image_urls, s.thumbnail_url, 
       s.category_id, s.set_id, s.subset_id, s.grade_company_id,
       s.grade_score, s.condition, s.language, s.price, s.created_at
FROM public.slabs s
JOIN public.grade_companies gc ON s.grade_company_id = gc.id
WHERE gc.slug = 'psa';

-- View for BGS graded slabs 
CREATE OR REPLACE VIEW "public"."bgs_slabs" 
WITH (security_invoker='on') AS
SELECT s.id, s.name, s.slug, s.image_urls, s.thumbnail_url, 
       s.category_id, s.set_id, s.subset_id, s.grade_company_id,
       s.grade_score, s.condition, s.language, s.price, s.created_at
FROM public.slabs s
JOIN public.grade_companies gc ON s.grade_company_id = gc.id
WHERE gc.slug = 'bgs';

-- View for CGC graded slabs
CREATE OR REPLACE VIEW "public"."cgc_slabs" 
WITH (security_invoker='on') AS
SELECT s.id, s.name, s.slug, s.image_urls, s.thumbnail_url, 
       s.category_id, s.set_id, s.subset_id, s.grade_company_id,
       s.grade_score, s.condition, s.language, s.price, s.created_at
FROM public.slabs s
JOIN public.grade_companies gc ON s.grade_company_id = gc.id
WHERE gc.slug = 'cgc';

-- View for ARS graded slabs
CREATE OR REPLACE VIEW "public"."ars_slabs" 
WITH (security_invoker='on') AS
SELECT s.id, s.name, s.slug, s.image_urls, s.thumbnail_url, 
       s.category_id, s.set_id, s.subset_id, s.grade_company_id,
       s.grade_score, s.condition, s.language, s.price, s.created_at
FROM public.slabs s
JOIN public.grade_companies gc ON s.grade_company_id = gc.id
WHERE gc.slug = 'ars';

-- View for Pokemon cards
CREATE OR REPLACE VIEW "public"."pokemon_cards"
WITH (security_invoker='on') AS
SELECT c.id, c.name, c.slug, c.image_urls, c.thumbnail_url,
       c.category_id, c.set_id, c.subset_id, c.condition,
       c.language, c.price, c.created_at
FROM public.cards c
JOIN public.categories cat ON c.category_id = cat.id
WHERE cat.slug = 'pokemon';

-- View for Pokemon slabs
CREATE OR REPLACE VIEW "public"."pokemon_slabs"
WITH (security_invoker='on') AS
SELECT s.id, s.name, s.slug, s.image_urls, s.thumbnail_url,
       s.category_id, s.set_id, s.subset_id, s.grade_company_id,
       s.grade_score, s.condition, s.language, s.price, s.created_at
FROM public.slabs s
JOIN public.categories cat ON s.category_id = cat.id
WHERE cat.slug = 'pokemon';

-- View for One Piece cards
CREATE OR REPLACE VIEW "public"."onepiece_cards"
WITH (security_invoker='on') AS
SELECT c.id, c.name, c.slug, c.image_urls, c.thumbnail_url,
       c.category_id, c.set_id, c.subset_id, c.condition,
       c.language, c.price, c.created_at
FROM public.cards c
JOIN public.categories cat ON c.category_id = cat.id
WHERE cat.slug = 'one-piece';

-- View for One Piece slabs
CREATE OR REPLACE VIEW "public"."onepiece_slabs"
WITH (security_invoker='on') AS
SELECT s.id, s.name, s.slug, s.image_urls, s.thumbnail_url,
       s.category_id, s.set_id, s.subset_id, s.grade_company_id,
       s.grade_score, s.condition, s.language, s.price, s.created_at
FROM public.slabs s
JOIN public.categories cat ON s.category_id = cat.id
WHERE cat.slug = 'one-piece';

-- View for grade distribution statistics
CREATE OR REPLACE VIEW "public"."grade_distribution"
WITH (security_invoker='on') AS
SELECT gc.name AS grading_company, s.grade_score, COUNT(*) AS count
FROM public.slabs s
JOIN public.grade_companies gc ON s.grade_company_id = gc.id
GROUP BY gc.name, s.grade_score
ORDER BY gc.name, s.grade_score DESC;

-- View for collection statistics
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