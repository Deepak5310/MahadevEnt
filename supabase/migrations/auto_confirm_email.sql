-- ============================================================
-- Mahadev Enterprises — Auto Confirm Email Trigger
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================
-- This provides a PERMANENT FIX for the "Email not confirmed" error.
-- Whenever a new employee is created by the Admin, this trigger will
-- instantly mark their email as confirmed at the database level,
-- allowing them to log in immediately without needing to verify an email.

CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Instantly confirm the user's email upon creation
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$;

-- Drop the trigger if it already exists to prevent duplication
DROP TRIGGER IF EXISTS auto_confirm_email_trigger ON auth.users;

-- Create the trigger to run automatically whenever a new user signs up
CREATE TRIGGER auto_confirm_email_trigger
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_confirm_email();
