# OMI Jaffna — Tailwind CMS Dashboard + Node.js + PostgreSQL

A runnable **full-stack starter** for the Oblate Province of Jaffna website, built from `OMI_Jaffna_Click_By_Click_Visual_Prototype_2026.docx` (94-page website blueprint). This project provides an admin CMS and a **minimal public-side preview/API**, not the fully designed 59-screen public website.

## Tech stack

- **Admin frontend:** React 18, Vite 6, Tailwind CSS 3, Lucide icons, responsive layouts
- **Server:** Node.js 20+, Express 4, REST endpoints, secure HttpOnly JWT cookie authentication
- **Database:** PostgreSQL 16, prepared/parameterized SQL via `pg`, `pgcrypto` UUID IDs
- **Local file uploads:** private-by-default JPEG / PNG / WebP / PDF assets, maximum 12 MB
- **Deployment:** optional `docker compose` setup for PostgreSQL + API + built web app

## What is implemented

| Dashboard area | What works |
|---|---|
| Overview | Live stats, publication pipeline, recent records and collection links |
| 13 content categories | Search, filter, page, create/edit/delete, drafts, review, publish |
| Ministries | 17 documented ministry names, descriptions, locations seeded as drafts |
| Parishes | 12 documented parish names and locations seeded as drafts |
| Pages | 17 starter site pages seeded from blueprint |
| Locations / timeline | 31 source locations and 10 timeline milestones seeded as drafts |
| Formation / international / publications | Source-derived draft entries |
| Multilingual editing | English, Tamil and Sinhala fields with fallback in public API |
| Contacts | Restricted master directory; explicit publication approval; last-verified field |
| Enquiries | Public submission with consent, private admin inbox, status management |
| Media uploads | File signature checks; draft uploads; published only after rights confirmation and alt text |
| Team management | Admin can create and manage staff and Father accounts; Fathers can update their own profile |
| Settings | Basic Province contact and identity configuration |
| Public preview | Responsive `/site` view of published content, Father sign-in/registration and personal profiles |
| Visual demo | Read-only `/demo` using source-derived data, no database connection required |

**Not included in this starter:** geocoded interactive maps, calendar visualization, YouTube/podcast playback, rich-text editor, fully linked 59 public click-through screens, automatic translations, email sending for enquiries, outbound notifications, external social integrations, payment/donations, analytics, backups, 2FA, or a production hosting environment. These should be built/tested separately before launch.

## One-time setup (local development)

### 1. Prerequisites

Install **Node.js 20+**, **npm**, and either **Docker Desktop** or **PostgreSQL 16**.

### 2. Configure environment

From the root of this project:

```bash
cp .env.example .env
cp api/.env.example api/.env
```

