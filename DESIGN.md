---
version: alpha
name: Batumi House 3.0
description: A navy and gold real-estate catalogue, faithfully adapted from the approved desktop and phone composition.
colors:
  primary: '#071D30'
  ocean: '#0C304A'
  gold: '#D9AD65'
  background: '#FAF9F6'
  mist: '#EEF2F4'
  ink: '#152939'
  muted: '#60717D'
  surface: '#FFFFFF'
  danger: '#A93232'
typography:
  display:
    fontFamily: 'Georgia, Times New Roman, serif'
  sans:
    fontFamily: 'Arial, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans Georgian, sans-serif'
rounded:
  DEFAULT: '11px'
  control: '8px'
  dialog: '14px'
spacing:
  page-max: '1240px'
  desktop-gutter: '32px'
  mobile-gutter: '14px'
  card-gap: '19px'
components:
  primary-button:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
    height: '46px'
    rounded: '{rounded.control}'
  gold-button:
    backgroundColor: '{colors.gold}'
    textColor: '{colors.ink}'
    height: '46px'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.DEFAULT}'
---
# Batumi House 3.0

## Overview

The current user-approved reference is `9A059806-0EB9-48B6-9CFD-F884B9FD1D68.jpeg`.
It supersedes the earlier blue/white design. Scope is the public `batumihouse`
Worker, never the booking-operations calendar or another Worker.
The audience is renters and property buyers in Batumi, principally on phones.
Register: property brand catalogue with practical enquiry forms. RU/EN/KA remain.
The signature is a full-width evening panorama, editorial serif headline with a
gold middle line, and a white search panel overlapping the panorama.
The mockup's prices, interiors, agent portrait and proof claims are not inventory.
Existing property data and honest service copy override those sample contents.

Runtime owner: `images/bh3.css`; this file mirrors its `--navy`, `--ocean`,
`--gold`, `--ivory`, `--mist`, `--ink`, `--muted`, `--white`, `--danger` tokens.
Legacy CSS remains only on the existing booking page and archival photo route,
with this shared layer loaded last. `scripts/build-v3.py` owns deterministic
static rendering from `content/listings.json`; Worker/API logic is separate.

## Colors

Midnight Navy is navigation, prices and main actions. Deep Ocean is its secondary
surface. Royal Gold marks the headline emphasis, service icons and primary
conversion actions. Ivory is the page, Mist Grey a quiet field/feature surface.
White cards have a fine border and restrained shadow. Text and icons accompany
states; errors retain red text, field association and error summaries. No dark
mode is introduced. Forced-colors mode uses system colours and scrollbars.

## Typography

Georgia provides the large Cyrillic/Latin serif display and property headings;
Arial/system UI supports compact controls. Georgian uses the UI fallback stack
and increased line height. Phone form fields are 16px to avoid focus zoom.
Prices use tabular numerals. A faithful hierarchy and compact card rhythm matter
more than retaining the previous design's large whitespace.

## Layout

Desktop max width 1240px, 32px gutters; 4-column listing cards, then 2 at tablet
width and 1 below 600px. The panorama spans the page. A three-tab search sits on
its lower edge. Three image categories lead to daily, long-term and sale sections.
The phone retains the panorama, stacked search and three compact category tiles,
then large single-column cards and safe-area-aware bottom navigation.

Property pages are separately addressable static routes `/apartment/<slug>/`.
Desktop shows an enquiry sidebar. On phone, back/save/share controls overlay the
large photograph, followed by thumbnails, serif title, actual price, enquiry
button, known features, description, location and contact panel. Unknown data is
not filled in. The same real property can have daily/long-term offers.

## Elevation & Depth

Fine card borders and small shadows keep real photographs dominant. The search
panel is visibly raised. The photo viewer uses a native modal dialog. Darkening
overlay gradients protect text on the hero; they do not stand in for photographs.
Images reserve aspect ratios. No rotating background, autoplay video or entrance
animation is added.

## Shapes

Cards use 11px, fields/actions 8px and supporting panels 12–14px. Circular saved
and share controls mirror the reference. Icons use actual Tabler SVG files,
coloured through masks, with license retained. No handcrafted replacement art.

## Components

Primary actions are navy or gold; secondary links are quiet ocean text. Controls
have visible focus, hover, pressed and disabled treatment. Phone targets are
normally 44–48px. Native selects and search-date popup are deliberately owned by
the OS; the existing booking/enquiry date pickers stay authored and localized.

Search filters actual catalogue records by rental type, location and budget.
Room/type filters use only supplied data. Dates/guests are carried to enquiries;
without an availability/capacity dataset they never claim instant availability.
Sales have a working Telegram enquiry route, with no invented sale properties.
Saved property IDs stay in local browser storage; no contact information is
stored there. Gallery navigation and zoom work with pointer and keyboard.

The existing lead submission module, form identifiers, server-side validation,
D1 bindings, Telegram notifications and Access-protected admin API remain. The
HTTP-only local preview has an explicit UUID adapter and disabled API route;
production stays HTTPS and uses native crypto. Reduced motion is respected.

## Do's and Don'ts

- Preserve all 21 original offers, 174 gallery references, prices and descriptions.
- Keep old real photos and gallery JSON even when building optimized references.
- Preserve existing contact destinations, including the existing partner link.
- Label existing illustrative inventory imagery; never present it as a real photo.
- Use real known features; do not invent amenities, testimonials or verification.
- Do not modify Calendar, D1 records, retention, access controls or secrets.
- Do not publish main until the user confirms this review version.
