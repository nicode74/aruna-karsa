-- Migration 1.5: Security Definer function to check if email is preauthorized
-- This function runs with database owner privileges to bypass RLS policies
-- on the public.staff_members table for anonymous sign-up forms.

CREATE OR REPLACE FUNCTION public.is_email_preauthorized(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.staff_members WHERE email = email_to_check
  );
END;
$$;

-- Grant execution privileges on the function
GRANT EXECUTE ON FUNCTION public.is_email_preauthorized(text) TO anon;
GRANT EXECUTE ON FUNCTION public.is_email_preauthorized(text) TO authenticated;