Change ALL placeholder values, particularly `POSTGRES_PASSWORD`, `JWT_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `api/.env`. Use a random `JWT_SECRET` of at least 32 characters and an admin password of at least 12 characters.

### 3A. Run everything with Docker

Ensure `api/.env` is filled and root `.env` contains the matching database password.

```bash
docker compose up -d --build
docker compose exec api node scripts/migrate.js
docker compose exec api node scripts/seed.js
```

Browse:
- Public website: **http://localhost:5173/**
- Admin CMS login: **http://localhost:5173/admin**
- Visual read-only demo: **http://localhost:5173/demo**
- API health: **http://localhost:4000/api/health**

**Security:** Ports bind to `127.0.0.1` in the supplied compose file, suitable for local work, not public deployment. Use HTTPS and a managed reverse proxy for production.

### 3B. Run Node services separately

Start PostgreSQL with `docker compose up -d db` (or use an already installed PostgreSQL server) and point `api/.env` `DATABASE_URL` to it. Then:

```bash
cd api
npm install
npm run migrate
npm run seed
npm run dev
```

In another terminal:

```bash
cd web
npm install
npm run dev
```

Vite forwards `/api/*` to `http://localhost:4000`. The browser stores the JWT only in an HttpOnly cookie. **No hardcoded login credentials are included.** The first `seed` creates the administrator from environment variables if no users exist.

### 4. Build frontend for deployment

```bash
cd web
npm run build
```

The output is in `web/dist`. With Docker, the `web` image uses Nginx to serve this build and reverse proxy `/api/` to Express. Set `NODE_ENV=production`, `COOKIE_SECURE=true`, a suitable `FRONTEND_ORIGIN`, HTTPS, a proper backup strategy and stronger institutional security controls before exposing it publicly.

## API overview

**Authentication**: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.

**Authenticated CMS**: `GET /api/dashboard`, `GET|POST /api/items`, `PUT|DELETE /api/items/:id`, `GET|POST /api/contacts`, `PUT /api/contacts/:id`, `GET /api/inquiries`, `PATCH /api/inquiries/:id`, `GET|POST /api/assets`, `PATCH /api/assets/:id`, `GET|PUT /api/settings/:key`, `GET|POST /api/users`.

**Public read-only resources**: `GET /api/public/items?type=ministry&lang=en`, `GET /api/public/contacts`, `POST /api/public/inquiries`, `GET /api/files/:asset-id` (only public assets are accessible without login).

**Roles:** `father` signs in on the public site with Father ID and password and can update only their own profile. Admin/editor/publisher staff sign in to the CMS with email and password. Father accounts can self-register with a Father ID, date of birth, email, password and mobile number; Father IDs are not checked against an approved list. Public registration cannot create admins. `editor` may edit drafts or submit content for review, `publisher` may publish and verify, and `admin` may additionally delete items and administer users/settings.

**Publication gates:** parish, location, leadership, formation, international mission and timeline records require `verification_status=verified` **and** a `last_verified_at` date when published. Contacts must be explicitly `approved_for_public` and have `last_verified_at`. Uploaded files need both confirmed rights and alt text to be published. Full editorial review remains a human responsibility.

## Seed/source mapping

The `api/scripts/seed-data.json` file was extracted from the uploaded DOCX, covering:

- Section 7 ministry table (17 defined ministries; this takes precedence over illustrative visual mockup category labels that differ)
- Section 8 parish directory (12 parishes)
- Section 6 historical timeline (10 milestones)
- Sections 4–16 starter pages, mission/charism/vision excerpts
- Sections 9–10 formation and international mission
- Section 13 leadership records (all DRAFT pending appointment/archival checks)
- Formal Education institutions listed under ministry 04 (7 school drafts)
- Section 12 publications (`Yazha-Thoni`, `Zeal`)
- Section 22 location directory (31 locations; no individual personal phone numbers automatically imported)

All seeded content starts in **draft** state regardless of the source document's presentation. Never assume this source establishes current operational status, leadership terms, maps, parish schedules or permission to display personal contact information. The DOCX is the content basis, not independently verified live source data.

## Editorial and privacy notes

1. Source references differ on some ministry labels (e.g. formal ministry table says “Care for Persons with Disabilities”, click-through prototype calls one screen “Caring for Amputees”) and may include inconsistent leadership term dates. The database preserves the formal source table and leaves all disputed data for Province review.
2. Obtain explicit publication consent before adding personal Oblate telephone numbers or email addresses. The user-supplied 74-row private contacts table is **not** bulk-imported.
3. Confirm parish Mass schedules, responsible contacts, and clergy assignments before publication. No schedules are fabricated.
4. Review captions, source credits, rights and safeguarding consent for all media, especially photographs of children and vulnerable people.
5. The UI has English/Tamil/Sinhala content fields but **does not machine translate** them. Missing translated text falls back to English.
6. Plain text is used for the main body editor. Rich text and complete media relations should be added when the editorial workflow is finalized.
7. Before public launch, perform a formal security assessment, add CSRF defense-in-depth, stronger user lifecycle controls and 2FA, validate production configuration, manage database backups, deploy email delivery, and implement spam protection for public enquiries.

## Testing and limitations

```bash
cd api && node --test
```

This checks seed integrity without a running database. Full integration testing requires a running PostgreSQL server. Frontend building requires `npm install`. The project was created and syntax-checked in the generation environment; npm registry access was unavailable there, so **a live npm build and database-backed end-to-end test could not be completed in that environment**.

## Project layout

```text
omi-jaffna-cms/
├── .env.example
├── docker-compose.yml
├── README.md
├── api/
│   ├── .env.example
│   ├── db/001_init.sql
│   ├── src/{index,db,security,validation,constants}.js
│   ├── scripts/{migrate,seed}.js
│   ├── scripts/seed-data.json
│   └── test/seed-integrity.test.js
└── web/
    ├── src/{main.jsx,style.css,demo.json}
    ├── tailwind.config.js
    ├── vite.config.js
    └── nginx.conf
```
