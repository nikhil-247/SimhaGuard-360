SimhaGuard 360 is a real-time, web-based safety dashboard designed to protect pilgrims and ensure rapid emergency response during large-scale religious events. Built with React, TypeScript, Supabase, Vite, and Tailwind, it seamlessly integrates live crowd analytics, predictive alerts, medical coordination, and family tracking in an interactive interface.

Key Features
Role-based Authentication: Secure login system for admins, volunteers, and pilgrims (AuthContext, LoginForm, ProtectedRoute).

Live Dashboard:

AdminPanel/UserDashboard: Customized views for authorities and regular users.

PredictiveAlerts: ML-driven warnings and crowd surge forecasting.

AlertsPanel & ControlPanel: Real-time incident management.

DatabaseMonitor: Backend data health and diagnostics.

Crowd & Route Mapping:

CrowdHeatmap: Live density visualization over Ujjain map.

EvacuationRoutes & LocationMarkers: Smart route suggestions and critical points.

Family Tracking:

RFIDTracker: Locate and monitor linked wristbands for safety.

AI Safety Assistant:

Chat/AIAssistant: Context-aware queries and support.

Modular Navigation:

Responsive header/sidebar, optimized for mobile and desktop.

Stack
Frontend: React + TypeScript, Vite for fast builds

UI: Tailwind CSS

State/Context: Context API, custom hooks

Backend/SaaS: Supabase for real-time data, authentication, and storage

useSupabaseData and useRealTimeData hooks power live dashboards.

Data: Modular mock/data layer for local development and testing

Deployment: Vite config for smooth dev/prod transitions

Getting Started
Clone repo & install dependencies:

bash
git clone https://github.com/yourusername/simhaguard360.git
npm install
Set up Supabase — create a .env using .env.example.
Get your Supabase API keys and database URL.

Run locally:

bash
npm run dev
Open your browser at http://localhost:5173

Screenshots
Admin and user dashboards, live crowd heatmap, predictive alert panel, RFID tracking interface, evacuation routes, and conversational AI safety assistant.

Project Structure
components/ Core UI panels & logic

data/ Local mock data providers

hooks/ Real-time and Supabase integration

lib/ Supabase setup & service functions

types/ Shared TypeScript interfaces

supabase/ Env keys and cloud config

Why SimhaGuard?
What makes this project unique is its real use of Supabase for live event data, robust crowd safety modeling, and actual modular TypeScript code optimized for speed and reliability. It's not a mock-up—it's engineered for scalable, real-world deployment.

Contributing
We welcome PRs on dashboard modules, data integrations, UI/UX, and simulation tools. See our issues board for open tasks!

License
MIT

Join us in creating safer, smarter mass gatherings for everyone.
