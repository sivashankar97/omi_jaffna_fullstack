---
tags: [project, overview]
---
# OMI Jaffna website

GitHub: https://github.com/sivashankar97/omi_jaffna_fullstack (branch `main`)
Live: https://omi-jaffna-province.netlify.app (Netlify only — no Vercel)

For which file to change, see [[Code map]]. Open tasks: [[Todo]].

## Parts
- **Public site** (`site/`) – Next.js at http://localhost:5173
- **CMS** (`web/` → built into `site/public/admin`) – same host at http://localhost:5173/admin (not a separate app/port)
- **API** (`api/`) – Express at http://localhost:4000 (Netlify Function in production; images in Netlify Blobs)
- Database – Supabase Postgres (Tokyo). Local/API use the **transaction** pooler (port `6543`) by default; set `PG_POOL_MODE=session` only if you need session features.

## Run locally
- From the repo root: `npm run dev` (`scripts/dev-all.mjs`). Starts API + public site together; Ctrl+C stops both.
- Public site: http://localhost:5173 · CMS: http://localhost:5173/admin · API: http://localhost:4000
- After editing CMS code in `web/`, run `npm run cms:build` then refresh `/admin`.
- Login details are in `LOCAL-LOGIN.txt` (not in git).

## Deploy to Netlify
Run from `site/`, not the repo root:

```sh
cd site && netlify deploy --prod --site 92088e06-0697-4abc-9929-a507a370000e
```

Takes about 3–10 minutes (longer when large files like the hero video change).

The CLI builds on this Mac, so `NETLIFY` is not set during the build. Local-only rewrites in `site/next.config.ts` (mainly `/api` → :4000) apply in `next dev` only; on Netlify, `netlify.toml` routes `/api` and `/admin`.

CMS uploads go to **Supabase Storage** bucket `media` (private). Local and Netlify share the same bucket via `MEDIA_STORE=supabase`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` (server-only; set in `api/.env` and Netlify env). The site still loads files through `/api/files/{id}` (API streams from Storage). Allowed: JPEG/PNG/WebP/PDF ≤12 MB, MP4 ≤40 MB. Migrate existing Blobs files once with `cd api && npm run migrate:media` (pulls from the live site into Supabase).

Oblate priest studio portraits: stage in `site/public/priests/portraits/`, then `cd api && npm run seed:priest-portraits` → Storage + `priest.image_url` = `/api/files/{id}`. Convert JPGs first with `python3 api/scripts/convert-priest-portraits.py` if needed.

Provincial council studio portraits: stage in `api/.staging/council-portraits/` (gitignored, never `public/`), then `cd api && npm run seed:council-portraits` → Storage + `leadership.image_url`.
