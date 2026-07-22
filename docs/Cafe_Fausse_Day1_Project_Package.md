# Café Fausse: Day 1 Project Package

## Project objective

Build a responsive full-stack restaurant web application using React with JSX, CSS Grid/Flexbox, Flask, PostgreSQL, and RESTful HTTP communication. The required pages are Home, Menu, Reservations, About Us, and Gallery. The application must also include a working newsletter signup, reservation processing, random assignment from 30 tables, persistent database storage, and a gallery lightbox.

## Day 1 decisions

### Brand and interface

**Direction:** Modern Italian fine dining with a warm, elegant, understated appearance.

**Palette:**
- Charcoal: `#171717`
- Warm ivory: `#F7F2E8`
- Burgundy: `#762A36`
- Muted gold: `#B08D57`
- Soft gray: `#6B6B6B`

**Typography:**
- Headings: Georgia, "Times New Roman", serif
- Body: Inter, Arial, Helvetica, sans-serif
- Keep system fallbacks so the site remains usable without external font downloads.

**UX rules:**
- Shared header and footer
- Clear navigation on every page
- Mobile menu below tablet width
- Visible labels and keyboard focus states
- Semantic HTML
- Descriptive image alt text
- Lazy-load non-hero images
- Respect reduced-motion preferences
- Responsive support from 320px upward

### Reservation rules

- Exactly 30 tables, numbered 1 through 30
- 30-minute timeslots
- Monday-Saturday service: 5:00 PM-11:00 PM
- Sunday service: 5:00 PM-9:00 PM
- Last seating is 90 minutes before close:
  - Monday-Saturday: 9:30 PM
  - Sunday: 7:30 PM
- Party size: 1 to 12
- Reservation must be in the future
- Email required and normalized to lowercase
- Phone optional
- Existing customers updated by unique email instead of duplicated
- Random table selected only from currently available tables
- Database constraint: `UNIQUE(time_slot, table_number)`
- Fully booked slot returns HTTP 409 with a friendly message
- Retry a small bounded number of times if a simultaneous booking causes a unique-constraint collision
- Party size is stored, but the SRS does not define table capacities, so it does not affect table-number selection

### Newsletter rules

- Fields: customer name, email, consent checkbox
- Validate email client-side and server-side
- Require consent
- Existing customer: set `newsletter_signup = true`
- New customer: insert record
- Never create duplicate customers for the same email

### Gallery rules

- Include interior, menu dishes, special events, and behind-the-scenes images
- Click opens an enlarged lightbox
- Lightbox closes by close button, Escape key, or backdrop click
- Clicking the image itself does not close it
- Background scrolling is disabled while open

## Exact required content

### Home page

- Address: 1234 Culinary Ave, Suite 100, Washington, DC 20002
- Phone: (202) 555-4567
- Monday-Saturday: 5:00 PM-11:00 PM
- Sunday: 5:00 PM-9:00 PM

### Menu

**Starters**
- Bruschetta — Fresh tomatoes, basil, olive oil, and toasted baguette slices — $8.50
- Caesar Salad — Crisp romaine with homemade Caesar dressing — $9.00

**Main Courses**
- Grilled Salmon — Served with lemon butter sauce and seasonal vegetables — $22.00
- Ribeye Steak — 12 oz prime cut with garlic mashed potatoes — $28.00
- Vegetable Risotto — Creamy Arborio rice with wild mushrooms — $18.00

**Desserts**
- Tiramisu — Classic Italian dessert with mascarpone — $7.50
- Cheesecake — Creamy cheesecake with berry compote — $7.00

**Beverages**
- Red Wine (Glass) — A selection of Italian reds — $10.00
- White Wine (Glass) — Crisp and refreshing — $9.00
- Craft Beer — Local artisan brews — $6.00
- Espresso — Strong and aromatic — $3.00

### About Us

Café Fausse was founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez. It blends traditional Italian flavors with modern culinary innovation. Its mission is to provide an unforgettable dining experience that reflects quality and creativity.

Include founder biographies and commitments to unforgettable dining, excellent food, and locally sourced ingredients.

### Awards

- Culinary Excellence Award — 2022
- Restaurant of the Year — 2023
- Best Fine Dining Experience — Foodie Magazine, 2023

### Reviews

- “Exceptional ambiance and unforgettable flavors.” — Gourmet Review
- “A must-visit restaurant for food enthusiasts.” — The Daily Bite

## Technical architecture

### Frontend

- Vite React app
- React Router
- Shared Header, Footer, Hero, NewsletterForm, ReservationForm, MenuSection, AwardCard, ReviewCard, GalleryGrid, Lightbox, LoadingState, and Alert components
- Static content in data modules
- Central API service module
- CSS organized by shared tokens/components/pages

### Backend

- Flask application factory named `create_app`
- Blueprints for API routes
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-CORS restricted to the configured frontend origin
- PostgreSQL through Psycopg 3
- JSON error handlers
- Validation helpers
- Service layer for newsletter, customer, availability, and booking logic

### Database

**customers**
- customer_id
- customer_name
- email_address
- phone_number
- newsletter_signup
- created_at
- updated_at

**reservations**
- reservation_id
- customer_id
- time_slot
- table_number
- number_of_guests
- created_at

