/*
  SimhaGuard 360 authorization policy hardening
  - Prevents self-service role escalation.
  - Allows operations staff to resolve alerts without granting arbitrary admin writes.
*/

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users
  WHERE id = auth.uid() AND is_active = true;
$$;

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = public.current_user_role()
  );

DROP POLICY IF EXISTS "Admins can manage all alerts" ON public.alerts;
CREATE POLICY "Admins can manage all alerts"
  ON public.alerts FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Operations can resolve alerts" ON public.alerts;
CREATE POLICY "Operations can resolve alerts"
  ON public.alerts FOR UPDATE TO authenticated
  USING (public.is_operations_user())
  WITH CHECK (
    public.is_operations_user()
    AND is_active = false
  );
