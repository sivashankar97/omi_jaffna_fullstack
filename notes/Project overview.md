---
tags: [project, overview]
---
# OMI Jaffna website

GitHub: https://github.com/sivashankar97/omi_jaffna_fullstack (branch `main`)
Live: https://omijaffna.com · CMS: https://omijaffna.com/admin · IP: http://179.197.250.19  
TLS: Let’s Encrypt on VPS (`deploy/vps/nginx.conf`); `FRONTEND_ORIGIN=https://omijaffna.com`, `COOKIE_SECURE=true`.  
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
**Code** deploys manually (GitHub auto-deploy on push is **off**). CMS **content** is already on the shared VPS DB — no deploy for content edits. Nav clicks show an instant page skeleton (`app/loading.tsx`) while CMS data loads. Root layout is `force-dynamic` so CMS slug pages (fathers, bishops, council, …) render at request time with `cache: "no-store"` (avoids production `DYNAMIC_SERVER_USAGE` 500s).

**Day to day (any Mac)**  
`npm run vps:deploy -- omi-vps` → rsync + rebuild → http://179.197.250.19. Optional: Actions → Deploy VPS → Run workflow (manual only; workflow is disabled by default).

**First time on the VPS**
1. Install Docker (or run `scripts/vps-bootstrap.sh` on the server after clone)
2. Create `deploy/vps/.env` from `.env.example` — set `POSTGRES_PASSWORD`, `JWT_SECRET`, `FRONTEND_ORIGIN=http://YOUR_PUBLIC_IP`, `COOKIE_SECURE=false` (until HTTPS). For Forgot password emails also set `PUBLIC_SITE_URL` (address used in the email link) and `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`. Without SMTP, production sends no reset emails; locally the link is printed in the API log.
   - Live mail goes through **Brevo** (`smtp-relay.brevo.com:587`, sender `no-reply@omijaffna.com`). omijaffna.com is authenticated in Brevo (DKIM, SPF and DMARC records in Namecheap DNS), so mail lands in the inbox. The SMTP key is "OMI website VPS" in Brevo → SMTP & API; it expires after 90 days without sending. To prevent that, the API sends a check email every 2 weeks to `MAIL_KEEPALIVE_TO` (set in the VPS `.env`; last send stored in `site_settings` key `mail_keepalive`). If resets stop arriving, generate a new key there and update `SMTP_PASS` on the VPS, then `docker compose up -d api`. Brevo click tracking rewrites the HTML button link; the redirect still works.
   - "Write with AI" in the Father dashboard uses **Google Gemini** (free tier). Set `GEMINI_API_KEY` (free key from aistudio.google.com, signed in as omijaffnadatabase@gmail.com) and optionally `GEMINI_MODEL` (default `gemini-flash-lite-latest`, falls back to `gemini-flash-latest` when busy) in the VPS `.env`, then `docker compose up -d api`. Without a key the button says AI writing is not set up. Free tier: Google may use the prompts to improve its models, so the prompt only carries what the father typed for a public post plus public background (Province pages, Wikipedia). Google Search grounding is not available on the free tier (quota 0); it would need billing on the Google project.
3. `npm run vps:deploy -- omi-vps`

Postgres is **not** public; only `127.0.0.1:5432` on the VPS. Macs use `npm run db:tunnel -- omi-vps`.

