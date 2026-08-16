# Mailchimp signup — data model & conventions

Last updated: July 2026 — post-clinic interest list

## Current purpose

The July 2026 flag football clinic is over. The same form and API now collect an
ongoing **interest list** of people who want to hear about future programming.
Only the tag changed; the parent + child data model below is unchanged.

## Architecture decision (do not regress)

**Parent + child headcount model** — chosen after per-child-only and subaddressing approaches caused campaign and deliverability problems.

| Record | Mailchimp email | ROLE | Purpose |
|---|---|---|---|
| Parent | Parent's **real email** | `Parent` | Campaigns, contact info, **CHLDAGES** summary |
| Each child | `clinic-{hash}-{N}@brooklyngamebreakers.com` | `Player` | Age counts only — **do not email** |

- `{hash}` = first 8 chars of MD5(parent email)
- `N` = 1-based child index within signup
- Tag on **both** parent and child rows: `Interest List - 2026`
- The `clinic-` alias prefix is intentionally unchanged — renaming it would create
  duplicate child rows for parents who already signed up, and would break campaign
  segments that exclude addresses containing `clinic-`

## Form behavior (`InterestSignupModal.jsx`)

**Parent role:**
- Repeatable child age rows (1–5 children)
- Payload: `{ role: "Parent", children: [{ age: "9" }, ...], name, email, phone, zip }`

**Player role:**
- Single age field, one record at their real email

**Coach / Community Partner:**
- No age fields

Age validation: integers 1–99 (not restricted to 7–14).

On a successful submit the form fires a GA4 `generate_lead` event via
`src/lib/analytics.js` with `method`, `role`, and `child_count`. Never add names,
emails, phone numbers, or ages to that payload — Google prohibits PII.

## API flow (`api/subscribe.js`)

For `role === "Parent"`:

1. Upsert **parent** at real email (`ROLE: Parent`, `CHCOUNT`, `CHLDAGES`, `SIGNUPID`)
2. Apply interest tag to parent
3. For each child: upsert **child alias** (`ROLE: Player`, `AGE`, `PEMAIL`, `PNAME`, `CHINDEX`, `CHCOUNT`, `SIGNUPID`)
4. Apply interest tag to each child
5. Partial failure returns `502` if some children fail after parent succeeds

For other roles: single upsert at submitter email (unchanged).

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

Constants in code: `MERGE` object in `api/subscribe.js`.

## Campaigns vs counts

**Email campaigns:** segment `ROLE = Parent` OR exclude `Email Address` contains `clinic-`

**Interest list:** rows tagged `Interest List - 2026`

**July clinic attendees:** rows tagged `Flag Football Clinic - July 2026` (historical —
that tag is no longer applied to new signups)

**Age counts:** count rows where `ROLE = Player` (child alias rows only)

**View all ages for a family:** parent row `CHLDAGES`, or filter child rows by matching `PEMAIL` / `SIGNUPID`

## Env vars (Vercel)

- `MAILCHIMP_API_KEY`
- `MAILCHIMP_SERVER_PREFIX` (e.g. `us21`)
- `MAILCHIMP_AUDIENCE_ID`

Debug: `GET /api/env-check` on production (keys present, not values).

## Known legacy data

Early multi-child tests created `clinic-*` rows **without** a parent row at the real email. Safe to archive/delete those test contacts manually. New signups follow parent + children model.

## Changing this system

Before editing merge tags or email strategy:
1. Update `MERGE` in `api/subscribe.js`
2. Update Mailchimp audience fields to match exactly
3. Update `MAILCHIMP-SETUP.md` and this file
4. Test: 1-child parent, 3-child parent, player self-signup

Test locally with `MOCK_API=1 npm run dev` — a plain `npm run dev` proxies `/api` to
production and writes real contacts to the live audience.
