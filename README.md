# SimhaGuard 360

**Operational Crowd-Safety Dashboard for Large Public Events**

SimhaGuard 360 is a React/TypeScript + Supabase operations prototype focused on authenticated access, realtime operational state, incident lifecycle, RFID distress handling, and transparent risk signals.

> **Status:** working engineering prototype. It is not an officially deployed emergency-response system. The map geometry and some response integrations remain simulation/extension points.

## What is actually implemented

- Supabase Auth with protected routes
- Role-aware admin and user experiences
- Realtime subscriptions for crowd zones, emergency units, RFID records and alerts
- Live crowd occupancy calculation from stored zone data
- Incident creation and resolution persisted to Supabase
- Incident audit events for create/resolve actions
- RFID tracking workflow with restricted operations access
- RFID distress flag that creates a linked high-priority incident
- Operational risk signals derived from live data: crowd occupancy, active incident load, RFID distress and data freshness
- Measured response-time metric from incident timestamps
- Data-health view based on actual loaded records and freshness
- Normalized event-map geometry with live operational overlays

## What is intentionally not claimed

The previous version contained several demo-style labels and hardcoded values. Those claims have been removed or renamed:

- No fabricated database CPU/storage/cache numbers
- No hardcoded weather feed
- No AI probability claim
- No autonomous evacuation or responder dispatch
- No claim that the SVG map is production GIS
- No claim of real-world RFID hardware connectivity
- No claim that mock evacuation routes are live routes

The full audit is documented in `docs/FEATURE_AUDIT.md`.

## Architecture

```text
                         +----------------------+
                         | React + TypeScript   |
                         | Protected Dashboard  |
                         +----------+-----------+
                                    |
                             Supabase client
                                    |
          +-------------------------+--------------------------+
          |                         |                          |
          v                         v                          v
     Supabase Auth             Postgres + RLS             Realtime
          |                         |                          |
          |                  +------+-------+          +-------+-------+
          |                  | zones        |          | zone changes |
          |                  | units        |          | alert changes|
          |                  | RFID         |          | RFID changes |
          |                  | alerts       |          +---------------+
          |                  | audit events |
          |                  +------+-------+
          |                         |
          +-------------+-----------+
                        v
              +----------------------+
              | Operations workflows |
              | crowd / incidents /  |
              | RFID / risk signals  |
              +----------------------+
```

## Engineering highlights

### 1. Realtime operational state

The data hook loads operational tables in parallel and subscribes to Postgres change events. Updates are normalized into the frontend domain model and subscriptions are explicitly cleaned up on unmount.

### 2. Incident lifecycle

Operators can create and resolve incidents. Every create/resolve operation also writes an `incident_events` audit record with actor, action, payload and timestamp.

### 3. RFID distress workflow

RFID records are treated as sensitive operational data. Row Level Security restricts access to operations roles. Marking a device distressed updates the record and creates a corresponding incident so the state change is traceable.

### 4. Transparent risk signals

The former “Predictive Alerts” module was replaced with a transparent rule engine. It does not pretend to be an ML model. Signals are derived from measurable system state and show the control basis and recommended operator actions.

### 5. Data health

The database-monitoring view no longer reports fictional connection-pool, cache or storage metrics. It reports records loaded, active incidents, RFID distress, stale crowd zones, refresh time and access boundaries.

## Security design

The Supabase migration layer includes:

- Row Level Security on operational tables
- admin and operations helper functions
- protection against client-side role escalation
- restricted RFID read/update policies
- audited incident changes
- explicit created_by, resolved_by and timestamps

Before any field deployment, policies should be validated against the exact Supabase project and real organizational roles.

## Tech stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS  
**Backend/data:** Supabase Auth, PostgreSQL, Realtime  
**State:** React Context + custom hooks  
**Testing/build:** ESLint, Vite build, GitHub Actions

## Getting started

### Requirements

- Node.js 18+
- npm 9+
- Supabase project for authenticated/realtime operation

### Install

```bash
git clone https://github.com/nikhil-247/SimhaGuard-360.git
cd SimhaGuard-360
npm install
```

### Environment

Copy `.env.example` to `.env` and provide only the public Supabase URL and anon key:

```bash
cp .env.example .env
```

Never commit real credentials.

### Run

```bash
npm run dev
```

### Validate

```bash
npm run lint
npm run build
```

## Demo workflow

1. Sign in with a valid Supabase account.
2. Open the operations dashboard.
3. Review realtime crowd zones and active incidents.
4. Open RFID tracking as an authorized operations user.
5. Mark a test RFID device distressed.
6. Confirm the device state and linked incident update.
7. Resolve the incident and inspect the response-time calculation.
8. Open Operational Risk Signals and review the transparent control basis.
9. Open Data Health to inspect actual record counts and freshness.

## Known extension points

- verified GIS/map tiles and geospatial coordinates
- real crowd-sensing ingestion
- tested weather and disaster data sources
- responder dispatch integrations
- offline/failover communications
- push/SMS/PA broadcast integrations
- formal permission matrices for operations, medical, security and admin roles
- observability, error tracking and audit retention
- automated component and end-to-end tests

## Resume-safe description

> Built a React/TypeScript + Supabase crowd-safety operations dashboard with realtime crowd monitoring, auditable incident lifecycle management, RFID distress-to-alert workflow, role-aware access control and transparent rule-based operational risk signals; hardened sensitive operational data with Row Level Security and incident audit logging.