**Daily backup to Google Drive**
- Every night at 00:00 Sri Lanka time (cron `30 18 * * *` UTC in root's crontab), `scripts/vps-backup.sh` dumps the whole database and uploads `omi-db-YYYY-MM-DD.sql.gz` to the Drive folder **OMI Jaffna backups**. The dump covers content, users and media files, because media lives in the `media_blobs` table. Backups older than 30 days are deleted. Each one is about 130 MB.
- Log: `/var/log/omi-backup.log` on the VPS. Run one by hand: `ssh omi-vps /root/omi-jaffna-cms/scripts/vps-backup.sh`.
- Drive access is the rclone remote `gdrive` (`/root/.config/rclone/rclone.conf`, scope `drive.file`, so it only sees files it created). To reconnect: on the Mac run `rclone authorize "drive"` and sign in, then put the new token in that file.
- Pending switch to OMI's own Google app (see Todo). Client ID and secret: Google Cloud → project `clean-vista-513010-d1` → Google Auth Platform → Clients → "rclone VPS backup". On the Mac: `rclone authorize "drive" "<base64url of {client_id, client_secret, scope: drive.file}>"`, sign in, then write `client_id`, `client_secret` and the new token into the `gdrive` remote on the VPS. With `drive.file`, a new client cannot see the folder made by the old one, so the first run creates a fresh "OMI Jaffna backups" folder; after it works, delete the old folder in Drive.
- `deploy/vps/.env` is not backed up (secrets). Keep a copy somewhere safe yourself.
- Restore (overwrites the live DB): `rclone copy "gdrive:OMI Jaffna backups/omi-db-DATE.sql.gz" /tmp/`, then `gunzip -c /tmp/omi-db-DATE.sql.gz | docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'` in `deploy/vps`.

## Deploy to Netlify (legacy)
Run from `site/`, not the repo root:

```sh
cd site && netlify deploy --prod --site 92088e06-0697-4abc-9929-a507a370000e
```

Takes about 3–10 minutes (longer when large files like the hero video change).

The CLI builds on this Mac, so `NETLIFY` is not set during the build. Local-only rewrites in `site/next.config.ts` (mainly `/api` → :4000) apply in `next dev` only; on Netlify, `netlify.toml` routes `/api` and `/admin`.

CMS uploads go to **Supabase Storage** bucket `media` (private). Local and Netlify share the same bucket via `MEDIA_STORE=supabase`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` (server-only; set in `api/.env` and Netlify env). The site still loads files through `/api/files/{id}` (API streams from Storage). Allowed: JPEG/PNG/WebP ≤12 MB, PDF / MP4 / MP3 / M4A ≤40 MB (PDFs were raised to 40 MB in Oct 2026 for Father book uploads; the VPS keeps files in Postgres and nginx allows 45 MB; a Supabase bucket created by `storage.js` still caps files at 12 MB). `/api/files` supports byte ranges for seeking. Migrate existing Blobs files once with `cd api && npm run migrate:media` (pulls from the live site into Supabase).

Father submissions: articles, events and books (PDF for the Library, as a new release or in a library collection) arrive in the CMS as **In review** under Father Profile Management (sidebar badges show how many are waiting). Publishing one also publishes the photos/PDF the Father uploaded for it.

Oblate priest studio portraits: stage in `site/public/priests/portraits/`, then `cd api && npm run seed:priest-portraits` → Storage + `priest.image_url` = `/api/files/{id}`. Convert JPGs first with `python3 api/scripts/convert-priest-portraits.py` if needed.

Provincial council studio portraits: stage in `api/.staging/council-portraits/` (gitignored, never `public/`), then `cd api && npm run seed:council-portraits` → Storage + `leadership.image_url`.

CMS Content Seeder (admin): seed each page block or content type separately (or Seed all). Sample: `api/scripts/seed-cms.sample.json`. CLI: `cd api && npm run seed:cms`. Force overwrite replaces existing rows; Safe fill skips them.

## Presentation pack
- Feature slides (landscape PDF for animated decks): `docs/OMI-Jaffna-Website-Features.pdf` (source `docs/OMI-Jaffna-Website-Features.html` — print with headless Chrome `--print-to-pdf`).
- CMS editor guide: `docs/OMI-Jaffna-CMS-Guide.pdf`.

## Colour palette
- Primary / brand: **`#17b3c6`** (`--primary`, `--brand`) — header nav, footer brand bar, site primary.
- Supporting tokens in `globals.css`: teal-900…100, gold-600/500/100, bg `#F8FBFF`, surface, text `#2B3A42`. Home (`data-page-theme="home"`) uses the supporting palette.