**Constraints**
- Unique customer email
- Table number between 1 and 30
- Guest count between 1 and 12
- Unique `(time_slot, table_number)`
- Foreign key from reservations to customers

### API

- `GET /api/health`
- `POST /api/newsletter`
- `GET /api/availability?time_slot=...`
- `POST /api/reservations`

## Repository structure

```text
cafe-fausse/
├── CLAUDE.md
├── README.md
├── ai-tooling.md
├── staging.md
├── .gitignore
├── docker-compose.yml
├── docs/
│   ├── Cafe_Fausse_SRS.pdf
│   ├── SRS_TRACEABILITY.md
│   ├── TEST_PLAN.md
│   └── DEMO_SCRIPT.md
├── frontend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── assets/images/
│       ├── components/
│       ├── data/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
└── backend/
    ├── .env.example
    ├── requirements.txt
    ├── migrations/
    ├── scripts/
    ├── tests/
    ├── wsgi.py
    └── app/
        ├── __init__.py
        ├── config.py
        ├── extensions.py
        ├── models.py
        ├── errors.py
        ├── validation.py
        ├── api/
        └── services/
```

## Environment files

### `backend/.env.example`

```env
FLASK_APP=wsgi.py
FLASK_DEBUG=1
DATABASE_URL=postgresql+psycopg://cafe_fausse:cafe_fausse@localhost:5432/cafe_fausse
FRONTEND_ORIGIN=http://localhost:5173
```

### `frontend/.env.example`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Never commit real `.env` files.

## Git workflow

- Canonical private repo for active development
- Add all members and `quantic-grader` as collaborators
- Before submission, each member should have a private repo containing the complete final code because the assignment requests a link for each group member
- Branches:
  - `main`
  - `develop`
  - `feature/frontend-static`
  - `feature/backend-api`
  - `feature/integration-qa`

### Suggested ownership

**Member 1:** Home, Menu, About, Gallery, header/footer, lightbox, responsive styling

**Member 2:** PostgreSQL, models, migrations, newsletter, availability, reservations, table assignment, seed scripts

**Member 3:** Forms, API integration, loading/error states, QA, README, AI tooling report, demo preparation

## Functional traceability

| ID | Requirement | Build location | Evidence |
|---|---|---|---|
| FR-1 | Display Café Fausse | Home/Header | Visible page title |
| FR-2 | Address, phone, hours | Home/Footer | Exact details |
| FR-3 | Images/theme | Entire site | Consistent design |
| FR-4 | Navigation | Header | All routes work |
| FR-5 | Exact menu | Menu | Every item and price |
| FR-6 | Reservation form | Reservations | Required fields |
| FR-7 | Validate slot | Frontend/backend | Invalid slot rejected |
| FR-8 | Random table | Backend | Available table 1-30 |
| FR-9 | Messages | Reservations | Success/error paths |
| FR-10 | History | About | Required history |
| FR-11 | Biographies/values | About | Founders and commitments |
| FR-12 | Image categories | Gallery | Four required categories |
| FR-13 | Lightbox | Gallery | Enlarged view |
| FR-14 | Awards/reviews | Gallery | Exact content |
| FR-15 | Newsletter validation | Form | Invalid email blocked |
| FR-16 | Newsletter storage | Database | Customer updated |
| FR-17 | Required tables | PostgreSQL | Schema shown |
| FR-18 | Flask logic | Backend | Booking/full-slot demo |

## Non-functional traceability

| ID | Requirement | Evidence |
|---|---|---|
| NFR-1 | Load within 3 seconds | Browser Network check |
| NFR-2 | Forms within 2 seconds | Manual timing |
| NFR-3 | Intuitive | Shared navigation and clear calls to action |
| NFR-4 | Consistent branding | Shared tokens/components |
| NFR-5 | No overbooking | Unique constraint and 31st-booking test |
| NFR-6 | Friendly failures | JSON errors and frontend alerts |
| NFR-7 | Major browsers | Chrome/Firefox/Safari/Edge checklist |
| NFR-8 | Responsive | Mobile/tablet/desktop checks |
| NFR-9 | Maintainable | Modular structure and documentation |

## Setup commands

```bash
mkdir cafe-fausse
cd cafe-fausse
git init
mkdir docs
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom
cd ..
mkdir backend
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell**

```powershell
.venv\Scripts\Activate.ps1
```

**macOS/Linux**

```bash
source .venv/bin/activate
```

Install backend packages:

```bash
python -m pip install --upgrade pip
pip install Flask Flask-SQLAlchemy Flask-Migrate Flask-Cors python-dotenv "psycopg[binary]" pytest
pip freeze > requirements.txt
cd ..
```

Create PostgreSQL user and database:

```sql
CREATE USER cafe_fausse WITH PASSWORD 'cafe_fausse';
CREATE DATABASE cafe_fausse OWNER cafe_fausse;
```

Initialize Git:

```bash
git checkout -b develop
git add .
git commit -m "chore: initialize Cafe Fausse full-stack project"
```

## Day 1 definition of done

- SRS copied to `docs/Cafe_Fausse_SRS.pdf`
- Repository and branches created
- React starts
- Flask starts
- PostgreSQL is reachable
- `GET /api/health` works
- React can call the Flask health endpoint
- `.env.example` files exist
- `.env` is ignored
- Roles are assigned
- FR/NFR traceability is saved
