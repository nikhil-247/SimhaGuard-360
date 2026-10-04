/*
  SimhaGuard 360 production-readiness hardening
  - Aligns DB constraints with the TypeScript/domain model.
  - Protects RFID PII with operations-only access.
  - Removes client-controlled admin role assignment from auth trigger.
  - Adds incident audit events for traceability.
*/

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Normalize domain values to what the frontend actually models.
ALTER TABLE public.crowd_zones DROP CONSTRAINT IF EXISTS crowd_zones_status_check;
ALTER TABLE public.crowd_zones
  ADD CONSTRAINT crowd_zones_status_check
  CHECK (status IN ('normal', 'crowded', 'critical', 'closed'));

ALTER TABLE public.emergency_units DROP CONSTRAINT IF EXISTS emergency_units_type_check;
ALTER TABLE public.emergency_units
  ADD CONSTRAINT emergency_units_type_check
  CHECK (type IN ('medical', 'security', 'fire', 'rescue'));

ALTER TABLE public.emergency_units DROP CONSTRAINT IF EXISTS emergency_units_status_check;
ALTER TABLE public.emergency_units
  ADD CONSTRAINT emergency_units_status_check
  CHECK (status IN ('available', 'busy', 'offline'));

ALTER TABLE public.alerts DROP CONSTRAINT IF EXISTS alerts_type_check;
ALTER TABLE public.alerts
  ADD CONSTRAINT alerts_type_check
  CHECK (type IN ('crowd', 'medical', 'security', 'weather', 'system'));

ALTER TABLE public.alerts
  ALTER COLUMN estimated_resolution_time TYPE integer
  USING CASE
    WHEN estimated_resolution_time ~ '^\\d+$' THEN estimated_resolution_time::integer
    ELSE NULL
  END;

-- Safer admin check that does not recursively query users through an RLS policy.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = true
  );
$$;

-- Operations access for sensitive operational data.
CREATE OR REPLACE FUNCTION public.is_operations_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND is_active = true
      AND (role = 'admin' OR department IN ('Security', 'Operations', 'Medical'))
  );
$$;

DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
CREATE POLICY "Admins can read all users"
  ON public.users FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can read RFID devices" ON public.rfid_devices;
CREATE POLICY "Operations can read RFID devices"
  ON public.rfid_devices FOR SELECT TO authenticated
  USING (public.is_operations_user());

DROP POLICY IF EXISTS "Admins can manage RFID devices" ON public.rfid_devices;
CREATE POLICY "Operations can update RFID devices"
  ON public.rfid_devices FOR UPDATE TO authenticated
  USING (public.is_operations_user())
  WITH CHECK (public.is_operations_user());

-- Incident audit trail.
CREATE TABLE IF NOT EXISTS public.incident_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES public.alerts(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  action text NOT NULL CHECK (action IN ('created', 'acknowledged', 'resolved', 'escalated', 'note')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.incident_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Operations can read incident events" ON public.incident_events;
CREATE POLICY "Operations can read incident events"
  ON public.incident_events FOR SELECT TO authenticated
  USING (public.is_operations_user());

DROP POLICY IF EXISTS "Users can write own incident events" ON public.incident_events;
CREATE POLICY "Users can write own incident events"
  ON public.incident_events FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid() AND public.is_operations_user());

CREATE INDEX IF NOT EXISTS idx_incident_events_alert_created
  ON public.incident_events(alert_id, created_at DESC);

-- New auth users are always normal users. Elevation is an admin DB operation.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user',
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
