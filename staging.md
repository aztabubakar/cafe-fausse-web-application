# Staging

The recorded demo video shows the application running on a local development
machine:

- Frontend: Vite dev server at `http://localhost:5173`
- Backend: Flask dev server at `http://localhost:5000`
- Database: PostgreSQL 16 running locally

See `README.md` for the exact setup and startup commands to run the project
locally.

## Public deployment

The project can also be deployed publicly:

- Frontend: GitHub Pages, built and published by
  `.github/workflows/deploy-pages.yml`
- Backend: Render web service (Flask + gunicorn), provisioned from `render.yaml`
- Database: Render managed PostgreSQL

See the "Deployment" section of `README.md` for the one-time setup steps. Both
free-tier hosts are meant for demonstration purposes, not production traffic.
