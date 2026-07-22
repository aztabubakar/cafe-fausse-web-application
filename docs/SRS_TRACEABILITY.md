# SRS Requirement Traceability

Status as of the static-frontend phase. No PostgreSQL/Flask work has been done yet, so no
requirement that depends on real persistence or server-side logic is marked complete.

## Functional Requirements

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| FR-1 | Display Café Fausse's name prominently | **Implemented** | `Header.jsx` wordmark; `Home.jsx` hero `<h1>` |
| FR-2 | Show address, phone, hours | **Implemented** | `data/contact.js`, rendered in `Home.jsx` and `Footer.jsx` |
| FR-3 | High-quality images, consistent theme | **Implemented** | `data/images.js` manifest; `styles/tokens.css` design system |
| FR-4 | Navigation to Menu, Reservations, About Us, Gallery | **Implemented** | `data/navigation.js`, `Header.jsx`, `Footer.jsx` |
| FR-5 | Exact menu content, categories, prices | **Implemented** | `data/menu.js`; `Menu.jsx` |
| FR-6 | Reservation form (time slot, guests, name, email, phone) | **Interface implemented, backend pending** | `ReservationForm.jsx` — full client-side form and validation; no server persists the reservation yet |
| FR-7 | Validate time slot is available and valid | **Partially implemented (frontend only)** | `ReservationForm.jsx` builds valid Mon–Sat / Sunday slot options and blocks past dates client-side; real availability checking requires the backend (pending) |
| FR-8 | Backend assigns a random table from 30 | **Pending backend** | Not started — requires Flask + PostgreSQL |
| FR-9 | Success/error messaging for booking | **Interface implemented, backend pending** | `aria-live` status region shows a neutral "ready for backend connection" message; no fabricated success/failure until the backend responds |
| FR-10 | Detailed history of Café Fausse | **Implemented** | `data/founders.js` (`history`), `About.jsx` |
| FR-11 | Founder biographies, commitments | **Implemented** | `data/founders.js` (`founders`, `commitments`), `About.jsx` |
| FR-12 | Gallery images: interior, dishes, events, behind-the-scenes | **Implemented** | `data/images.js` (`galleryImages`), `Gallery.jsx` with category filters |
| FR-13 | Lightbox for enlarged image viewing | **Implemented** | `Lightbox.jsx` — focus management, Escape/backdrop close, prev/next, keyboard arrows |
| FR-14 | Awards and reviews, exact content | **Implemented** | `data/awards.js`, `data/reviews.js`, rendered on `Home.jsx` and `Gallery.jsx` |
| FR-15 | Newsletter signup with email validation | **Interface implemented, backend pending** | `NewsletterForm.jsx` — client-side validation and consent requirement; no server persists the signup yet |
| FR-16 | Newsletter emails stored in backend database | **Pending backend** | Not started — requires Flask + PostgreSQL |
| FR-17 | PostgreSQL Customers/Reservations tables | **Pending backend** | Not started |
| FR-18 | Flask logic for insert/availability/assignment/response | **Pending backend** | Not started; `services/api.js` defines the client-side call signatures (`checkAvailability`, `createReservation`, `subscribeToNewsletter`, `checkHealth`) the backend will implement against |

## Non-Functional Requirements

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| NFR-1 | Load within 3 seconds on broadband | **Supported** | Production build produces small gzip bundles (~83KB JS, ~3KB CSS); images capped at 1920px/quality 78 (~3.6MB total vs. ~130MB of originals) |
| NFR-2 | Form submissions processed within 2 seconds | **Not yet measurable** | No real network round-trip exists yet; will be verified once the backend is live |
| NFR-3 | Intuitive, easy-to-navigate interface | **Implemented** | Shared header/footer nav, active-page styling, clear CTAs |
| NFR-4 | Consistent, appealing branding | **Implemented** | `styles/tokens.css` design tokens applied site-wide |
| NFR-5 | Prevent double/overbooking | **Pending backend** | Requires the PostgreSQL unique constraint and booking transaction logic |
| NFR-6 | User-friendly failure handling | **Partially implemented** | Client-side validation messages exist; server error handling pending backend |
| NFR-7 | Major browser compatibility | **Not yet verified** | Manual cross-browser checklist still needed |
| NFR-8 | Responsive design (desktop/tablet/mobile) | **Implemented and verified** | Automated checks confirm no horizontal scroll at 320/375/768/1024/1440px |
| NFR-9 | Modular, maintainable, documented code | **Implemented** | Component-per-concern structure, centralized data modules, this document |

## Notes

- Nothing above is marked complete based on assumed or simulated database behavior. Any
  requirement involving persistence, availability checks, or table assignment stays
  "pending backend" until Flask and PostgreSQL exist and are wired up.
- The next phase's job is to turn every "Interface implemented, backend pending" and
  "Pending backend" row into "Implemented."
