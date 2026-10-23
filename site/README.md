# Public site (`site/`)

Next.js app for the Oblate Province of Jaffna website.

Local: from the repo root run `npm run dev`, then open http://localhost:5173.

Production is **Netlify only** (`netlify.toml` at the repo root). Deploy from `site/`:

```sh
cd site && netlify deploy --prod --site 92088e06-0697-4abc-9929-a507a370000e
```

See `notes/Project overview.md` for ports and the rest of the stack.
