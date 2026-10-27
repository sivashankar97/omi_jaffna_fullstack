---
tags: [project, overview]
---
# OMI Jaffna website

GitHub: https://github.com/sivashankar97/omi_jaffna_fullstack (branch `main`)
Live VPS: http://179.197.250.19 · CMS: http://179.197.250.19/admin  
(Legacy Netlify: https://omi-jaffna-province.netlify.app)  
Stack: `deploy/vps/` Docker (Postgres + API + Next + nginx). Login secrets: local `VPS-LOGIN.txt` (not in git).

For which file to change, see [[Code map]]. Open tasks: [[Todo]].

## Parts
- **Public site** (`site/`) – Next.js at http://localhost:5173 (dev) or VPS port 80
- **CMS** (`web/` → `site/public/admin`) – `/admin` on the same host
- **API** (`api/`) – Express `:4000` (proxied as `/api` on VPS)
- **Database** – VPS Postgres (shared). Local Macs use SSH tunnel → same DB (2 people).
- **Files** – `MEDIA_STORE=postgres` on VPS so media lives in the shared DB.

## Run locally (shared VPS database)
1. Keep tunnel open: `npm run db:tunnel -- omi-vps` (SSH Host in `~/.ssh/config`; key `~/.ssh/omi_vps`)
2. Point local API at the tunnel: `api/.env` with `DATABASE_URL=...@127.0.0.1:5433/...` + same DB password + JWT as `deploy/vps/.env`
3. `npm run dev` → http://localhost:5173 · CMS `/admin`
4. After CMS UI code changes: `npm run cms:build`

## Hostinger VPS deploy
Stack: `deploy/vps/docker-compose.yml` + `nginx.conf` + `Dockerfile.site`.  
**Code** deploys via GitHub Actions on push to `main` (workflow `.github/workflows/deploy-vps.yml`). CMS **content** is already on the shared VPS DB — no deploy for content edits. Nav clicks show an instant page skeleton (`app/loading.tsx`) while CMS data loads.

**One-time GitHub secrets** (repo → Settings → Secrets and variables → Actions)
- `VPS_SSH_KEY` — private key (`~/.ssh/omi_vps`)
- `VPS_HOST` — `root@179.197.250.19`
- `VPS_PATH` — `/root/omi-jaffna-cms`

**Day to day (any Mac)**  
`git push origin main` → Actions rsync + `vps-up.sh` → live at http://179.197.250.19. Manual re-run: Actions → Deploy VPS → Run workflow. Fallback: `npm run vps:deploy -- omi-vps`.

**First time on the VPS**
1. Install Docker (or run `scripts/vps-bootstrap.sh` on the server after clone)
2. Create `deploy/vps/.env` from `.env.example` — set `POSTGRES_PASSWORD`, `JWT_SECRET`, `FRONTEND_ORIGIN=http://YOUR_PUBLIC_IP`, `COOKIE_SECURE=false` (until HTTPS)
3. Add the three GitHub secrets above, then push to `main` (or run `npm run vps:deploy -- omi-vps` once)

Postgres is **not** public; only `127.0.0.1:5432` on the VPS. Macs use `npm run db:tunnel -- omi-vps`.

## Deploy to Netlify (legacy)
Run from `site/`, not the repo root:

```sh
cd site && netlify deploy --prod --site 92088e06-0697-4abc-9929-a507a370000e
```

Takes about 3–10 minutes (longer when large files like the hero video change).

The CLI builds on this Mac, so `NETLIFY` is not set during the build. Local-only rewrites in `site/next.config.ts` (mainly `/api` → :4000) apply in `next dev` only; on Netlify, `netlify.toml` routes `/api` and `/admin`.

CMS uploads go to **Supabase Storage** bucket `media` (private). Local and Netlify share the same bucket via `MEDIA_STORE=supabase`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` (server-only; set in `api/.env` and Netlify env). The site still loads files through `/api/files/{id}` (API streams from Storage). Allowed: JPEG/PNG/WebP/PDF ≤12 MB, MP4 ≤40 MB. Migrate existing Blobs files once with `cd api && npm run migrate:media` (pulls from the live site into Supabase).

Oblate priest studio portraits: stage in `site/public/priests/portraits/`, then `cd api && npm run seed:priest-portraits` → Storage + `priest.image_url` = `/api/files/{id}`. Convert JPGs first with `python3 api/scripts/convert-priest-portraits.py` if needed.

Provincial council studio portraits: stage in `api/.staging/council-portraits/` (gitignored, never `public/`), then `cd api && npm run seed:council-portraits` → Storage + `leadership.image_url`.

CMS Content Seeder (admin): seed each page block or content type separately (or Seed all). Sample: `api/scripts/seed-cms.sample.json`. CLI: `cd api && npm run seed:cms`. Force overwrite replaces existing rows; Safe fill skips them.

## Presentation pack
- Feature slides (landscape PDF for animated decks): `docs/OMI-Jaffna-Website-Features.pdf` (source `docs/OMI-Jaffna-Website-Features.html` — print with headless Chrome `--print-to-pdf`).
- CMS editor guide: `docs/OMI-Jaffna-CMS-Guide.pdf`.

## Colour palette
- Primary / brand: **`#17b3c6`** (`--primary`, `--brand`) — header nav, footer brand bar, site primary.
- Supporting tokens in `globals.css`: teal-900…100, gold-600/500/100, bg `#F8FBFF`, surface, text `#2B3A42`. Home (`data-page-theme="home"`) uses the supporting palette.
