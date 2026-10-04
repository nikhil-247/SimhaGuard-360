/*
  Complete alert type alignment with the frontend domain.
*/
ALTER TABLE public.alerts DROP CONSTRAINT IF EXISTS alerts_type_check;
ALTER TABLE public.alerts
  ADD CONSTRAINT alerts_type_check
  CHECK (type IN (
    'crowd',
    'medical',
    'security',
    'weather',
    'system',
    'fire',
    'flood',
    'lost_person'
  ));
