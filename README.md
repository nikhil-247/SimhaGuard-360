# SimhaGuard 360

**Real-Time Crowd Safety & Emergency Response Platform**

SimhaGuard 360 is a web-based safety dashboard designed for large public gatherings such as **Simhastha 2028**. It brings crowd monitoring, predictive alerts, incident coordination, evacuation support, family tracking, and an AI safety assistant into a single role-based interface.

> **Project status:** Working prototype / research project. Demo data is included for local development. It is not an officially deployed emergency-response system.

## Highlights

- Role-based experiences for admins, volunteers, and users
- Real-time dashboard synchronization with Supabase
- Crowd-density heatmap and location markers
- Predictive crowd-surge alerts
- Incident and alert management workflows
- Evacuation-route visualization
- RFID-based family/wristband tracking interface
- AI safety assistant for context-aware support
- Database health and system monitoring views
- Responsive React + TypeScript frontend

## Architecture

```text
                    +----------------------+
                    |   React + TypeScript  |
                    |   Dashboard / Views   |
                    +----------+-----------+
                               |
                 +-------------+-------------+
                 |                           |
          Local/mock data             Supabase services
                 |                           |
                 |                 +---------+---------+
                 |                 | Auth / Database   |
                 |                 | Realtime / Storage|
                 |                 +---------+---------+
                 |                           |
                 +-------------+-------------+
                               |
                    +----------v-----------+
                    | Safety workflows      |
                    | alerts / maps /       |
                    | tracking / assistant  |
                    +-----------------------+
```

## Core modules

### Crowd monitoring
`CrowdHeatmap` visualizes density information and `PredictiveAlerts` provides a place for ML-driven crowd-risk signals.

### Incident response
`AlertsPanel` and `ControlPanel` support alert review and response coordination, while `LocationMarkers` and `EvacuationRoutes` provide geographic context.

### Family safety
`RFIDTracker` provides a dashboard workflow for locating linked wristbands and supporting family reunification scenarios.

### AI assistance
`AIAssistant` provides a conversational interface for context-aware safety queries.

### Access control
Authentication and protected routes separate user experiences for different roles.

## Tech stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS  
**Backend services:** Supabase  
**State:** React Context API, custom hooks  
**Authentication:** Supabase Auth / protected routes  
**Data:** Mock/local data + Supabase-backed realtime data  
**Tooling:** ESLint, npm

## Project structure

```text
src/
├── components/
│   ├── Auth/
│   ├── Chat/
│   ├── Dashboard/
│   ├── Map/
│   └── Navigation/
├── contexts/
├── data/
├── hooks/
├── lib/
├── types/
└── App.tsx
```

## Getting started

### Requirements

- Node.js 18+
- npm 9+
- Optional Supabase project for realtime/authenticated features

### Install

```bash
git clone https://github.com/nikhil-247/SimhaGuard-360.git
cd SimhaGuard-360
npm install
```

### Configure environment

Copy `.env.example` to `.env` and provide the Supabase URL and anon key when using the hosted backend.

```bash
cp .env.example .env
```

Never commit real credentials. Environment files are excluded by `.gitignore`.

### Run

```bash
npm run dev
```

### Validate

```bash
npm run lint
npm run build
```

## Development notes

The repository is structured so the UI can run with local/mock data while backend-backed features can be enabled through Supabase. This makes the project easy to demonstrate without requiring access to a live event or sensitive operational data.

## Limitations

This project uses simulated/mock event data for development. Real emergency deployment would require validated crowd-sensing pipelines, resilient communications, audited access control, privacy controls, failover, and field testing with relevant authorities.

The predictive-alert interface should therefore be treated as a decision-support prototype, not an autonomous safety system.

## Roadmap

- Add automated test coverage for critical UI flows
- Add typed backend schemas and migration files
- Improve offline/failover behavior
- Connect verified crowd-density data sources
- Add observability and error reporting
- Add role/permission policy tests
- Package the application for production deployment

## License

MIT
