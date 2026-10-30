# Visits and received enquiries

Cloudflare Web Analytics tracks page visits on the public main and booking pages. In the account dashboard open Web Analytics and select batumihouse.alexxstalkerxx.workers.dev. A Telegram handoff is not proof of receipt.

Both forms POST to /api/leads. A success notice appears only after D1 confirms the record. Submission does not reserve dates. Telegram messaging is optional and is never sent automatically.

To view enquiries, sign into the existing Cloudflare account, open Storage & databases → D1 → batumihouse-leads → Explore → leads. These records are not accessible through a public API. They are separate from batumi-calendar-db and do not change reservations or user roles. Cloudflare account permissions control access.

The records include the contact, dates, guest count, requests and an allowlisted marketing source. Contacts are not passed to marketing analytics. No IP addresses are stored in the leads database. A Cloudflare edge limiter uses the connecting IP transiently (10 attempts/minute per location; approximate, not a bot challenge). Request bodies are capped at 12 KB. There is no cross-origin API access and no public list/read/export route.

Records expire after 180 days through a daily scheduled cleanup. To remove a particular enquiry sooner, use the D1 dashboard to delete the matching row by its UUID. D1 disaster-recovery history follows the account's separate provider retention policy.

Initialize a new database with migrations/0001_leads.sql before deployment. wrangler.jsonc defines the database, limiter, assets and daily cleanup. Keep Worker source outside dist. The existing build command copies HTML and images; Wrangler bundles src/worker.mjs separately.

Checks: node tests/leads.test.mjs; node tests/marketing-attribution.test.cjs; npx wrangler deploy --dry-run after preparing dist. Test received enquiries with a synthetic contact, verify D1 receipt, and delete only the explicitly marked test rows.
