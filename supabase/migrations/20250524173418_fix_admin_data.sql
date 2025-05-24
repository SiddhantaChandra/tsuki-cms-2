-- Fix admin_list table - ensure admin emails are present
-- Insert admin emails if they don't exist

INSERT INTO "public"."admin_list" ("email", "created_at") 
VALUES 
  ('iamsiddhanta.6@gmail.com', now()),
  ('iamsiddhanta.9@gmail.com', now())
ON CONFLICT (email) DO NOTHING;
