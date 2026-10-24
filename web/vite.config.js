import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// CMS is served at /admin on the website (static build → site/public/admin).
// Local/prod: `npm run cms:build` from the repo root (or the Netlify build).
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/admin/',
  plugins: [react()],
});
