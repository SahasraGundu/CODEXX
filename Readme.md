Live demo: https://codexx-alpha.vercel.app/

Overview

CodeX is a full-stack collaborative development platform. Teams authenticate with a shared team name, work on shared projects in a live code editor, chat in real time, jump into audio/video calls, and request AI code reviews on demand — all synced instantly across members via Socket.IO.

Frontend: React 19, Redux Toolkit, Tailwind CSS 4, Monaco Editor, Vite Backend: Node.js, Express, MongoDB (Mongoose), Socket.IO AI: Groq (LLaMA 3.3 70B) for automated code review Real-time voice/video: WebRTC with configurable STUN/TURN servers

Features
Team-based auth — no email signup; users join or create a team with a shared team name and per-member username, secured with JWT.
Live collaborative editor — Monaco-powered code editor with real-time sync across all team members in a project.
AI code review — one-click review of project code using Groq's LLaMA 3.3 70B, returned as a structured breakdown (behavior, issues, suggestions, improved snippet).
Team chat — persisted, project-scoped messaging with unread tracking.
Audio/video calls — WebRTC signaling over Socket.IO, with STUN/TURN configuration for NAT traversal.
Project management — create, list, update, and revisit projects, all scoped to your team.
Project Structure
CodeX/
├── Backend/                 # Express + MongoDB + Socket.IO API server
│   ├── server.js            # Entry point — HTTP server + Socket.IO setup
│   └── src/
│       ├── app.js           # Express app, middleware, route mounting
│       ├── config/          # Environment configuration
│       ├── controllers/     # Route handlers (auth, project, message)
│       ├── db/               # MongoDB connection
│       ├── middlewares/     # JWT auth middleware
│       ├── models/          # Mongoose schemas (Team, Project, Message)
│       ├── routes/          # /api/auth, /api/projects, /api/messages, /api/webrtc
│       ├── services/        # Business logic (auth, project, AI review, calls)
│       └── tests/           # Jest test suites
├── Frontend/                 # React + Vite client
│   └── src/
│       ├── api/              # Axios API clients
│       ├── components/       # Reusable UI, layout, and page components
│       ├── context/           # Theme context
│       ├── store/             # Redux Toolkit store and slices
│       ├── views/             # Route-level pages (auth, dashboard, project workspace)
│       └── webrtc/            # Call manager, media, and peer connection logic
├── tests/                    # End-to-end (Playwright) and load tests
└── public/                   # Screenshots and static assets
Getting Started
Prerequisites
Node.js ≥ 18
MongoDB (local instance or Atlas)
A Groq API key for AI code review
1. Clone and install
bash
git clone <repo-url>
cd CodeX

cd Backend && npm install
cd ../Frontend && npm install
2. Configure environment variables

Backend/.env

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codex
JWT_SECRET=your-super-secret-jwt-key
GROQ_API_KEY=your-groq-api-key
FRONTEND_URLS=http://localhost:5173

# Optional — WebRTC TURN server for calls behind restrictive NATs
TURN_URLS=
TURN_USERNAME=
TURN_CREDENTIAL=
STUN_URLS=stun:stun.l.google.com:19302

Frontend/.env

env
VITE_BACKEND_URL=http://localhost:5000
3. Run
bash
# Terminal 1 — backend
cd Backend
npm run dev          # nodemon, auto-restart

# Terminal 2 — frontend
cd Frontend
npm run dev           # Vite dev server

The backend runs on http://localhost:5000 (health check at GET /), and the frontend on http://localhost:5173.

API Overview

All REST responses follow { success, message, data }. Protected routes require a JWT in the Authorization header.

Area	Routes
Auth	POST /api/auth/register, POST /api/auth/login, GET /api/auth/verify, POST /api/auth/logout, team member endpoints
Projects	POST /api/projects/create, GET /api/projects/get-all, GET /api/projects/:id, PUT /api/projects/:id, POST /api/projects/:id/review
Messages	GET /api/messages/project/:projectId, GET /api/messages/project/:projectId/unread
WebRTC	GET /api/webrtc/turn — returns ICE server configuration

Real-time events (Socket.IO): chat-message, join-project, code-change, call-user, incoming-call, call-accepted, call-rejected, ice-candidate, end-call.

A Postman collection is included at Backend/codex.postman_collection.json.

Testing
bash
# Backend (Jest)
cd Backend && npm test

# Frontend (Vitest)
cd Frontend && npm test

# End-to-end (Playwright)
npx playwright test
Deployment
Frontend: configured for Vercel (Frontend/vercel.json).
Backend: any Node host (Render, Railway, etc.) with a MongoDB Atlas connection string. For multi-instance scaling, add the Socket.IO Redis adapter.
Set FRONTEND_URLS on the backend and VITE_BACKEND_URL on the frontend to match your deployed URLs, and use HTTPS/WSS in production.
