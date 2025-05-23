-- Categories Table
CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Sets Table
CREATE TABLE IF NOT EXISTS "public"."sets" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "category_id" UUID NOT NULL REFERENCES categories(id),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Subsets Table
CREATE TABLE IF NOT EXISTS "public"."subsets" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "set_id" UUID NOT NULL REFERENCES sets(id),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Grade Companies Table
CREATE TABLE IF NOT EXISTS "public"."grade_companies" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    "grades" TEXT[] -- Array of grade values as text to support non-numeric grades like 10+
);

-- Cards Table
CREATE TABLE IF NOT EXISTS "public"."cards" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "image_urls" TEXT[] NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "category_id" UUID NOT NULL REFERENCES categories(id),
    "set_id" UUID NOT NULL REFERENCES sets(id),
    "subset_id" UUID NOT NULL REFERENCES subsets(id),
    "condition" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "price" NUMERIC(10,2) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Slabs Table (graded cards)
CREATE TABLE IF NOT EXISTS "public"."slabs" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "image_urls" TEXT[] NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "category_id" UUID NOT NULL REFERENCES categories(id),
    "set_id" UUID NOT NULL REFERENCES sets(id),
    "subset_id" UUID NOT NULL REFERENCES subsets(id),
    "grade_company_id" UUID NOT NULL REFERENCES grade_companies(id),
    "grade_score" TEXT NOT NULL, -- Text representation of grade score to support non-decimal values like 10+
    "condition" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "price" NUMERIC(10,2) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Accessories Table
CREATE TABLE IF NOT EXISTS "public"."accessories" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "image_urls" TEXT[] NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "accessory_type" TEXT NOT NULL,
    "price" NUMERIC(10,2) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cards_category_set_subset ON "public"."cards" USING btree ("category_id", "set_id", "subset_id");
CREATE INDEX IF NOT EXISTS idx_cards_slug ON "public"."cards" USING btree ("slug");
CREATE INDEX IF NOT EXISTS idx_cards_price ON "public"."cards" USING btree ("price");
CREATE INDEX IF NOT EXISTS idx_cards_created_at ON "public"."cards" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS idx_slabs_category_set_subset ON "public"."slabs" USING btree ("category_id", "set_id", "subset_id");
CREATE INDEX IF NOT EXISTS idx_slabs_slug ON "public"."slabs" USING btree ("slug");
CREATE INDEX IF NOT EXISTS idx_slabs_grade ON "public"."slabs" USING btree ("grade_company_id", "grade_score");
CREATE INDEX IF NOT EXISTS idx_slabs_price ON "public"."slabs" USING btree ("price");
CREATE INDEX IF NOT EXISTS idx_slabs_created_at ON "public"."slabs" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS idx_accessories_slug ON "public"."accessories" USING btree ("slug");
CREATE INDEX IF NOT EXISTS idx_accessories_type ON "public"."accessories" USING btree ("accessory_type");
CREATE INDEX IF NOT EXISTS idx_accessories_price ON "public"."accessories" USING btree ("price");
CREATE INDEX IF NOT EXISTS idx_accessories_created_at ON "public"."accessories" USING btree ("created_at");

CREATE INDEX IF NOT EXISTS idx_categories_slug ON "public"."categories" USING btree ("slug");
CREATE INDEX IF NOT EXISTS idx_grade_companies_slug ON "public"."grade_companies" USING btree ("slug");
CREATE INDEX IF NOT EXISTS idx_sets_category_id ON "public"."sets" USING btree ("category_id");
CREATE INDEX IF NOT EXISTS idx_sets_slug ON "public"."sets" USING btree ("slug");
CREATE INDEX IF NOT EXISTS idx_subsets_set_id ON "public"."subsets" USING btree ("set_id");
CREATE INDEX IF NOT EXISTS idx_subsets_slug ON "public"."subsets" USING btree ("slug");

-- Enable Row Level Security on all tables
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."subsets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."grade_companies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."cards" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."slabs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."accessories" ENABLE ROW LEVEL SECURITY;

