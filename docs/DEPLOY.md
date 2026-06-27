# Deployment Guide — Gamebreakers Academy

This guide covers the full deployment pipeline for this project:
**GitHub → Vercel → Custom Domain (brooklyngamebreakers.com via Squarespace DNS)**

---

## Project Stack

- **Framework:** React + Vite (not Next.js)
- **Hosting:** Vercel
- **Live Vercel URL:** https://gamebreakers-academy-s68c.vercel.app/
- **Custom Domain:** brooklyngamebreakers.com
- **Domain Registrar:** Squarespace
- **GitHub Repo:** https://github.com/awatler/gamebreakers-academy

---

## 1. Pushing Code Changes to GitHub

Every deployment starts with a push to the `main` branch on GitHub:

```bash
git add .
git commit -m "your commit message"
git push origin main
```

If the Vercel project is connected to GitHub (see Section 2), a push to `main`
automatically triggers a new Vercel deployment — no manual steps needed.

---

## 2. Connecting GitHub to Vercel

> Skip this section if the project is already linked (check Vercel dashboard → Project → Settings → Git).

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New → Project**.
3. Select **Import Git Repository** and choose `awatler/gamebreakers-academy`.
4. Leave all build settings at defaults — Vercel auto-detects Vite:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**.

Once linked, every push to `main` deploys automatically.

---

## 3. Adding a Custom Domain in Vercel

1. Open the Vercel dashboard → **gamebreakers-academy** project.
2. Go to **Settings → Domains**.
3. Type `brooklyngamebreakers.com` and click **Add**.
4. Also add `www.brooklyngamebreakers.com` if you want the `www` subdomain to redirect.
5. Vercel will display the DNS records you need to add — copy them (they match Section 4 below).

---

## 4. DNS Records to Add in Squarespace

Log in to Squarespace → **Domains** → `brooklyngamebreakers.com` → **DNS Settings**.

Add the following records:

### Root domain (`brooklyngamebreakers.com`)

| Type | Host / Name | Value | TTL |
|------|-------------|-------|-----|
| A    | `@`         | `76.76.21.21` | 3600 (or Auto) |

> Vercel's A record IP for the root domain is `76.76.21.21`.

### www subdomain (optional, for redirect)

| Type  | Host / Name | Value                  | TTL |
|-------|-------------|------------------------|-----|
| CNAME | `www`       | `cname.vercel-dns.com` | 3600 (or Auto) |

> If Squarespace already has default A records for `@`, delete them before adding the Vercel one.
> Squarespace may also have a CNAME for `www` pointing to itself — replace it with the Vercel value above.

---

## 5. Verifying the Domain

1. After saving DNS records in Squarespace, return to **Vercel → Settings → Domains**.
2. Vercel will show the domain status. It may say **"Invalid Configuration"** for a few minutes while DNS propagates — this is normal.
3. Once verified, Vercel automatically provisions a **free SSL certificate** (HTTPS) via Let's Encrypt.
4. You can click **Refresh** in the Vercel domains panel to check status.

---

## 6. DNS Propagation

- **Typical time:** 15 minutes – 2 hours for Squarespace DNS
- **Maximum (worst case):** Up to 48 hours globally
- **How to check:** Run this in your terminal:

```bash
dig brooklyngamebreakers.com +short
# Should return: 76.76.21.21
```

Or use [dnschecker.org](https://dnschecker.org) to check propagation worldwide.

---

## 7. Codebase — No Changes Required

The following were verified as of the initial domain setup:

- **No hardcoded `vercel.app` URLs** in the codebase (confirmed via search).
- **No `next.config.js`** — this is a Vite app, not Next.js.
- **`vite.config.js`** requires no domain-specific changes.
- **No `.env` files** — no environment variables currently in use.
- **GitHub repo** requires no changes to support the custom domain.

If you later add environment variables (e.g. for an API), add them in:
**Vercel → Project → Settings → Environment Variables**
(not in a `.env` file committed to git).

---

## 8. Quick Reference — Deployment Checklist

```
[ ] Make code changes locally
[ ] npm run dev → verify at http://localhost:5173
[ ] git add . && git commit -m "message" && git push origin main
[ ] Vercel auto-deploys from main branch (check dashboard for status)
[ ] Visit https://brooklyngamebreakers.com to confirm live
```

---

## 9. Useful Links

| Resource | URL |
|---|---|
| Vercel Dashboard | https://vercel.com/dashboard |
| Vercel Project | https://gamebreakers-academy-s68c.vercel.app |
| GitHub Repo | https://github.com/awatler/gamebreakers-academy |
| Squarespace Domains | https://account.squarespace.com/domains |
| DNS Checker | https://dnschecker.org |
