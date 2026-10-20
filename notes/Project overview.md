---
tags: [project, overview]
---
# OMI Jaffna website

GitHub: https://github.com/sivashankar97/omi_jaffna_fullstack (branch `main`)
Live: https://omi-jaffna.netlify.app

For which file to change, see [[Code map]]. Open tasks: [[Todo]].

## Parts
- `site/` – public website (Next.js 16, Tailwind 4). Pages read content from the API.
- `web/` – CMS (Vite + React), served at `/admin`.
- `api/` – Express API. Runs as a Netlify Function in production; images are stored in Netlify Blobs.
- Database – Supabase Postgres (Tokyo).

## Run locally
- Site http://localhost:5173 (CMS at `/admin`, its dev server is on 5174), API http://localhost:4000
- Login details are in `LOCAL-LOGIN.txt` (not in git).

## Deploy to Netlify
Run from `site/`, not the repo root:

```sh
cd site && netlify deploy --prod --site 8d7f41ed-0371-41b7-9acf-32544300ea3c
```

Takes about 3–10 minutes (longer when large files like the hero video change).
