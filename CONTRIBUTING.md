# Contributing to Charity Portal

Thank you for your interest in contributing!

## Local Setup

### Prerequisites
- Node.js 20+
- MongoDB (local) or a MongoDB Atlas connection string

### 1. Clone and install

```bash
git clone https://github.com/<your-org>/Charity-Portal.git
cd Charity-Portal

# Backend
cd backend
cp .env.example .env   # fill in your values
npm install

# Frontend
cd ../frontend-v2
cp .env.example .env   # fill in your values
npm install
```

### 2. Run locally

```bash
# Terminal 1 — backend (http://localhost:3000)
cd backend && npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend-v2 && npm run dev
```

### 3. API docs

With the backend running, visit **http://localhost:3000/api/docs** for the interactive Swagger UI.

## Running Tests

```bash
cd backend && npm test            # Jest — all tests
cd backend && npm run test:coverage  # with coverage report
```

## Code Conventions

- **Backend**: CommonJS (`require`/`module.exports`), Express, Mongoose
- **Frontend**: ES Modules, React 19, MUI v5 — see `frontend-v2/CLAUDE.md`
- **API responses**: always `{ status, data, message? }` — use `sendSuccess`/`sendFail`/`sendError` from `backend/utils/apiResponse.js`
- **Auth**: all mutation routes must be protected with `authController.protect` + `authController.restrict()`
- No raw `console.log` in production code

## Submitting a PR

1. Create a branch from `main`
2. Make your changes and add tests where applicable
3. Ensure `npm test` passes in `backend/` and `npm run build` passes in `frontend-v2/`
4. Open a PR — the template will guide you through the checklist
