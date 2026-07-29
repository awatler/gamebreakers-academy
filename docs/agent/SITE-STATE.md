# Site state — Brooklyn Gamebreakers

Last updated: July 2026

## Stack

- React + Vite + Tailwind SPA
- Hosted on Vercel → **brooklyngamebreakers.com**
- GitHub: `awatler/gamebreakers-academy` (branch `main`)

## Routes

| Path | Page |
|---|---|
| `/` | Home — hero, mission, value cards, interest list modal |
| `/team` | Meet the Team |
| `/privacy` | Privacy (not in nav) |

## Interest list signup

- Modal: `src/components/InterestSignupModal.jsx`
- Auto-opens on first visit via `src/components/Layout.jsx` + `sessionStorage` key `interest-signup-dismissed`
- Reopen via `SignupModalContext` + hero **Keep Me Posted** button
- API: `api/subscribe.js` → Mailchimp, tag `Interest List - 2026`
- Local dev: Vite proxies `/api` to production (`vite.config.js`), so submissions hit
  the live audience. Use `MOCK_API=1 npm run dev` to mock the endpoint instead.

**Status:** The Saturday July 25th 2026 flag football clinic (Parade Grounds, Prospect
Park, Field #9) has happened. The hero now thanks attendees and the form collects
people who want to hear about future programming. Ages are still collected (required)
to plan age groups; target range 7–14, but the form does not hard-restrict ages.

## Key files

```
src/components/InterestSignupModal.jsx — interest list form UI
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
