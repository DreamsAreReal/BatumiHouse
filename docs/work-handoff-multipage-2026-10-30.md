# Batumi House 3.0: handoff for ChatGPT Work (2026-10-30)

## Goal
Convert the existing Batumi House real estate site into a consistent multi-page experience without creating separate sites, removing existing inventory, or breaking leads, Telegram, CRM, SEO and booking calendars. The user approved the design direction and explicitly authorizes Work to finish and publish once checks pass.

## Already prepared in the main branch
- `daily.html`: dedicated short-term rental entry page
- `long-term.html`: dedicated long-term rental entry page
- `sale.html`: dedicated apartment-sale entry page
- `index.html`: navigation buttons and category cards link to the new pages.
These are a **first implementation scaffold**. They currently reuse most of the existing homepage markup and hide other sections with CSS. Work should remove hidden duplicate sections, separate page-specific data and forms, and resolve duplicated IDs or script dependencies before production release. Do NOT treat the scaffolds as production-ready without review.

## Required URL structure
- `/` public homepage: overview, visual entry into exactly three directions: Посуточно, Долгосрочно, Продажа; contact CTA. No booking calendar as a top-level navigation section.
- `/daily.html` short stays: inventory, price per night, check-in/checkout, number of guests, availability/booking where already supported.
- `/long-term.html` long stays: monthly price, bedrooms, area, heating, payment terms, booking inquiry.
- `/sale.html` properties for sale: price, area, floor, location, inquiry about viewing; do not fabricate listings or claimed yields.
- Existing apartment detail links must remain working, including `/apartment/daily-marina-club/` etc. Existing `daily-booking.html` must stay functional.
- `/admin.html` private CRM; `/api/admin/*` private API. NEVER add public links exposing client data.
- Keep separate Batumi Calendar management system completely untouched.

## Navigation
Shared header, mobile hamburger menu, bottom navigation where appropriate, site logo must link to homepage, favorites accessible and closable; three directions easy to find. Avoid a calendar tab in public header. Preserve Batumi House 3.0 approved visual direction: deep navy, clean white surfaces, blue accents, strong contrast, polished mobile UI, comfortable tap targets.

## SEO
Each public page needs unique relevant title, meta description, canonical, Open Graph URL/title/description, H1, useful introductory content. Add to sitemap.xml and adjust internal links; verify robots.txt. Do not invent ratings, prices, property availability or misleading structured data. Keep the homepage canonical on `/`; pages canonical to their own paths. Redirect/maintain old fragment links carefully.

## Technical requirements and validation
1. Investigate real build/deploy pipeline and Cloudflare Worker `batumihouse` assets configuration. Wrangler uses `assets.directory=./dist`; ensure every new page is actually included in `dist`, test HTTP 200/HTML in production. Previously a missing build asset caused blank `/admin.html`.
2. Preserve bindings: D1 `LEADS`, `LEAD_LIMITER`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`. Do not print secret values. Do not reset, replace or delete D1 data.
3. Validate form POST `/api/leads`, one lead stored, Telegram notification, no unwanted Telegram handoff on success. Do not create fake production leads without permission.
4. Keep Cloudflare Access protecting `/admin.html` and `/api/admin/*`. Confirm only authorized administrator can access, forbidden without valid JWT.
5. Make mobile Safari tests for all pages, navigation, images, forms, favorites, back behavior, and search/filtering. Test desktop too. Run existing automated tests, add targeted navigation tests.
6. Ensure the main listing pages show only relevant inventory; sales page should have a clear request CTA until genuine sale listings are available.
7. Publish to existing Worker `batumihouse` on workers.dev (do not change unrelated Workers or Pages projects). Verify exact production URLs after deploy.

## Release checklist
- Home, three category pages and all existing apartment detail pages respond correctly.
- No blank page or JS errors; mobile iPhone layout works.
- Navigation works; branding/logo clickable; favorites can be closed.
- SEO metadata unique; sitemap and robots reflect new sections.
- Forms, D1, notification and secure admin routes still work.
- Existing data, images, rental inventory, Calendar and secrets preserved.
- Report actual deployment outcome, unresolved issues, and live URLs to the user.

User prefers minimal involvement from iPhone. Avoid asking for redundant permissions; only ask for Cloudflare/GitHub authorization if necessary.
