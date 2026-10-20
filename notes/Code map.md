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
| Charism `/charism` | `charism/page.tsx` | `sections/charism/*` (charism-join, charism-vow, charism-ways) | `getCharismContent` (all from the `charism` page entry: excerpt, body, headline, ways, about_heading, about, arrival, mission) + `getBlock("charism")` |
| Leadership `/leadership` | `leadership/page.tsx` | `sections/leadership/priest-directory.tsx` (priest cards, filters, search) | `getLeadership`, `getFormerProvincials`, `getPriests` |
| Ministries `/ministries` | `ministries/page.tsx` | `sections/ministries/ministry-explorer.tsx`, `sections/ministry-card.tsx`, `sections/page-banner.tsx` | `getMinistries`, `getParishes`, `getSchools` |
| Vocations `/vocations` | `vocations/page.tsx` | `sections/page-banner.tsx` | `getFormationHouses` |
| International `/international` | `international/page.tsx` | `sections/page-banner.tsx` | `getMissionCountries`, `getFormationAbroad` |
| Media `/media` | `media/page.tsx` | `sections/media/*` (media-studio, media-publications, social-signals) | `getNews`, `getPublications`, `getMinistries`, `getTimeline`, `getHomeContent` (quote/lede in Readings) |
| News `/news` | `news/page.tsx` | `sections/news/*` (news-card, news-ticker, news-marquee) | `getNews` (sections list: `content/news.ts`) |
| News article `/news/[slug]` | `news/[slug]/page.tsx` | `sections/news/news-card.tsx`, `share-buttons.tsx` | `getNewsArticle`, `getNews` |
| Contact `/contact` | `contact/page.tsx` | `site/src/components/contact/contact-form.tsx`, `layout/page-hero.tsx` | posts to `/api/public/inquiries` |
| Login / Register | `login/`, `register/page.tsx` | `site/src/components/auth/member-access.tsx` | `/api/auth/*` |

Leadership page data (CMS type `leadership`, one entry per person, told apart by the Position field `meta.role`):
- Provincial Superior: Position "Provincial Superior"; term, since, appointments (`meta.terms`), bio = full content, portrait = cover image. No entry = section hidden.
- Council: any other position (1st–5th Councillor, Bursar); photo = cover image. Council heading = first member's term.
- Former Provincials: Position "Former Provincial" + term.
- Oblate priests: CMS type `priest`, "Where serving" = `meta.place`, photo = cover image.
- CMS form fields for these: `MetaFields` in `web/src/main.jsx`. Extra meta keys must be listed in `PUBLIC_META_KEYS` in `api/src/app.js` or the site never receives them.

Redirect-only pages: `/about` to `/history`, `/parishes` to `/ministries#parish-directory`, `/publications` to `/media#publications`.

## Shared site pieces
- Header / menu: `site/src/components/layout/site-header.tsx`; menu items and in-page links: `site/src/config/navigation.ts`
  - Header is `fixed` and shrinks on scroll (`--tuck` CSS var); a `.site-header-shell` spacer holds its full height so the page doesn't shift (a shifting sticky header caused a scroll flicker)
- Footer: `site/src/components/layout/site-footer.tsx`
- Site name, contact details: `site/src/config/site.ts`
- Section title style: `sections/section-heading.tsx`; coloured page banner: `sections/page-banner.tsx`
- Animations: `site/src/components/motion/` (reveal, auto-slide, page-motion)
- Mission map: `site/src/components/map/province-map.tsx` (pins = CMS `location` entries with lat/lng)
- Buttons, inputs: `site/src/components/ui/`
- Root layout, fonts: `site/src/app/layout.tsx` (also loads `getFormationHouses`, `getMapLocations`, `getMinistries`, `getParishes` for every page)

