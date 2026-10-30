# BatumiHomeLeadsBot: website shortcut rollout

GitHub Worker: `src/worker.mjs`, Cloudflare Worker: `batumihouse`.
Bot: `@BatumiHomeLeadsBot` (NOT BatumiKalendar).
Site: `https://batumihouse.alexxstalkerxx.workers.dev/`.

## Implemented in code
1. New incoming lead notification includes inline `🏠 Открыть Batumi House` website button.
2. `POST /api/telegram-webhook` understands `/site` and `/start` for the admin chat and replies with an inline website button.
3. The webhook rejects requests unless `X-Telegram-Bot-Api-Secret-Token` matches `TELEGRAM_WEBHOOK_SECRET` configured as a Cloudflare Secret. It ignores other chats.
4. Existing /api/leads, /api/admin and Telegram lead messages are unchanged.

## Work release actions
- Create a high-entropy random secret (valid Telegram secret_token characters A-Za-z0-9_- length 1–256), save as `TELEGRAM_WEBHOOK_SECRET` on Worker `batumihouse`. Never print tokens/secrets or commit to git.
- Build+deploy latest GitHub source, preserving D1, LEAD_LIMITER, Access credentials and existing Telegram secrets.
- From a trusted execution environment with secret access, invoke Telegram Bot API `setWebhook` for this bot: URL `https://batumihouse.alexxstalkerxx.workers.dev/api/telegram-webhook`, `secret_token` matches Worker secret, `allowed_updates: ["message"]`, `drop_pending_updates:false`. Do not leak bot token into URLs in logs or user messages.
- Invoke Telegram `setMyCommands` with `[{command:"site",description:"🏠 Открыть Batumi House"}]`, optionally `start` as well.
- Optionally use `setChatMenuButton` for a permanent website button; verify this does not disrupt a separately configured calendar bot. Bot in scope is @BatumiHomeLeadsBot only.
- Test: /site in bot returns a button; new lead message contains website button; existing Telegram notifications and D1 work. Deny unsigned webhook requests (403). Confirm no secrets in responses.
- Inform user exactly what was verified and what remains.

Do not attempt webhook call without a securely provided token. Do not modify @BatumiKalendar or calendar Workers.
