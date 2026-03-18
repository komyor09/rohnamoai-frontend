# Rohnamo AI — Frontend

Angular 20 frontend for the Rohnamo AI university admission guidance system.

## Quick Start

```bash
npm install
npm run dev        # alias for: ng serve
# App runs at http://localhost:4200
```

## Backend

Start the GuideRAI backend (FastAPI) at `http://localhost:8000`:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The frontend sends `X-User-UUID` header on every request for anonymous user identification.
UUIDs are auto-generated and persisted in `localStorage`.

## Project Structure

```
src/
  app/
    core/
      models/       — TypeScript interfaces matching backend models
      services/
        api-client.service.ts     — Base HTTP client
        scenarios.service.ts      — POST/GET /scenarios
        search.service.ts         — GET /search/
        meta.service.ts           — GET /meta/regions|districts|localities
        ai.service.ts             — POST /ai/explain, /ai/dialog, /ai/scenario/:id/explain
        analytics.service.ts      — GET /analytics/overview
        user-identity.service.ts  — UUID generation + localStorage
      interceptors/
        user-uuid.interceptor.ts  — Injects X-User-UUID into every request
    pages/
      home/                       — Dashboard
      scenarios/                  — Scenario list
      new-scenario/               — Create scenario (3-step wizard)
      scenario-edit/              — Edit scenario params + trigger search
      scenario-results/           — View search results + AI explanation
      specialty-details/          — Single specialty deep-dive
      comparison-scenarios/       — Side-by-side scenario comparison
      profile/                    — User profile + UUID management
      pricing/                    — Plan tiers
      support/                    — Contact form + FAQ
    layout/                       — AppLayout, Sidebar, Topbar, Menu
```

## API Endpoints Used

| Service | Endpoint |
|---------|----------|
| List scenarios | `GET /scenarios` |
| Create scenario | `POST /scenarios` |
| Get scenario | `GET /scenarios/:id` |
| Delete scenario | `DELETE /scenarios/:id` |
| Save step | `POST /scenarios/:id/step` |
| Complete scenario | `POST /scenarios/:id/complete` |
| Search | `GET /search/` |
| Regions | `GET /meta/regions` |
| Districts | `GET /meta/districts?region_id=` |
| Localities | `GET /meta/localities?district_id=` |
| AI Explain | `POST /ai/explain` |
| AI Dialog | `POST /ai/dialog` |
| AI Scenario Explain | `GET /ai/scenario/:id/explain` |
| Analytics | `GET /analytics/overview` |

## Auth

No JWT. Every request carries `X-User-UUID` header.  
The backend auto-creates a user record on first request.
