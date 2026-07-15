# Site state — Brooklyn Gamebreakers

Last updated: July 2026

## Stack

- React + Vite + Tailwind SPA
- Hosted on Vercel → **brooklyngamebreakers.com**
- GitHub: `awatler/gamebreakers-academy` (branch `main`)

## Routes

| Path | Page |
|---|---|
| `/` | Home — hero, mission, value cards, clinic signup modal |
| `/team` | Meet the Team |
| `/privacy` | Privacy (not in nav) |

## Clinic signup (flag football)

- Modal: `src/components/PilotSignupModal.jsx`
- Auto-opens on first visit via `src/components/Layout.jsx` + `sessionStorage` key `clinic-signup-dismissed`
- Reopen via `SignupModalContext` + hero **Sign Up** button
- API: `api/subscribe.js` → Mailchimp
- Local dev: Vite proxies `/api` to production (`vite.config.js`)

**Clinic:** Saturday July 25th, 1PM–4:30PM, Parade Grounds Prospect Park Field #9, ages 7–14 (target; form does not hard-restrict ages).

## Key files

```
src/components/PilotSignupModal.jsx  — signup form UI
src/components/Layout.jsx            — modal auto-open
src/context/SignupModalContext.jsx
api/subscribe.js                     — Mailchimp integration
api/env-check.js                     — debug Mailchimp env (production)
MAILCHIMP-SETUP.md                   — Mailchimp dashboard setup guide
docs/agent/MAILCHIMP-SIGNUP.md       — data model + conventions
```

## Brand

- Tokens in `src/index.css`, `tailwind.config.js`
- Green `#1D9E75`, amber `#F59E0B`, seafoam `#E8F7F2`
- Fonts: Oswald (display), DM Sans (body), Barlow Condensed (utility)

## Deploy

Push to `main` → Vercel auto-deploys. Do not push unless user asks.
