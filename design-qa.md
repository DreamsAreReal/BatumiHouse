# Batumi House 3.0 design QA

Date: 30 October 2026. Current instruction explicitly authorizes publication
without another approval round after checks.

## Visual truth and captures

- Reference: `/workspace/scratch/2bbffbcc8d58/upload/9A059806-0EB9-48B6-9CFD-F884B9FD1D68.jpeg`.
- Desktop capture: `/workspace/scratch/bh3-desktop-review.jpg`.
- Phone capture: `/workspace/scratch/bh3-mobile-review.jpg`.
- Browser-rendered implementation: local terminal preview and HTTPS Cloudflare
  version alias `bh3-review` of the existing `batumihouse` Worker.
- Reference pixels: 1536x864, a composite of desktop, phone and apartment page.
  Desktop implementation: 1363x932 CSS viewport. Phone content: 390x852 CSS px
  inside a browser frame; the supplied mockup's phone panel is scaled inside the
  composite. Compare app-owned regions proportionally, not surrounding device
  chrome or pixel-diff totals. No claim of a physical iPhone/Safari test.
- Full reference, desktop and phone captures were opened together in one image
  comparison input. Focused inspections covered the search panel, mobile header,
  bottom navigation and property page/gallery.

## Findings and comparison history

1. Initial desktop search had too much internal spacing: the shared span rule
   also selected icon spans. Fixed by excluding `.icon`; current desktop capture
   shows left-aligned icons, labels and values.
2. Initial 480px hero image was visibly blurred. Replaced by a genuine licensed
   2400x1600 Batumi panorama. Original file retained. This is an intentional real
   photograph substitution for the mockup's composed sunset/balcony scene.
3. Phone property page initially repeated header/back rows above the image.
   Changed to back/save/share controls over the photo, matching the reference's
   property-page composition; persistent phone navigation remains available.
4. Navigation after a rental search could leave the other rental section hidden.
   Added a shared rental-navigation reset. Runtime re-test: Orbi search = 2
   results; click long-term navigation = visible long-term section and all 21
   offers restored.
5. Phone controls and illustrations: language select enlarged to 16px; existing
   illustrative property remains explicitly labelled, never passed off as a
   photographed real interior.

## Five fidelity surfaces

- Typography: large Georgia serif display, gold middle line, serif property
  titles, compact UI sans. Georgian fallback tested without horizontal overflow.
- Rhythm: full-width panorama, overlapping search with three tabs, three image
  categories, four desktop cards / single-column phone cards, navy benefits band.
- Palette: #071D30 / #0C304A / #D9AD65 / #FAF9F6 / #EEF2F4; shared form and gallery
  styling. Darkening overlays support readable hero text.
- Assets: real existing apartment photos. Higher-resolution actual city photo;
  actual Tabler icon assets, no fabricated testimonials or agent portrait.
- Copy/data: actual currencies, prices, descriptions, features and contact
  destinations. Sales use a working enquiry route because there are no supplied
  sale records. No mock prices or invented sale inventory.

## Functional evidence

- 21 offers / 21 separate static apartment routes / 174 gallery references.
- 165 original image/gallery files checked byte-for-byte against pre-redesign
  commit 8fa068b6fdc33ab450af54275ccbe5fba421adb2; no original photo removed.
- 867 internal links/resources checked; zero missing targets.
- Filtering by location, rental and budget; room/type filters; saved property
  toggle/persistence; empty state; navigation reset; translated RU/EN/KA layouts.
- Mobile widths 375, 390 and 430 CSS px tested; no horizontal content overflow.
- Property gallery: counter 1/9 -> 2/9, next/previous, close, zoom and keyboard.
- Search date/guest context reaches booking. Invalid blank booking displays
  labelled errors; valid dates produce a correct estimate.
- HTTPS form successfully received one synthetic enquiry. D1 record
  d90165ac-f022-471e-9758-30222dbe83c0, property orbi-d2, rental daily, status new,
  received 2026-10-30T15:50:21.409Z. It is marked TEST / not a client, not a booking.
- API/validation/marketing/admin-access tests pass; strict static UI audit has
  zero findings; DESIGN.md lint has zero errors (documentation-only unused-token
  warnings). Worker dry-run build passes.
- Console: initial HTTP-only preview crypto error fixed by a preview-only UUID
  adapter. HTTPS form uses native crypto. No new application error observed on
  HTTPS; browser-extension metadata errors are outside the application.

## Remaining test gaps and follow-up polish

- Physical iPhone, Safari/WebKit, real touch pinch and virtual keyboard have not
  been tested because this session exposes Chromium only. Phone-width checks
  are responsive-layout evidence, not a claim of device testing.
- Native search date/select popup styling follows the user's OS. Booking uses
  the existing localized authored calendar.
- Panorama and property interiors intentionally use real photographs instead
  of the mockup's fictitious interiors/skyline composition.
- Minor icon/logo differences use licensed assets rather than tracing a bitmap.

final result: passed

## Mobile navigation and favorites correction — 2026-10-30

- Open menu now replaces the hamburger with a visible close icon and translated accessible label; closes on in-page navigation, bottom navigation, outside click and Escape. Scrollable height is bounded on short screens.
- Favorites has its own heading, list, empty state, catalog return links and browser-storage explanation. Saved results ignore room, location and budget filters; no misleading rental-section empty states. Removing a saved card retains keyboard focus.
- Browser QA at 390 px: open/close state and visible X, navigation with menu open, empty → add → saved list → detail with persistent heart → list; API/admin/marketing tests passed. Existing 21 offers and backend were not changed.

- Logo / Home correction: brand icon and text now use a real root-page navigation, resetting the displayed search mode, filters and favorites view on return. The bottom Home action uses the same root URL. Browser check: long-term selected → logo icon → root with daily selected and all 21 original cards; favorites and detail → brand text → root.

## Hero simplification — user request

The main hero now contains only three direct navigation choices: daily rental, long-term rental and sale. Removed hero location, check-in date, guests, budget and search submit controls, together with their JS handlers. The separate booking forms and Batumi Calendar are unchanged.
