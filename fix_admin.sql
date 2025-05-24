-- Fix admin_list table in hosted database
-- Insert admin emails if they don't exist

INSERT INTO "public"."admin_list" ("email", "created_at") 
VALUES 
  ('iamsiddhanta.6@gmail.com', now()),
  ('iamsiddhanta.9@gmail.com', now())
ON CONFLICT (email) DO NOTHING;

-- Check current admin_list
SELECT * FROM "public"."admin_list"; 