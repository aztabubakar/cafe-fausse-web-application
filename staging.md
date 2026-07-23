# Staging

The application is deployed publicly and can also be run locally. Either
environment is suitable for the recorded demo.

## Public deployment (GitHub Pages + Render)

| Component | Host | URL |
|---|---|---|
| Frontend | GitHub Pages | https://aztabubakar.github.io/cafe-fausse-web-application/ |
| Backend API | Render (Flask + gunicorn) | https://cafe-fausse-backend-ohoq.onrender.com/api |
| Database | Render managed PostgreSQL | internal — not publicly reachable |

**How it's built and published:**

- **Frontend**: `.github/workflows/deploy-pages.yml` builds the Vite app on every
  push to `main` (`VITE_API_BASE_URL` is injected from a repository Actions
  variable pointing at the Render backend) and publishes the build to GitHub
  Pages. Pages is configured with **Source: GitHub Actions** in the repo's
  Settings, not "Deploy from a branch."
- **Backend + database**: `render.yaml` is a Render Blueprint that provisions
  the `cafe-fausse-backend` web service (runs `flask db upgrade && gunicorn
  wsgi:app`) and the `cafe-fausse-db` managed PostgreSQL instance together, wired
  via the `DATABASE_URL` environment variable.
- CORS on the backend is locked to the GitHub Pages origin via `FRONTEND_ORIGIN`.

**Known limitations of the free tiers** (fine for a coursework demo, not for
production use):

- The Render web service spins down after inactivity; the first request after
  idle can take 10–30 seconds to respond. Hit `/api/health` once before
  recording a demo to wake it up ahead of time.
- Render's free PostgreSQL plan expires after a limited period — check Render's
  current terms if this needs to stay live long-term.

See the "Deployment" section of `README.md` for the full one-time setup steps
(Render Blueprint sync, GitHub Pages source, repository variables).

## Local development

- Frontend: Vite dev server at `http://localhost:5173`
- Backend: Flask dev server at `http://localhost:5000`
- Database: PostgreSQL 16 running locally

See `README.md` for the exact setup and startup commands to run the project
locally.
