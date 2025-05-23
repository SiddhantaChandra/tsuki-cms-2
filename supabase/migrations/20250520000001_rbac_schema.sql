SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET search_path TO public;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;

-- RBAC: User Roles System
-- Create a user_roles table that supports multiple roles per user
CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE("user_id", "role")
);

-- Create admin_list table for backward compatibility
CREATE TABLE IF NOT EXISTS "public"."admin_list" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Helper functions for RBAC
-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION "public"."is_admin"() 
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- Function to check if a specified user is an admin
CREATE OR REPLACE FUNCTION "public"."check_user_is_admin"(user_id UUID) 
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $_$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = $1
    AND user_roles.role = 'admin'
  );
$_$;

-- Function to automatically make the first user an admin
CREATE OR REPLACE FUNCTION "public"."handle_first_user_as_admin"()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- Check if this is the first user
  IF (SELECT COUNT(*) FROM auth.users) = 1 THEN
    -- Insert admin role for the first user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to make the first registered user an admin
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_first_user_as_admin();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON "public"."user_roles" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON "public"."user_roles" USING btree ("role");
CREATE INDEX IF NOT EXISTS idx_admin_list_email ON "public"."admin_list" USING btree ("email");

-- Enable RLS on the tables
ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."admin_list" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
-- Users can view their own roles
CREATE POLICY "Users can view their own roles" ON "public"."user_roles"
    FOR SELECT USING (user_id = auth.uid());

-- Only admins can manage user roles
CREATE POLICY "Admins can manage user roles" ON "public"."user_roles"
    FOR ALL USING (is_admin());

-- RLS Policies for admin_list
-- Public read access to admin_list
CREATE POLICY "Public read access for admin list" ON "public"."admin_list"
    FOR SELECT USING (true);

-- Only admins can manage the admin list
CREATE POLICY "Admins can insert new admins" ON "public"."admin_list"
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM "public"."admin_list"
        WHERE "email" = (auth.jwt() ->> 'email'::text)
    ));

CREATE POLICY "Admins can update admins" ON "public"."admin_list"
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM "public"."admin_list"
        WHERE "email" = (auth.jwt() ->> 'email'::text)
    ));

CREATE POLICY "Admins can delete admins" ON "public"."admin_list"
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM "public"."admin_list"
        WHERE "email" = (auth.jwt() ->> 'email'::text)
    )); 