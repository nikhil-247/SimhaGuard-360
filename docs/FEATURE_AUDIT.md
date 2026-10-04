# SimhaGuard 360 — Feature Audit

This audit distinguishes implemented behavior from presentation/demo scaffolding. It is based on repository code inspection rather than the UI labels alone.

## Functional core

| Feature | Status | Evidence in code | Honest claim |
|---|---|---|---|
| Supabase authentication | Functional | Supabase Auth in AuthContext; protected route | “Supabase-authenticated role-based dashboard” |
| Live crowd-zone reads + realtime updates | Functional | useSupabaseData + Postgres change subscription | “Realtime crowd-zone data from Supabase” |
| Incident create + resolve | Functional | addAlert / resolveAlert write to alerts | “Incident lifecycle workflow” |
| Incident audit events | Functional after migration | incident_events table + create/resolve writes | “Auditable incident actions” |
| RFID operational tracking | Functional | rfid_devices reads + tracker UI | “Operations RFID tracking workflow” |
| RFID distress → incident | Functional after upgrade | markRFIDDistress updates device + creates alert | “Distress-to-incident workflow” |
| Operational risk signals | Functional | PredictiveAlerts derives scores from live crowd/incident/RFID/freshness data | “Transparent rule-based risk signals” |

## Prototype / simulation surface

| Feature | Status | What is actually present | Correct claim |
|---|---|---|---|
| Map | Prototype | SVG event geometry + live DB overlays | “Operational map prototype with live data overlays” |
| Evacuation routes | Prototype | Predefined mock route paths | “Route visualization prototype” |
| Emergency action panel | Partial | Creates operator alert records; does not dispatch external systems | “Incident-generation controls” |
| Safety assistant | Prototype | Rule-based responses over live Supabase snapshot; no LLM | “Live-data safety playbook assistant” |
| Weather intelligence | Not implemented | Old code contained hardcoded weather values; removed from core claims | “Integration point only” |
| Predictive ML | Not implemented | Old predictions were hardcoded; replaced by transparent rules | Do not claim ML prediction |

## Removed / corrected claims

The following values were previously hardcoded or simulated and should not be presented as production telemetry:

- 2.85M total pilgrims
- 125K current pilgrims
- 12 active database connections
- 95% query performance
- 68% storage usage
- 94.2% cache hit ratio
- 98.7% index usage
- fixed medical staffing numbers
- fixed weather conditions
- canned “AI engine active” language

## Security / data-model fixes

- RLS added for sensitive RFID access.
- New users are forced to normal-user role in the auth trigger.
- Self-service profile updates cannot change role.
- Operations and admin boundaries are separated through helper functions.
- Incident actions are recorded in an audit table.
- Database status values and frontend domain values are normalized.
- Stored latitude/longitude values are converted into the current map coordinate system.
- Realtime subscription cleanup is explicit.

## Current resume-safe project description

> Built a React/TypeScript + Supabase crowd-safety operations dashboard with realtime crowd-zone monitoring, auditable incident lifecycle management, RFID distress-to-alert workflow, role-aware access control, and transparent rule-based operational risk signals; hardened sensitive data with Row Level Security and incident audit logging.
