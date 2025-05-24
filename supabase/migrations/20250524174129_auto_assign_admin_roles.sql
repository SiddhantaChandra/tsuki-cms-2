-- Improved admin role assignment
-- Replace the first-user trigger with one that checks admin_list

-- Drop the old trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a better function to assign admin roles based on admin_list
CREATE OR REPLACE FUNCTION "public"."handle_admin_role_assignment"()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- Check if the user's email is in the admin_list
  IF EXISTS (
    SELECT 1 FROM public.admin_list
    WHERE email = NEW.email
  ) THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create new trigger to assign admin roles based on admin_list
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_admin_role_assignment();

-- Also assign admin role to existing users who are in admin_list but don't have roles
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'
FROM auth.users u
JOIN public.admin_list al ON u.email = al.email
LEFT JOIN public.user_roles ur ON u.id = ur.user_id AND ur.role = 'admin'
WHERE ur.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;
