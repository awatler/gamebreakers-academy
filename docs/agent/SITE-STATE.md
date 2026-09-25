# Site state — Brooklyn Gamebreakers

Last updated: August 2026

## Stack

- React + Vite + Tailwind SPA
- Hosted on Vercel → **brooklyngamebreakers.com**
- GitHub: `awatler/gamebreakers-academy` (branch `main`)

## Routes

| Path | Page |
|---|---|
| `/` | Home — hero, mission, value cards, interest list modal |
| `/summer-clinic-2026` | Summer Clinic 2026 — recap copy + 27-photo gallery with lightbox |
| `/team` | Meet the Team |
| `/privacy` | Privacy (footer only) |

## Interest list / clinic signup

- Modal: `src/components/InterestSignupModal.jsx`
- Auto-opens on first visit via `src/components/Layout.jsx` + `sessionStorage` key `interest-signup-dismissed`
- Suppressed on the pages in `NO_AUTO_OPEN_PATHS` (`Layout.jsx`) — currently the clinic
  gallery, where a popup would cover the photos a visitor came to see. Those pages carry
  their own CTA instead
- Reopen via `SignupModalContext` + hero **Sign Up** button
- API: `api/subscribe.js` → Mailchimp, tag `Flag Football Clinic - Fall 2026` only

**Status:** Fall flag football clinic is live — **Saturday, October 24th, 2026**,
3PM–6PM, Prospect Park Parade Grounds Field #5. Hero and signup modal show Fall Clinic
details. New Mailchimp signups get **only** the Fall Clinic tag.

## Analytics

- GA4 property `G-Q4WXCF6CS7`, `gtag.js` snippet in `index.html`
- Page views on route changes come free from enhanced measurement — no manual pageview calls
- Custom events go through `src/lib/analytics.js`:
  - `generate_lead` on successful signup (`method`, `role`, `child_count`)
  - `select_content` on opening a gallery photo (`content_type: clinic_photo`, `item_id`: slug)
- **Never** send names, emails, phone numbers, or ages — Google prohibits PII

## Clinic gallery

- Photos live in `public/images/clinic-2026/{thumb,full}/`, metadata in `src/data/clinicGallery.js`
- Regenerate from local originals with `node scripts/build-clinic-gallery.mjs` (reads `Clinic Pics/`,
  which is gitignored and local-only)
- Alt text describes the moment and never names a child — families consented to photos, not to
  their kids being identifiable by name

## Key files

```
src/components/InterestSignupModal.jsx — interest list form UI
src/components/Layout.jsx            — modal auto-open + per-page suppression
src/context/SignupModalContext.jsx
src/lib/analytics.js                 — GA4 event wrapper
src/pages/SummerClinic.jsx           — clinic recap page
src/components/PhotoLightbox.jsx     — gallery lightbox
scripts/build-clinic-gallery.mjs     — image optimization for the gallery
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
