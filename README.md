# Gamebreakers Academy

High-fidelity multipage React prototype for **Gamebreakers Leagues** — *Built for Brooklyn.*

## Tech Stack

- **Vite** + **React 18**
- **Tailwind CSS** (Brooklyn Heritage design system)
- **Lucide React** (icons)
- **React Router** (client-side routing)

## Design System (Brooklyn Heritage)

- **Primary:** `#1B2F1F` (Forest)
- **Secondary:** `#FDFCF8` (Cream)
- **Accent:** `#000000` (Matte Black)
- **Borders:** `#E5E5E1`
- **Typography:** Inter Tight (headers), Inter (body)
- **UI:** 4px border-radius, subtle grain overlay, 1px borders
- **Animation:** Ease-in-out transitions

## Project Structure

```
gamebreakers-academy/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── Navbar.jsx
│   ├── data/
│   │   └── leagues.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Leagues.jsx
│   │   ├── LeagueDetail.jsx
│   │   └── Team.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Monitoring & alerts

Failed clinic signups email the team within seconds so a blocked parent can be
followed up with by hand — full setup and triggers in [`docs/ALERTS.md`](docs/ALERTS.md).

Two things to know before touching this:

- **Parents never see raw Mailchimp errors.** Its text ("in a compliance state due
  to unsubscribe, bounce, or compliance review") is meaningless to them and reads
  like their fault. `api/subscribe.js` returns friendly copy pointing at
  `info@brooklyngamebreakers.com`; the raw detail goes to the alert email instead.
- **Environment variables belong to the Vercel project that owns
  `brooklyngamebreakers.com`.** Confirm via Settings → Domains before adding any.
  Variables set on the wrong project deploy fine and silently do nothing.

Check what actually reached production with
`GET /api/env-check?token=$ENV_CHECK_TOKEN` — presence only, never values, and
404s without the token.

## Run Locally

```bash
cd gamebreakers-academy
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Pages

- **Home** — Hero (“Gamebreakers Leagues. Built for Brooklyn.”) + lead capture for Summer ’26 Pilot.
- **Leagues** — Tournament & League Finder with mock leagues (Bushwick Open, Fort Greene 3v3, Williamsburg Social). Cards show Status, Vibe Tag, and “View Details.”
- **Leagues/:id** — League detail view with description and Register / Join Waitlist.
- **Meet the Team** — 8-person Super-Team grid (Name, Title, Primary Goal).

Responsive, mobile-first, with hover states on buttons and nav links.

## Stock photos (prototype)

All imagery is from **Unsplash** (unsplash.com), free under the [Unsplash License](https://unsplash.com/license). No account or attribution required.

- **Hero (Home):** Basketball game — `photo-1574629810360-7efbbe195018`
- **Leagues:** Flag football (Bushwick Open), basketball (Fort Greene 3v3), outdoor team/social (Williamsburg Social) — IDs in `src/data/images.js`
- URLs are loaded via Unsplash CDN (`images.unsplash.com`); no local assets or downloads needed.
