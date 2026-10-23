---
tags: [project, overview]
---
# OMI Jaffna website

GitHub: https://github.com/sivashankar97/omi_jaffna_fullstack (branch `main`)
Live: https://omi-jaffna-province.netlify.app (Netlify only — no Vercel)

For which file to change, see [[Code map]]. Open tasks: [[Todo]].

## Parts
- `site/` – public website (Next.js 16, Tailwind 4). Pages read content from the API.
- `web/` – CMS (Vite + React), served at `/admin`.
- `api/` – Express API. Runs as a Netlify Function in production; images are stored in Netlify Blobs.
- Database – Supabase Postgres (Tokyo). Local/API use the **transaction** pooler (port `6543`) by default so session-mode’s ~15-client cap is not exhausted; set `PG_POOL_MODE=session` only if you need session features.

## Run locally
- From the repo root: `npm run dev` (`scripts/dev-all.mjs`). It starts all three and stops them together with Ctrl+C.
- Site http://localhost:5173 (CMS at `/admin`, its dev server is on 5174), API http://localhost:4000
- Login details are in `LOCAL-LOGIN.txt` (not in git).

## Deploy to Netlify
Run from `site/`, not the repo root:

```sh
cd site && netlify deploy --prod --site 92088e06-0697-4abc-9929-a507a370000e
```

Takes about 3–10 minutes (longer when large files like the hero video change).

The CLI builds on this Mac, so `NETLIFY` is not set during the build. The local proxy rewrites in `site/next.config.ts` (`/api`, `/admin`, fallback to the CMS dev server) are therefore limited to `next dev`; otherwise unknown pages return 500 on the live site.

CMS uploads live in Netlify Blobs store `media` on this site. Do **not** set `NETLIFY_BLOBS_TOKEN` on Netlify (only in local `api/.env` for offline access); a bad token makes `/api/files/…` return 401. After changing sites, re-upload missing images in the CMS — Blobs do not move automatically.

Oblate priest studio portraits: stage in `site/public/priests/portraits/`, then `cd api && npm run seed:priest-portraits` uploads them to Netlify Blobs store `media`, inserts `media_assets`, and sets `priest.image_url` to `/api/files/{id}` (same path as CMS uploads). Convert JPGs first with `python3 api/scripts/convert-priest-portraits.py` if needed.