## Colours and theme
- All colours and page themes: `site/src/app/globals.css` (`--primary` #48cae4 sky blue, `--gold` #ffbf00; dark mode block below; page themes `[data-page-theme="..."]` near the end)
- Which page uses which theme: `site/src/components/layout/page-theme.tsx`

## Content: CMS vs. static files
- Fetched from the CMS: everything via `site/src/lib/cms.ts` (one `get...` function per content type, all `cache: "no-store"`). There are no built-in lists any more: if the CMS has nothing published (or the API is down) the section is empty.
- `site/src/content/*.ts`: only block defaults (history, charism, journey, slides, site-info, blocks) and types (news sections, priests, map-locations, ministry-details).
- Editable page text and images ("blocks"): `site/src/content/blocks.ts` lists each block with its default text. Block ids = CMS page slugs: `home` (hero video + poster), `site-info` (contact, social, logos, default news photo; defaults in `content/site-info.ts`), `home-sections`, `home-slides`, `journey`, `media-page` (top photo, video tile, gallery), `history` (+ `images`), `charism` (+ `images`).
  - Images: every picture on the site comes from the CMS (blocks, or `image_url` on entries such as ministries, leadership, priests, news). Image fields are any block key named `src`/`image`/`photo` or ending in `Image` (CMS shows upload + preview). Uploaded files are `/api/files/…`: pass `unoptimized={isUpload(src)}` (`content/site-info.ts`) to `next/image`. Hero video is a link (uploads accept only JPEG/PNG/WebP/PDF up to 12 MB). Edits live in that page entry's `metadata.sections`; the site loads them with `getBlock(id)` (lists replace whole, empty text keeps default).
  - The CMS builds the forms from the defaults served at `/cms-blocks` (`site/src/app/cms-blocks/route.ts`); form code: `web/src/AutoFields.jsx`. To make new text editable: add it to a block's defaults, read it via `getBlock`.
  - Contact details/social links on the client: `useSiteInfo()` from `components/layout/site-info.tsx` (provider in `app/layout.tsx`); server: `getSiteInfo()`.
  - Ministry popup text: CMS ministry entry `metadata.detail` (no detail = no popup). Shape: `emptyMinistryDetail` in `content/ministry-details.ts` / `web/src/main.jsx`.
  - Schools (CMS type `school`): `getSchools`, list on `/ministries#schools`.
- Still fixed in code: Media page text (`sections/media/*`), Vocations/International page wording, Join us form fields, page banners/hero video.
- Images in `site/public/`: hero `Herosection/`, council photos `Leadership_img/`, `ministries/`, `news/`, `slides/`, `logos/`, hero video `video/Hero_section.mp4` (33 MB).

## CMS (`web/`, served at `/admin`)
- Almost everything is in one file: `web/src/main.jsx`
  - Menu follows the website menu order: `NAV` group "Website pages" (one entry per page; a page with one screen opens it directly) + group "On several pages" (footer/contact details, mission map, Our journey). The Overview shows the same map ("Where to edit each page"). `NAV` (page groups) + `VIEWS` (one screen = content type + optional filter by page slug or metadata field, e.g. Leadership › Provincial Council = `leadership` where role is not Superior/Former). Adding a website section = add a `VIEWS` entry and list it under its page in `NAV`. The filters are handled by `/api/items` (`slug`, `meta_key`, `meta_like`, `meta_not`) in `api/src/app.js`. · login: `Login` · dashboard: `Overview` · content list: `ContentManager` · edit form: `ContentEditor`
  - "Open on website" icon on each row and in the editor: `itemLink()` + `PAGE_LINKS` in `main.jsx`. Every entry links to its own spot: news `/news/slug`, `#ministry-NN`, `#parish-`, `#school-`, `#house-`, `#country-` / `#abroad-`, `#council-` / `#former-`, publications, map pins `/#place-<slug>` (handled in `province-map.tsx`). Anchor ids use `anchorId()` (same in `config/navigation.ts` and `main.jsx`).
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
- Content types list (page, ministry, parish, priest, news, ...): `api/src/constants.js` (`TYPES`)
- Database connection: `api/src/db.js`; schema: `api/db/*.sql`; migrate/seed: `api/scripts/`
- File storage: `api/src/storage.js`. Local and live both use the same Netlify Blobs store `media` (local needs `MEDIA_STORE=blobs`, `NETLIFY_SITE_ID`, `NETLIFY_BLOBS_TOKEN` in `api/.env`), so uploads from either side show on both. Without those vars it falls back to `api/uploads/` on disk, which the live site cannot see.
- Login security, roles: `api/src/security.js`; input checks: `api/src/validation.js`
- Local server start: `api/src/index.js`; Netlify function: `api/netlify/functions/api.mjs`

## Deploy and config
- Netlify build: `netlify.toml` (repo root); deploy from `site/` (see [[Project overview]])
- Next.js config (upload size, local API proxy): `site/next.config.ts`
- Local dev starter: `scripts/dev.mjs`
