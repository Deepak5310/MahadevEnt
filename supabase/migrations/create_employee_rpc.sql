-- ============================================================
-- Mahadev Enterprises — Admin Create Employee RPC
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.create_employee(
  emp_email TEXT,
  emp_password TEXT,
  emp_full_name TEXT,
  emp_role TEXT,
  emp_department TEXT,
  emp_designation TEXT,
  emp_phone TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- 1. Check if the person calling this is an admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Not authorized to create employees';
  END IF;

  -- 2. Check if email already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = emp_email) THEN
    RAISE EXCEPTION 'User with this email already exists';
  END IF;

  new_user_id := gen_random_uuid();

  -- 3. Insert into auth.users directly (Bypasses email confirmation completely!)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    emp_email,
    crypt(emp_password, gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', emp_full_name),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- 4. Upsert into public.profiles directly (prevents duplicate key error if auto-trigger exists)
  INSERT INTO public.profiles (
    id, full_name, email, role, department, designation, phone, is_active
  )
  VALUES (
    new_user_id, emp_full_name, emp_email, emp_role, emp_department, emp_designation, emp_phone, true
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name   = EXCLUDED.full_name,
    email       = EXCLUDED.email,
    role        = EXCLUDED.role,
    department  = EXCLUDED.department,
    designation = EXCLUDED.designation,
    phone       = EXCLUDED.phone,
    is_active   = EXCLUDED.is_active;

  RETURN new_user_id;
END;
$$;
