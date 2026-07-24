-- ============================================================
-- Mahadev Enterprises — Attendance Table Setup
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create the attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_name  TEXT,
  employee_email TEXT,
  date           DATE        NOT NULL,
  punch_in_time  TEXT        NOT NULL,
  punch_out_time TEXT,
  working_hours  TEXT,
  status         TEXT        NOT NULL DEFAULT 'present'
                             CHECK (status IN ('present','late','absent','half_day','field_visit')),
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Unique constraint: one record per user per day
ALTER TABLE public.attendance
  ADD CONSTRAINT attendance_user_date_unique UNIQUE (user_id, date);

-- 3. Index for fast date + user queries
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON public.attendance (user_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date      ON public.attendance (date);

-- 4. Enable Row Level Security
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- 5. Policy: employee can read their own records
CREATE POLICY "emp_read_own"
  ON public.attendance FOR SELECT
  USING (auth.uid() = user_id);

-- 6. Policy: employee can insert their own record
CREATE POLICY "emp_insert_own"
  ON public.attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. Policy: employee can update (punch out) their own record
CREATE POLICY "emp_update_own"
  ON public.attendance FOR UPDATE
  USING (auth.uid() = user_id);

-- 8. Policy: admin can read ALL records
CREATE POLICY "admin_read_all"
  ON public.attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. Policy: admin can insert ANY record (manual entry)
CREATE POLICY "admin_insert_all"
  ON public.attendance FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 10. Policy: admin can update ANY record
CREATE POLICY "admin_update_all"
  ON public.attendance FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 11. Policy: admin can delete ANY record
CREATE POLICY "admin_delete_all"
  ON public.attendance FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