-- Public read access policies for all tables
CREATE POLICY "Public read access for categories" ON "public"."categories" FOR SELECT USING (true);
CREATE POLICY "Public read access for sets" ON "public"."sets" FOR SELECT USING (true);
CREATE POLICY "Public read access for subsets" ON "public"."subsets" FOR SELECT USING (true);
CREATE POLICY "Public read access for grade_companies" ON "public"."grade_companies" FOR SELECT USING (true);
CREATE POLICY "Public read access for cards" ON "public"."cards" FOR SELECT USING (true);
CREATE POLICY "Public read access for slabs" ON "public"."slabs" FOR SELECT USING (true);
CREATE POLICY "Public read access for accessories" ON "public"."accessories" FOR SELECT USING (true);

-- Admin policies for categories
CREATE POLICY "Admin insert for categories" ON "public"."categories" 
FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Admin update for categories" ON "public"."categories" 
FOR UPDATE TO authenticated USING (is_admin());

CREATE POLICY "Admin delete for categories" ON "public"."categories" 
FOR DELETE TO authenticated USING (is_admin());

-- Admin policies for sets
CREATE POLICY "Admin insert for sets" ON "public"."sets" 
FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Admin update for sets" ON "public"."sets" 
FOR UPDATE TO authenticated USING (is_admin());

CREATE POLICY "Admin delete for sets" ON "public"."sets" 
FOR DELETE TO authenticated USING (is_admin());

-- Admin policies for subsets
CREATE POLICY "Admin insert for subsets" ON "public"."subsets" 
FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Admin update for subsets" ON "public"."subsets" 
FOR UPDATE TO authenticated USING (is_admin());

CREATE POLICY "Admin delete for subsets" ON "public"."subsets" 
FOR DELETE TO authenticated USING (is_admin());

-- Admin policies for grade_companies
CREATE POLICY "Admin insert for grade_companies" ON "public"."grade_companies" 
FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Admin update for grade_companies" ON "public"."grade_companies" 
FOR UPDATE TO authenticated USING (is_admin());

CREATE POLICY "Admin delete for grade_companies" ON "public"."grade_companies" 
FOR DELETE TO authenticated USING (is_admin());

-- Admin and Editor policies for cards
CREATE POLICY "Admin insert for cards" ON "public"."cards" 
FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Admin update for cards" ON "public"."cards" 
FOR UPDATE TO authenticated USING (is_admin());

CREATE POLICY "Admin delete for cards" ON "public"."cards" 
FOR DELETE TO authenticated USING (is_admin());

CREATE POLICY "Editor insert for cards" ON "public"."cards" 
FOR INSERT TO authenticated 
WITH CHECK (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_id = auth.uid()
  AND role = 'editor'
));

CREATE POLICY "Editor update for cards" ON "public"."cards" 
FOR UPDATE TO authenticated 
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_id = auth.uid()
  AND role = 'editor'
));

-- Admin and Editor policies for slabs
CREATE POLICY "Admin insert for slabs" ON "public"."slabs" 
FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Admin update for slabs" ON "public"."slabs" 
FOR UPDATE TO authenticated USING (is_admin());

CREATE POLICY "Admin delete for slabs" ON "public"."slabs" 
FOR DELETE TO authenticated USING (is_admin());

CREATE POLICY "Editor insert for slabs" ON "public"."slabs" 
FOR INSERT TO authenticated 
WITH CHECK (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_id = auth.uid()
  AND role = 'editor'
));

CREATE POLICY "Editor update for slabs" ON "public"."slabs" 
FOR UPDATE TO authenticated 
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_id = auth.uid()
  AND role = 'editor'
));

-- Admin policies for accessories
CREATE POLICY "Admin insert for accessories" ON "public"."accessories" 
FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Admin update for accessories" ON "public"."accessories" 
FOR UPDATE TO authenticated USING (is_admin());

CREATE POLICY "Admin delete for accessories" ON "public"."accessories" 
FOR DELETE TO authenticated USING (is_admin()); 