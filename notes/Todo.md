---
tags: [todo]
---
# Todo

Write website changes here as checkboxes. Ask Cursor: "do the tasks in my Todo note".

## Website
- [ ] 

## CMS
- [ ] Restore the image upload fix (lost when main was pulled): shrink photos in the browser before upload (`web/src/shrinkImage.js`) and auto-approve uploads by admins/publishers in `web/src/CoverImageUpload.jsx`. Live site rejects files over ~6 MB without it. Old version is in local commit `55af611`.
- [x] CMS cleaned to match the website exactly: unpublished drafts (timeline 8, formation 2, countries 7, parishes 7, schools 4, 1 location), placeholder notes and import bookkeeping removed; every entry published + verified, lists numbered 1..n in website order. Backup: `~/omi-jaffna-backups/` (local only). Re-add any removed parish/school/country/milestone in the CMS once the Province confirms it.
- [x] Seed the site's built-in text into the CMS (blocks, History/Who we are, ministry popups 01–06, publications) and remove duplicates, unused page drafts, sample news and example events; built-in list fallbacks removed from code. Backup of the table before this: `/tmp/omi-backup/` (local only).
- [x] CMS coverage gaps (audit 20 Oct 2026): History, Home sections, Charism, Our journey, slideshow, ministry details, contact + social links now editable; proper form fields replace raw JSON; Schools shown on Ministries; Media Library hidden.
- [ ] Not yet editable: Media page text (`sections/media/*`), Vocations / International page wording.

## Done
