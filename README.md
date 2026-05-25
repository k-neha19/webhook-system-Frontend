# WebhookHub — Frontend

A modern React.js dashboard for managing webhook subscriptions and monitoring real-time events.

## Features

- **Authentication** — Sign up, login with JWT persistence
- **Protected Routes** — Automatic redirect for unauthenticated users
- **Webhook Dashboard** — Create, list, view, and cancel subscriptions
- **Real-time Event Stream** — Socket.IO powered live event feed
- **Event History** — Filterable event log with status indicators
- **Retry Failed Events** — One-click retry from the UI
- **Webhook Detail View** — Per-webhook event history and signing secret
- **Toast Notifications** — Success/error feedback for all actions
- **Responsive Design** — Works on desktop and mobile
- **Dark Theme** — Professional dark UI with Tailwind CSS

## Technologies

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router v6
- Axios (HTTP client)
- Socket.IO Client (real-time)
- react-hot-toast (notifications)
- date-fns (date formatting)
- lucide-react (icons)

## Project Structure

```
frontend/
├── src/
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Router setup, protected routes
│   ├── index.css                 # Tailwind + design system
│   ├── types/index.ts            # TypeScript interfaces
│   ├── services/
│   │   └── api.ts                # Axios instance + all API calls
│   ├── hooks/
│   │   ├── useAuth.tsx           # Auth context + hook
│   │   └── useSocket.ts          # Socket.IO real-time hook
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx     # Main dashboard
│   │   └── WebhookDetailPage.tsx
│   └── components/
│       ├── layout/Layout.tsx     # Navbar + page wrapper
│       ├── ui/StatusBadge.tsx    # Reusable status badge
│       ├── webhooks/
│       │   ├── WebhookCard.tsx
│       │   └── CreateWebhookModal.tsx
│       └── events/
│           ├── EventRow.tsx      # Expandable event row
│           └── LiveEventLog.tsx  # Real-time event stream
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── Dockerfile
├── nginx.conf
└── .env.example
```

## Installation

### Prerequisites

- Node.js 18+
- Backend server running on port 3000

### Steps

```bash
# 1. Enter frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Copy and configure environment
cp .env.example .env
# Edit .env if backend is not at http://localhost:3000

# 4. Start development server
npm run dev
```

App will be available at: `http://localhost:5173`

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |
| `VITE_SOCKET_URL` | Socket.IO server URL | `http://localhost:3000` |

## Build for Production

```bash
npm run build
# Output in ./dist
```

## Docker

```bash
# Build image
docker build -t webhook-frontend .

# Run container
docker run -p 5173:80 webhook-frontend
```

## Usage Guide

### 1. Register / Login
Navigate to `/register` to create an account, or `/login` with:
- **Email:** demo@example.com
- **Password:** password123

### 2. Create a Webhook Subscription
Click **"New Webhook"** and fill in:
- **Source URL** — where events come from (e.g. `https://github.com`)
- **Callback URL** — where to forward events (e.g. `https://myapp.com/cb`)
- **Event Type** — select from presets or enter custom

### 3. Send Test Events
Use the simulator:
```bash
cd simulator
npm install
node simulator.js <YOUR_WEBHOOK_ID> 10
```

### 4. Watch the Live Feed
Events appear in the **Live Event Stream** panel in real-time via Socket.IO.

### 5. View Event Details
Click any event row to expand and see the full payload.

### 6. Retry Failed Events
Failed events show a retry button (↻). Click to re-attempt delivery.

