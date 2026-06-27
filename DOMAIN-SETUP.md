# Domain Setup Checklist — brooklyngamebreakers.com

Follow these steps in order. Check each box as you go.

---

## Part 1 — Vercel: Add the Custom Domain

- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Open the **gamebreakers-academy** project
- [ ] Click **Settings** → **Domains**
- [ ] Type `brooklyngamebreakers.com` and click **Add**
- [ ] Vercel will display the DNS records you need — confirm you see an **A record** with value `216.198.79.1`

---

## Part 2 — Squarespace: Configure DNS

- [ ] Log into [account.squarespace.com](https://account.squarespace.com)
- [ ] Click **Domains** in the left sidebar
- [ ] Click **brooklyngamebreakers.com**
- [ ] Click **DNS Settings** (or **Advanced DNS**)

### Delete conflicting Squarespace default records

- [ ] Delete any **A records** pointing `@` to Squarespace IPs:
  - `198.185.159.144`
  - `198.185.159.145`
  - `198.49.23.144`
  - `198.49.23.145`
- [ ] Delete any **CNAME on `@`** (you can't have both an A and CNAME on the root)
- [ ] Delete any **Squarespace parking page or coming-soon CNAME**

> Leave MX records and any TXT/SPF records alone — those are for email and unrelated.

### Add the Vercel A record

- [ ] Click **Add Record**
- [ ] Fill in:

  | Field | Value |
  |---|---|
  | Type | `A` |
  | Host | `@` |
  | Value | `216.198.79.1` |
  | TTL | `3600` (or Auto) |

- [ ] Click **Save**

---

## Part 3 — Back in Vercel: Confirm Configuration

- [ ] Return to **Vercel → Settings → Domains**
- [ ] Wait a few minutes, then refresh
- [ ] Confirm `brooklyngamebreakers.com` shows a green **Valid Configuration** badge

> If it still shows "Invalid" after 10 minutes, double-check that the old Squarespace A records were deleted and that your A record value is exactly `216.198.79.1`.

---

## Part 4 — Verify DNS Propagation

DNS propagation typically takes **15 minutes to 2 hours** with Squarespace (max 48 hours).

- [ ] Go to [dnschecker.org](https://dnschecker.org), enter `brooklyngamebreakers.com`, select **A**, and click Search
- [ ] Watch for green checkmarks filling in globally

Or run this in your terminal to check locally:

```bash
dig brooklyngamebreakers.com A +short
```

- [ ] Confirm the result returns `216.198.79.1`

---

## Part 5 — Verify SSL / HTTPS

Vercel auto-provisions a free Let's Encrypt SSL certificate once DNS propagates. No action needed on your end.

- [ ] Return to **Vercel → Settings → Domains**
- [ ] Confirm the domain shows an SSL certificate expiry date (e.g. "Expires in 89 days")
- [ ] Open [https://brooklyngamebreakers.com](https://brooklyngamebreakers.com) in your browser
- [ ] Confirm the padlock icon is present and the site loads correctly

---

## Done!

Once all boxes are checked, `https://brooklyngamebreakers.com` is fully live. The old Vercel preview URL (`gamebreakers-academy-s68c.vercel.app`) will continue to work in parallel — Vercel keeps all preview URLs active indefinitely.
