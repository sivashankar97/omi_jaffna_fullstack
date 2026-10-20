---
tags: [codemap]
---
# Code map

Where things live. Open only the files listed for the part you are changing.
Paths are from the repo root. `sections/` = `site/src/components/sections/`.

## Public site pages (`site/src/app/`)
| Page | Page file | Main components | CMS data (`site/src/lib/cms.ts`) |
|---|---|---|---|
| Home `/` | `page.tsx` | `sections/hero/hero-section.tsx`, `sections/home/*` (home-sections, join-us, journey-path, media-highlights, province-calendar, home-contact) | `getHomeContent`; `home-sections.tsx` also loads `getEvents`, `getMinistries`, `getNews` |
| History `/history` | `history/page.tsx` | `sections/history/*` (chapter-nav, count-up, scroll-progress), `sections/home/journey-path.tsx` | none, static `site/src/content/history.ts` |
| Charism `/charism` | `charism/page.tsx` | `sections/charism/*` (charism-join, charism-vow, charism-ways) | `getCharismContent` + `content/charism.ts` |
| Leadership `/leadership` | `leadership/page.tsx` | `sections/leadership/priest-directory.tsx` (priest cards, filters, search) | `getLeadership`, `getFormerProvincials`, `getPriests` + `content/leadership.ts` |
| Ministries `/ministries` | `ministries/page.tsx` | `sections/ministries/ministry-explorer.tsx`, `sections/ministry-card.tsx`, `sections/page-banner.tsx` | `getMinistries`, `getParishes` + `content/ministry-details.ts` |
| Vocations `/vocations` | `vocations/page.tsx` | `sections/page-banner.tsx` | `getFormationHouses` |
| International `/international` | `international/page.tsx` | `sections/page-banner.tsx` | `getMissionCountries`, `getFormationAbroad` |
| Media `/media` | `media/page.tsx` | `sections/media/*` (media-studio, media-publications, social-signals) | `getNews`, `getPublications`, `getMinistries`, `getTimeline` |
| News `/news` | `news/page.tsx` | `sections/news/*` (news-card, news-ticker, news-marquee) | `getNews` + `content/news.ts` |
| News article `/news/[slug]` | `news/[slug]/page.tsx` | `sections/news/news-card.tsx`, `share-buttons.tsx` | `getNewsArticle`, `getNews` |
| Contact `/contact` | `contact/page.tsx` | `site/src/components/contact/contact-form.tsx`, `layout/page-hero.tsx` | posts to `/api/public/inquiries` |
| Login / Register | `login/`, `register/page.tsx` | `site/src/components/auth/member-access.tsx` | `/api/auth/*` |

Leadership page data (CMS type `leadership`, one entry per person, told apart by the Position field `meta.role`):
- Provincial Superior: Position "Provincial Superior"; term, since, appointments (`meta.terms`), bio = full content, portrait = cover image. Built-in fallback per field: `site/src/content/leadership.ts`.
- Council: any other position (1st–5th Councillor, Bursar); photo = cover image, else built-in `councilImages` by name. Council heading = first member's term.
- Former Provincials: Position "Former Provincial" + term.
- Oblate priests: CMS type `priest`, "Where serving" = `meta.place`, photo = cover image.
- CMS form fields for these: `MetaFields` in `web/src/main.jsx`. Extra meta keys must be listed in `PUBLIC_META_KEYS` in `api/src/app.js` or the site never receives them.

Redirect-only pages: `/about` to `/history`, `/parishes` to `/ministries#parish-directory`, `/publications` to `/media#publications`.

## Shared site pieces
- Header / menu: `site/src/components/layout/site-header.tsx`; menu items and in-page links: `site/src/config/navigation.ts`
- Footer: `site/src/components/layout/site-footer.tsx`
- Site name, contact details: `site/src/config/site.ts`
- Section title style: `sections/section-heading.tsx`; coloured page banner: `sections/page-banner.tsx`
- Animations: `site/src/components/motion/` (reveal, auto-slide, page-motion)
- Mission map: `site/src/components/map/province-map.tsx` + `content/map-locations.ts`
- Buttons, inputs: `site/src/components/ui/`
- Root layout, fonts: `site/src/app/layout.tsx` (also loads `getFormationHouses`, `getMapLocations`, `getMinistries`, `getParishes` for every page)

## Colours and theme
- All colours and page themes: `site/src/app/globals.css` (`--primary` #48cae4 sky blue, `--gold` #ffbf00; dark mode block below; page themes `[data-page-theme="..."]` near the end)
- Which page uses which theme: `site/src/components/layout/page-theme.tsx`

## Content: CMS vs. static files
- Fetched from the CMS: everything via `site/src/lib/cms.ts` (one `get...` function per content type, all `cache: "no-store"`).
- Static fallbacks and fixed text: `site/src/content/*.ts` (home, history, charism, journey, leadership, priests, news, province, slides, ministry-details).
- Images in `site/public/`: hero `Herosection/`, council photos `Leadership_img/`, `ministries/`, `news/`, `slides/`, `logos/`, hero video `video/Hero_section.mp4` (33 MB).

## CMS (`web/`, served at `/admin`)
- Almost everything is in one file: `web/src/main.jsx`
  - Menu groups: `GROUPS` · login: `Login` · dashboard: `Overview` · content list: `ContentManager` · edit form: `ContentEditor`
  - Media uploads page: `Assets` · users: `Team` · enquiries: `Inquiries` · priest self-profile: `FatherProfile` · settings: `SiteSettings`
- Cover image upload in the edit form: `web/src/CoverImageUpload.jsx`
- Styles: `web/src/style.css`

## API (`api/`)
- Routes: `api/src/app.js` (auth, `/api/items` CRUD, `/api/public/*` for the site, `/api/assets` uploads, `/api/files/:id`)
- Generic content CRUD and asset delete: `api/src/crud.js`
- Content types list (page, ministry, parish, priest, news, ...): `api/src/constants.js` (`TYPES`)
- Database connection: `api/src/db.js`; schema: `api/db/*.sql`; migrate/seed: `api/scripts/`
- File storage: `api/src/storage.js`. Local and live both use the same Netlify Blobs store `media` (local needs `MEDIA_STORE=blobs`, `NETLIFY_SITE_ID`, `NETLIFY_BLOBS_TOKEN` in `api/.env`), so uploads from either side show on both. Without those vars it falls back to `api/uploads/` on disk, which the live site cannot see.
- Login security, roles: `api/src/security.js`; input checks: `api/src/validation.js`
- Local server start: `api/src/index.js`; Netlify function: `api/netlify/functions/api.mjs`

## Deploy and config
- Netlify build: `netlify.toml` (repo root); deploy from `site/` (see [[Project overview]])
- Next.js config (upload size, local API proxy): `site/next.config.ts`
- Local dev starter: `scripts/dev.mjs`
