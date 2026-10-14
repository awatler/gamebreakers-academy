# Mailchimp signup — data model & conventions

Last updated: October 2026 — Fall Clinic registrations (child names)

## Current purpose

The form and API register people for the **Fall 2026 flag football clinic**
(Saturday, October 24th). New signups receive **only** the tag
`Flag Football Clinic - Fall 2026`. The parent + child data model below is unchanged.

## Architecture decision (do not regress)

**Parent + child headcount model** — chosen after per-child-only and subaddressing approaches caused campaign and deliverability problems.

| Record | Mailchimp email | ROLE | Purpose |
|---|---|---|---|
| Parent | Parent's **real email** | `Parent` | Campaigns, contact info, **CHLDAGES** summary |
| Each child | `clinic-{hash}-{N}@brooklyngamebreakers.com` | `Player` | Child name + age — **do not email** |

- `{hash}` = first 8 chars of MD5(parent email)
- `N` = 1-based child index within signup
- Tag on **both** parent and child rows: `Flag Football Clinic - Fall 2026` only
  (do not also apply `Interest List - 2026`)
- The `clinic-` alias prefix is intentionally unchanged — renaming it would create
  duplicate child rows for parents who already signed up, and would break campaign
  segments that exclude addresses containing `clinic-`

## Form behavior (`InterestSignupModal.jsx`)

**Parent role:**
- Repeatable rows with **child name + age** (1–5 children)
- Payload: `{ role: "Parent", children: [{ name: "Maya Lee", age: "9" }, ...], name, email, phone, zip }`

**Player role:**
- Single age field, one record at their real email (`FNAME`/`LNAME` = their own name)

**Coach / Community Partner:**
- No age fields

Age validation: integers 1–99 (not restricted to 7–14). Child/player name is optional; age is required.

On a successful submit the form fires a GA4 `generate_lead` event via
`src/lib/analytics.js` with `method`, `role`, and `child_count`. Never add names,
emails, phone numbers, or ages to that payload — Google prohibits PII.

## API flow (`api/subscribe.js`)

For `role === "Parent"`:

1. Upsert **parent** at real email (`FNAME`/`LNAME` = parent name, `ROLE: Parent`, `CHCOUNT`, `CHLDAGES`, `SIGNUPID`)
2. Apply Fall Clinic tag to parent
3. For each child: upsert **child alias** with **child** `FNAME`/`LNAME` (split from child name), `ROLE: Player`, `AGE`, `PEMAIL`, `PNAME` (parent name), `CHINDEX`, `CHCOUNT`, `SIGNUPID`
4. Apply Fall Clinic tag to each child
5. Partial failure returns `502` if some children fail after parent succeeds

For other roles: single upsert at submitter email (unchanged).

**No new Mailchimp merge fields are required for child names** — they use built-in
`FNAME` / `LNAME` on the child/Player rows. Parent name remains on the parent
row and in `PNAME` on child rows.

## Mailchimp merge fields

**Tags must be ≤ 10 characters.** Do not use `PARENT_EMAIL`, `PARENT_EMAI`, `CHILD_INDEX`, etc.

| Label | Merge tag | Used on |
|---|---|---|
| Role | `ROLE` | All |
| Age | `AGE` | Player rows, child aliases |
| Parent Email | `PEMAIL` | Child rows |
| Parent Name | `PNAME` | Child rows |
| Child Index | `CHINDEX` | Child rows (number) |
| Child Count | `CHCOUNT` | Parent + child rows (number) |
| Child Ages | `CHLDAGES` | Parent row only — e.g. `9, 11, 13` |
| Signup ID | `SIGNUPID` | Parent + child rows — UUID batch link |

Built-in: `FNAME`, `LNAME`, `PHONE`, `ZIP`.

- Parent rows: `FNAME`/`LNAME` = parent name
- Child/Player alias rows (going forward): `FNAME`/`LNAME` = **child** name when provided
  (Player Name is optional; age is required). If name is omitted on a re-signup, existing
  `FNAME`/`LNAME` on that child row are left unchanged.
- Older child alias rows may still show the parent's name in `FNAME`/`LNAME` — no backfill

Constants in code: `MERGE` object in `api/subscribe.js`.

## Campaigns vs counts

**Email campaigns:** segment `ROLE = Parent` OR exclude `Email Address` contains `clinic-`

**Fall clinic (current):** rows tagged `Flag Football Clinic - Fall 2026`

**Interest list (historical):** rows tagged `Interest List - 2026` — stay-informed
period between clinics; that tag is no longer applied to new signups

**July clinic attendees:** rows tagged `Flag Football Clinic - July 2026` (historical —
that tag is no longer applied to new signups)

**Age counts / roster:** count rows where `ROLE = Player` (child alias rows). New
signups show the child's name in `FNAME`/`LNAME`.

**View all ages for a family:** parent row `CHLDAGES`, or filter child rows by matching `PEMAIL` / `SIGNUPID`

## Env vars (Vercel)

- `MAILCHIMP_API_KEY`
- `MAILCHIMP_SERVER_PREFIX` (e.g. `us21`)
- `MAILCHIMP_AUDIENCE_ID`
- `RESEND_API_KEY`, `ALERT_EMAIL_TO`, `ALERT_EMAIL_FROM` (optional) — failure alerts

Debug: `GET /api/env-check` on production (keys present, not values).

## Failure alerts

`notifyFailure` in `api/subscribe.js` emails the team on every non-success exit —
Mailchimp rejections, partial child failures, tag failures, and unhandled errors —
so a blocked parent can be followed up with manually. Validation errors are
deliberately excluded. Any new early-return failure path should call it. See
`docs/ALERTS.md`.

## Known legacy data

Early multi-child tests created `clinic-*` rows **without** a parent row at the real email. Safe to archive/delete those test contacts manually. New signups follow parent + children model.

**Cleaned clinic aliases:** `clinic-*` addresses are not real mailboxes. If Mailchimp
ever emailed them they bounce and become `cleaned` / compliance-blocked. Returning
parents then hit errors if we force `status: "subscribed"` on those child rows.
`upsertChildAlias` in `api/subscribe.js` updates merge fields / tags while keeping
the existing status — do not reintroduce a forced subscribe on child aliases.

## Changing this system

Before editing merge tags or email strategy:
1. Update `MERGE` in `api/subscribe.js`
2. Update Mailchimp audience fields to match exactly
3. Update `MAILCHIMP-SETUP.md` and this file
4. Test: 1-child parent, 3-child parent, player self-signup

Test locally with `MOCK_API=1 npm run dev` — a plain `npm run dev` proxies `/api` to
production and writes real contacts to the live audience.
