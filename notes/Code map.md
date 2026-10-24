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
| History `/history` | `history/page.tsx` | `sections/history/*` (chapter-nav, count-up, scroll-progress, bishop-profiles, historical-archive, year-journey), `sections/media/necrology-register.tsx`, `sections/home/journey-path.tsx` | `getBlock("history")` (incl. `archive` + `necrology` copy), `getBlock("journey")`, `getTimeline`, `getNecrology`, `getBishops` |
| Bishop profile `/history/bishops/<slug>` | `history/bishops/[slug]/page.tsx` (`bishopHref()` in `config/navigation.ts`) | — | `getBishops` / `getBishop` (CMS type `bishop`) |
| Charism `/charism` | `charism/page.tsx` | `sections/charism/*` (charism-join, charism-vow, charism-ways) | `getCharismContent` (page entry: excerpt, body, headline, ways, about_heading, about, arrival, mission) + `getBlock("charism")` (hero, identity, priorities, **mission**, **vision**, motto, images) |
| Leadership `/leadership` | `leadership/page.tsx` | `sections/leadership/priest-directory.tsx` (priest cards, filters, search) | `getBlock("leadership")` (hero + superior section titles), `getLeadership`, `getFormerProvincials`, `getPriests` |
| Ministries `/ministries` | `ministries/page.tsx` | `sections/ministries/ministry-explorer.tsx` (cards link to each ministry page), `sections/ministry-card.tsx`, `sections/page-banner.tsx` | `getBlock("ministries")` (hero + mission name), `getMinistries`, `getParishes`, `getSchools` |
| Ministry page `/ministries/NN-name` | `ministries/[slug]/page.tsx` (slug = `ministrySlug()` in `config/navigation.ts`) | — | `getMinistries` (`detail` incl. `stories`), `getSiteInfo` |
| Vocations `/vocations` | `vocations/page.tsx` | `sections/page-banner.tsx` | `getFormationHouses` |
| International `/international` | `international/page.tsx` | `sections/page-banner.tsx` | `getMissionCountries`, `getFormationAbroad` |
| Media `/media` | `media/page.tsx` | `sections/media/*` (media-studio, media-publications, social-signals) | `getNews`, `getPublications`, `getMinistries`, `getHomeContent` (quote/lede in Readings), `getBlock("media-page")` |
| News `/news` | `news/page.tsx` | `sections/news/*` (news-card, news-ticker, news-marquee) | `getNews` (sections list: `content/news.ts`) |
| News article `/news/[slug]` | `news/[slug]/page.tsx` | `sections/news/news-card.tsx`, `share-buttons.tsx` | `getNewsArticle`, `getNews` |
| Contact `/contact` | `contact/page.tsx` | `site/src/components/contact/contact-form.tsx`, `sections/page-banner.tsx` | `getSiteInfo`, `getLeadership` (Superior name); form posts to `/api/public/inquiries` |
| Login / Register | `login/`, `register/page.tsx` | `site/src/components/auth/member-access.tsx` | `/api/auth/*` — fathers redirect to `/dashboard` |
| Father dashboard `/dashboard` | `dashboard/page.tsx` | `components/auth/father-dashboard.tsx` | `/api/father/dashboard` (incl. admin reports + my news), `/api/father/items`, `/api/father/news` (creates news in `review`), `/api/father/upload`, `/api/auth/profile` |

Leadership page data (CMS type `leadership`, one entry per person, told apart by the Position field `meta.role`):
- Provincial Superior: Position "Provincial Superior"; term, since, appointments (`meta.terms`), bio = full content, portrait = cover image. No entry = section hidden.
- Council (1st–5th Councillor, Bursar) / Superior: photo = cover image (`/api/files/…` via Supabase Storage). Council heading = first member's term. Seed with `cd api && npm run seed:council-portraits` from `api/.staging/council-portraits/` (not `public/`).
- Former Provincials: Position "Former Provincial" + term.
- Oblate priests: CMS type `priest`, "Where serving" = `meta.place`, photo = cover image (`/api/files/…` via Supabase Storage + `media_assets`). Staging cutouts may sit in `site/public/priests/portraits/`; seed with `cd api && npm run seed:priest-portraits`.
- CMS form fields for these: `MetaFields` in `web/src/main.jsx`. Extra meta keys must be listed in `PUBLIC_META_KEYS` in `api/src/app.js` or the site never receives them.

Redirect-only pages: `/about` to `/history`, `/parishes` to `/ministries#parish-directory`, `/publications` to `/media#publications`.

