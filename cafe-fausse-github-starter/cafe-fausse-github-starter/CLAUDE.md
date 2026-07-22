# Café Fausse Project Instructions

Before creating or modifying code, read these files completely:

1. `docs/Cafe_Fausse_SRS.pdf`
2. `docs/Cafe_Fausse_Project_Brief.pdf`
3. `docs/Cafe_Fausse_Day1_Project_Package.md`
4. `docs/Cafe_Fausse_Claude_Code_Master_Prompt.md`

The SRS is the source of truth. Do not remove or weaken any functional or non-functional requirement without explicit approval.

## Mandatory stack

- React with JSX for the frontend
- CSS Grid and/or Flexbox for responsive styling
- Flask for the backend
- PostgreSQL for persistent storage
- RESTful API communication

Do not replace PostgreSQL with SQLite.

## Working rules

- Inspect the repository before editing.
- Present a concise plan before making large changes.
- Build in phases: foundation, static pages, database/backend, integration, testing, documentation.
- Preserve exact restaurant details, menu items, prices, awards, reviews, and hours from the SRS.
- Implement all five required pages and an accessible gallery lightbox.
- Implement a real newsletter signup stored in PostgreSQL.
- Implement a real reservation system with 30 tables, availability checks, random assignment from available tables, and prevention of double or overbooking.
- Keep secrets out of Git. Use `.env.example` files.
- Run tests, linting, and production builds before reporting completion.
- Keep the code modular, readable, and documented.
- Maintain a requirement traceability checklist for FR-1 through FR-18 and NFR-1 through NFR-9.
