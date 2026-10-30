---
version: alpha
name: Batumi House
description: Blue and white apartment catalogue for renting a home in Batumi.
colors:
  primary: "#034FF5"
  primary-hover: "#0340C6"
  ink: "#0F172A"
  secondary: "#475569"
  border: "#E2E8F0"
  background: "#F8FAFC"
  surface: "#FFFFFF"
  soft: "#EFF6FF"
  danger: "#B42318"
typography:
  sans:
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans Georgian", Arial, sans-serif'
rounded:
  DEFAULT: "18px"
  control: "12px"
  hero: "30px"
spacing:
  page-max: "1180px"
  page-gutter: "22px"
  mobile-gutter: "16px"
  card-gap: "20px"
components:
  button:
    height: "46px"
  card:
    rounded: "18px"
  input:
    height: "48px"
---

# Batumi House Design System

## Overview

The approved reference is `batumi-house-design-preview.html` (30 October 2026).
This release applies its public website design to the real catalogue and enquiry
page. The separate property management calendar is outside this release.
Renters compare actual homes, inspect photos, then contact Alexey or submit an
enquiry. The primary usage scene is a phone in Batumi. RU, EN and KA remain
available. Register: a property brand with a practical booking form.

The signature is a sea-view photograph beside a strong ink-and-blue headline.
White cards and quiet grey copy keep the photos and prices prominent. Avoid dark
navy section bands, decorative gradients, fictitious inventory and demo actions.

Runtime ownership: `images/approved-design.css` is the canonical visual layer,
loaded last on both routes. The frontmatter mirrors its `--bh-*` tokens. Existing
`--green`, `--green2`, `--ink`, `--type-ink`, `--muted`, `--type-muted`, `--line`,
`--cream` and `--accent` variables are compatibility aliases, not another palette.
`images/editorial.css` owns the system font stack. Legacy structural CSS is kept
to preserve gallery, form and modal behaviour; the approved layer wins for style.

## Colors

Primary blue means an action or price; the darker blue is its hover state. Ink
is for headings, secondary slate for readable supporting text. White surfaces
sit on the pale background with a border and restrained shadow. Selection and
focus use blue; error messages retain text and use danger red. Light theme only.
Forced-colors mode keeps system focus and scrollbars operable.

## Typography

Use the device system stack with Georgian-capable fallbacks, no downloaded font.
Display: 34–58px, weight 800, tight tracking. Section headings: 28–38px. Card
headings: 18px. Form inputs: at least 16px to prevent iOS focus zoom. Supporting
listing copy: 14px, line-height 1.75. Preserve Georgian line-height and wrapping.
Prices use lining tabular numerals from the existing typography layer.

## Layout

Maximum content width is 1180px, with 22px desktop and 16px phone gutters.
The hero is a two-column composition; below 850px the photograph comes first.
Listings use 3 columns on desktop, 2 on tablet and 1 below 600px. No inventory is
hidden or shortened to imitate the prototype. Filters keep the existing price,
room and property-type behaviour; area fields remain removed.

The header stays sticky, with a two-link rental switch on phones. Native select
popups are deliberately platform-owned. The booking form scrolls naturally with
the document; its long fields and submission button must remain reachable.
Safe-area insets protect floating contact and photo-viewer controls. Global
scrollbars use slate thumb and pale track, with hover and active states.

## Elevation & Depth

Cards have a fine border and `0 5px 25px #0F172A08` shadow. Stronger elevation
belongs to photo captions and modal layers. Avoid large hover movements and
image zoom on cards. Photos reserve their aspect ratio to prevent layout shifts.

## Shapes

Cards and forms: 18px corners. Buttons and fields: 11–12px. Hero image: 30px,
24px on phone. Pills are reserved for photo labels. The circular Telegram action
keeps the recognised Telegram SVG.

## Components

Primary buttons: solid blue/white, darker hover, visible focus, stable busy
geometry. Secondary buttons: pale blue with blue text. Disabled controls remain
non-interactive. The details button is full width and visually secondary.

Reuse the existing `listing-ux.js` details overlay, `photoViewer` gallery,
`booking-validation.js` calendar/validation, `lead-submit.js` submission and
`localization.js` language switching. The date picker remains authored and
localized. Error summaries, invalid fields and server-confirmed success remain
owned by those implementations; this release changes their visual treatment.
It never inserts demo alerts or replaces real actions with prototype buttons.

Photo thumbnails retain horizontal scrolling. Viewer arrows, close, zoom and
counts remain available. Motion only supports feedback and respects reduced
motion. CSS is shared between catalogue and booking to keep controls consistent.

## Do's and Don'ts

- Preserve every listing, photo, price, address and booking destination.
- Keep all controls usable with touch and visible keyboard focus.
- Maintain the same palette and shapes on catalogue, details and booking pages.
- Do not change Worker APIs, database schema, secrets, access rules or retention.
- Do not claim that a submitted enquiry reserves dates.
- Do not reintroduce removed area filters or fictitious prototype records.
