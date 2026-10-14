# Signup failure alerts

`api/subscribe.js` emails the team whenever a signup does not fully succeed, so a
parent who gets blocked can be followed up with by hand instead of being lost.

Alerts are off until `RESEND_API_KEY` and `ALERT_EMAIL_TO` are set — the code
silently skips sending, so nothing breaks without them.

## What triggers an email

| Reason | What happened |
|---|---|
| Mailchimp env vars are missing | Function deployed without its Mailchimp config |
| Mailchimp rejected the parent record | Usually a compliance/bounce block — the parent saw a raw Mailchimp error |
| Mailchimp rejected the *role* record | Same, for a Player / Coach / Community Partner signup |
| All N player records failed | Parent saved, no children did |
| N of M player records failed | Partial signup, returns `502` |
| Signup saved but the clinic tag failed | Contact exists but is **not** in the `Flag Football Clinic - Fall 2026` segment, so they are missing from the roster |
| Unhandled error during signup | Anything thrown — includes the stack |

Form validation errors (bad email format, missing age) do **not** send email. They
are the submitter's own typos and would bury the real failures.

Each email includes the role, name, email, phone, zip, and child names/ages, plus
the `SIGNUPID`, so the signup can be completed manually in Mailchimp.

The alert is also the **only** place Mailchimp's raw error text appears — parents
get friendly copy directing them to `info@brooklyngamebreakers.com` instead.

## Which Vercel project

This repo has been connected to more than one Vercel project. Variables added to
the wrong one deploy without error and silently do nothing — alerts just never
send. Before adding variables, open the project's **Settings → Domains** and
confirm `brooklyngamebreakers.com` is listed.

## Setup (free)

Resend's free tier covers 3,000 emails/month, far above what this site generates.

1. Create an account at [resend.com](https://resend.com) and add an API key.
2. **Sender domain:** either verify `brooklyngamebreakers.com` in Resend (add the
   DNS records in Squarespace, same place as the Vercel records in `DEPLOY.md`), or
   skip verification and leave `ALERT_EMAIL_FROM` unset to use Resend's shared
   `onboarding@resend.dev` sender.
3. In **Vercel → Project → Settings → Environment Variables**, add to Production:
   - `RESEND_API_KEY` — the key from step 1
   - `ALERT_EMAIL_TO` — where alerts go; comma-separate for several recipients
   - `ALERT_EMAIL_FROM` — optional, e.g. `Gamebreakers Alerts <alerts@brooklyngamebreakers.com>`
4. Redeploy — environment variables are only picked up by a new deployment.
5. Filter on the `[BGA signup alert]` subject prefix in your mail client.

## Checking what is configured in production

`GET /api/env-check?token=$ENV_CHECK_TOKEN` reports which variables reached the
running deployment. It returns presence only — never values — and 404s without the
token, so set `ENV_CHECK_TOKEN` in Vercel alongside the others.

## Testing it

Submit a real signup using an address that Mailchimp has marked unsubscribed or
cleaned. That reproduces the original failure and should produce one email.

Note that `MOCK_API=1 npm run dev` serves a local stub and never reaches this code,
and a plain `npm run dev` proxies to production — so local form testing does not
exercise alerting.

## What this does not cover

If the function itself is down or the deploy is broken, it cannot email about its
own failure. A free external uptime check (e.g. UptimeRobot) hitting the site every
few minutes covers that gap.