## Shared site pieces
- Header / menu: `site/src/components/layout/site-header.tsx` (auth chip: `components/auth/member-menu.tsx` — Login/Register or Father name + Profile); menu items and in-page links: `site/src/config/navigation.ts`
  - Header is `fixed` and shrinks on scroll (`--tuck` CSS var); a `.site-header-shell` spacer holds its full height so the page doesn't shift (a shifting sticky header caused a scroll flicker)
- Footer: `site/src/components/layout/site-footer.tsx`
- Site name, contact details: `site/src/config/site.ts`
- Section title style: `sections/section-heading.tsx`; coloured page banner: `sections/page-banner.tsx`
- Animations: `site/src/components/motion/` (reveal, auto-slide, page-motion)
- Mission map: `site/src/components/map/province-map.tsx` (pins = CMS `location` entries with lat/lng), shown only on Home and Contact via `map/province-map-gate.tsx`
- Buttons, inputs: `site/src/components/ui/`
- Root layout, fonts: `site/src/app/layout.tsx` (also loads `getFormationHouses`, `getMapLocations`, `getMinistries`, `getParishes` for every page)

## Colours and theme
- All colours and page themes: `site/src/app/globals.css` (`--primary` #48cae4 sky blue, `--gold` #ffbf00; dark mode block below; page themes `[data-page-theme="..."]` near the end)
- Which page uses which theme: `site/src/components/layout/page-theme.tsx`

## Content: CMS vs. static files
- Fetched from the CMS: everything via `site/src/lib/cms.ts` (one `get...` function per content type, all `cache: "no-store"`). There are no built-in lists any more: if the CMS has nothing published (or the API is down) the section is empty.
- `site/src/content/*.ts`: only block defaults (history, charism, journey, site-info, blocks), types (news sections, priests, map-locations, ministry-details), Former Provincial face crops (`leadership.ts`, keyed by image path) and the necrology seed list (`necrology.ts` — imported into CMS type `necrology` via `npm run import:necrology`; live site reads CMS).
- Editable page text and images ("blocks"): `site/src/content/blocks.ts` lists each block with its default text. Block ids = CMS page slugs: `home` (hero video + poster), `site-info` (contact, social, logos, default news photo; defaults in `content/site-info.ts`), `home-sections`, `home-slides`, `journey`, `media-page` (top photo, video tile, gallery), `history` (+ `images`), `charism` (+ `images`), `leadership` (hero + "Our Provincial Leader" titles), `ministries` (hero + mission name).
  - Images: every picture on the site comes from the CMS (blocks, or `image_url` on entries such as ministries, leadership, priests, news). Image fields are any block key named `src`/`image`/`photo` or ending in `Image` (CMS shows upload + preview). Uploaded files are `/api/files/…`: pass `unoptimized={isUpload(src)}` (`content/site-info.ts`) to `next/image`. Hero video is a link (uploads accept only JPEG/PNG/WebP/PDF up to 12 MB). Edits live in that page entry's `metadata.sections`; the site loads them with `getBlock(id)` (lists replace whole, empty text keeps default).
  - The CMS builds the forms from the defaults served at `/cms-blocks` (`site/src/app/cms-blocks/route.ts`); form code: `web/src/AutoFields.jsx`. To make new text editable: add it to a block's defaults, read it via `getBlock`.
  - Contact details/social links on the client: `useSiteInfo()` from `components/layout/site-info.tsx` (provider in `app/layout.tsx`); server: `getSiteInfo()`.
  - Ministry page text: CMS ministry entry `metadata.detail` (tagline, overview, focus, highlights, scripture, `stories` = "History & details"). Shape: `emptyMinistryDetail` in `content/ministry-details.ts` / `web/src/main.jsx`.
  - Council photo fit: leadership `metadata.fit` = `cover` fills the card (default: whole photo).
  - Schools (CMS type `school`): `getSchools`, list on `/ministries#schools`.
- Still fixed in code: Media page text (`sections/media/*`), Vocations/International page wording, Join us form fields, page banners/hero video.
- Images in `site/public/`: hero `Herosection/`, legacy former-provincial face crops `Leadership_img/` (council studio portraits live in Blobs, not public), Oblate priest studio cutouts `priests/portraits/` (~90 PNGs), `ministries/`, `news/`, `slides/`, `logos/`, hero video `video/Hero_section.mp4` (33 MB).

## CMS (`web/`, served at `/admin`)
- Built into `site/public/admin` (`npm run cms:build` or Netlify build). Local URL: http://localhost:5173/admin — no separate Vite port.
- Staff only (admin / publisher / editor). Fathers never use `/admin`: a Father session is sent to `/dashboard` on the public site. CMS login accepts **staff email** only; Fathers use `/login` on the website.
- Almost everything is in one file: `web/src/main.jsx`
  - Menu follows the website menu order: `NAV` group "Website pages" (one entry per page; a page with one screen opens it directly) + group "On several pages" (footer/contact details, mission map, Our journey). The Overview shows the same map ("Where to edit each page"). `NAV` (page groups) + `VIEWS` (one screen = content type + optional filter by page slug or metadata field, e.g. Leadership › Provincial Council = `leadership` where role is not Superior/Former). Adding a website section = add a `VIEWS` entry and list it under its page in `NAV`. The filters are handled by `/api/items` (`slug`, `meta_key`, `meta_like`, `meta_not`) in `api/src/app.js`. · login: `Login` · dashboard: `Overview` · content list: `ContentManager` · edit form: `ContentEditor`
  - "Open on website" icon on each row and in the editor: `itemLink()` + `PAGE_LINKS` in `main.jsx`. Every entry links to its own spot: news `/news/slug`, ministries `/ministries/NN-name`, `#parish-`, `#school-`, `#house-`, `#country-` / `#abroad-`, `#council-` / `#former-`, publications, map pins `/#place-<slug>` (handled in `province-map.tsx`). Anchor ids use `anchorId()` (same in `config/navigation.ts` and `main.jsx`).
  - Editor fields per type: `FIELDS` / `PAGE_FIELDS` in `main.jsx` list only the fields the website reads, with labels saying where they show. Add a field there when the site starts using it. English only (the site requests `lang=en`).
  - CMS lists use the same order as the site (`sort_order`, then date); "Order on the website" in the editor.
  - Single-entry screens (`single:true`) list their slugs in `slugs` and show a "Create" button when the entry is missing.
  - Extra fields per type: `META_SPECS` (location, event, news, publication, timeline, international) and `PAGE_SPECS` (home, charism). Each website page reads its own entry only (the old `who-we-are` entry was merged into `charism`); block and ministry-detail forms: `SectionFields` (uses `web/src/AutoFields.jsx`).
  - Media uploads page: `Assets` · users: `Team` · enquiries: `Inquiries` · priest self-profile: `FatherProfile` · settings: `SiteSettings`
- Cover image upload in the edit form: `web/src/CoverImageUpload.jsx`
- Styles: `web/src/style.css`
- Editor guide (PDF for CMS users): `docs/OMI-Jaffna-CMS-Guide.pdf`, made from `docs/OMI-Jaffna-CMS-Guide.html` (edit the HTML, then print with headless Chrome `--print-to-pdf`). Update it when the CMS menu or fields change.

## API (`api/`)
- Routes: `api/src/app.js` (auth, `/api/items` CRUD, `/api/public/*` for the site, `/api/assets` uploads, `/api/files/:id`)
- Generic content CRUD and asset delete: `api/src/crud.js`
- Content types list (page, ministry, parish, priest, bishop, necrology, timeline, news, ...): `api/src/constants.js` (`TYPES`); migrations `api/db/004_bishop_type.sql`, `005_necrology_type.sql`, `006_father_portal.sql` (father bio/place/photo + `father_items`); seed via `npm run import:bishops` / `import:necrology` / `seed:priest-portraits` / `seed:council-portraits` / `migrate:media` in `api/`
- Father portal API: `/api/father/dashboard`, `/api/father/items`, `/api/father/news`, `/api/father/upload`, `/api/father/dispatches` (CMS admin→father PDFs) in `api/src/app.js`; CMS screens: **Father reports**, **News › Father news submissions** (`web/src/main.jsx`)
- Father-submitted news stays `status=review` until an admin/publisher publishes it; public site only shows published news
- Database connection: `api/src/db.js`; schema: `api/db/*.sql`; migrate/seed: `api/scripts/`
- History CMS screens: Necrology register = type `necrology`; Year-by-year = type `timeline`; Bishop profiles = type `bishop`; section titles/lede under History page block (`archive`, `necrology`) in `web/src/main.jsx`
- File storage: `api/src/storage.js` — Supabase Storage bucket `media` when `MEDIA_STORE=supabase` (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`). Same store for local and Netlify. Seed: `npm run seed:priest-portraits` / `seed:council-portraits`; migrate old Blobs → Storage: `npm run migrate:media`. Disk fallback only if `MEDIA_STORE` is not `supabase`.
- Login security, roles: `api/src/security.js`; input checks: `api/src/validation.js`
- Local server start: `api/src/index.js`; Netlify function: `api/netlify/functions/api.mjs`

## Deploy and config
- Hosting is Netlify only (`netlify.toml` at the repo root). Deploy from `site/` (see [[Project overview]]).
- Next.js config (local `/api` → API; `/admin` serves built CMS): `site/next.config.ts`
- Local dev starter: `scripts/dev.mjs`
