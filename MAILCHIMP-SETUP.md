# Mailchimp Integration Guide — Brooklyn Gamebreakers

Step-by-step instructions for connecting the Flag Football Clinic registration form to Mailchimp.

---

## The big picture

When someone clicks **"Let's do it!"** on the site:

1. The browser sends form data to a **Vercel API route** (`/api/subscribe`)
2. The API route calls Mailchimp with your secret API key
3. Mailchimp adds or updates the contact in your audience
4. The site shows **"You're in!"**

**Why we can't connect Mailchimp directly from the browser:** the site is a React app on Vercel with no backend today. Mailchimp requires a secret **API key**. If that key lives in frontend code, anyone can steal it. A small **Vercel serverless function** holds the secret and talks to Mailchimp for you.

**Form fields collected today:**

| Field | Required |
|---|---|
| Name | Yes |
| Email | Yes |
| Phone | Yes |
| Role (Parent / Player / Coach / Community Partner) | Yes |
| Age | Yes, only when Role = Player |
| Zip Code | Optional |

These map to Mailchimp **merge fields** (custom contact properties).

---

## Part 1 — Create your Mailchimp account

**Time: ~5 minutes**

1. Go to [mailchimp.com](https://mailchimp.com) and click **Sign Up Free**.
2. Use an email you check regularly.
3. Choose the **Free** plan (up to **500 contacts**).
4. Complete onboarding:
   - Business name: **Brooklyn Gamebreakers**
   - Industry: Sports / Youth programs
5. Verify your email when Mailchimp sends the confirmation link.

**Checkpoint:** You can log into the Mailchimp dashboard.

---

## Part 2 — Create your audience (mailing list)

1. Click **Audience** → **Audiences** (or **All contacts**).
2. Create a new audience or use the default:
   - **Audience name:** `Brooklyn Gamebreakers`
   - **Default from email:** e.g. `hello@brooklyngamebreakers.com`
   - **Default from name:** `Brooklyn Gamebreakers`
   - **Reminder:** "You signed up for Brooklyn Gamebreakers programs"
   - Complete the required address fields (anti-spam law)
3. Click **Save**.

**Checkpoint:** You have one audience. Note its name — you'll need the **Audience ID** later.

---

## Part 3 — Configure merge fields

Mailchimp always has **Email Address**. Everything else is stored in **merge fields**.

1. Go to **Audience** → **Audiences** → click your audience.
2. Click **Settings** → **Audience fields and *|MERGE|* tags**.
3. Confirm or add these fields:

| Form field | Mailchimp merge tag | Type |
|---|---|---|
| Name | **FNAME** + **LNAME** (split on first space) | Text |
| Phone | **PHONE** | Phone |
| Role | **ROLE** (custom) | Text |
| Age | **AGE** (custom) | Number or Text |
| Zip Code | **ZIP** or **ZIPCODE** | Text |

To add a custom field: **Add A Field** → choose type → label `Role` → tag becomes `ROLE`.

**Write down your merge tags** — code must use them exactly (all caps).

---

## Part 4 — Double opt-in decision

In audience **Settings**, find **Double opt-in**:

- **ON:** subscriber gets a "Confirm your email" message; status is **Pending** until they click.
- **OFF:** they're added instantly as **Subscribed**.

For a **clinic registration form**, many teams turn **double opt-in OFF** so parents aren't confused by a second email.

**Checkpoint:** You've chosen ON or OFF and know what to expect when testing.

---

## Part 5 — (Optional) Create a tag for this event

1. Go to **Audience** → **Tags**.
2. Click **Create Tag**.
3. Name: `Flag Football Clinic - July 2026`

We'll apply this tag automatically when someone submits the form.

---

## Part 6 — Get your API credentials

### 6a. API Key

1. Profile icon → **Account & billing** → **Extras** → **API keys**
   - Or: [admin.mailchimp.com/account/api](https://admin.mailchimp.com/account/api/)
2. Click **Create A Key**.
3. Name: `Brooklyn Gamebreakers Website`
4. Copy the key — looks like: `1a2b3c4d5e6f7g8h9i0j-us21`
5. The suffix after the hyphen (`us21`) is your **server prefix**.

**Never paste this key into React code or commit it to GitHub.**

### 6b. Audience ID

1. **Audience** → **Audiences** → your audience.
2. **Settings** → **Audience name and defaults**.
3. Copy **Audience ID** (10 characters, e.g. `a1b2c3d4e5`).

**Checkpoint:** Save these three values securely:

```
MAILCHIMP_API_KEY=xxxxxxxx-us21
MAILCHIMP_SERVER_PREFIX=us21
MAILCHIMP_AUDIENCE_ID=a1b2c3d4e5
```

---

## Part 7 — Add a Vercel serverless function

Since you're on **Vercel**, add one API file at the project root:

**`api/subscribe.js`** (sibling to `src/`)

This function will:

1. Receive form data from the website
2. Call Mailchimp's API with your secret key
3. Return success or a friendly error

No extra npm packages required — use built-in `fetch`.

### Fix `vercel.json` rewrites

Current config sends all traffic to `index.html`. When implementing, ensure `/api/*` routes still work:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

(Vercel often handles `/api` automatically, but confirm after deploy.)

---

## Part 8 — Set environment variables in Vercel

**Do this in Vercel, not in code.**

1. [vercel.com/dashboard](https://vercel.com/dashboard) → **gamebreakers-academy** project.
2. **Settings** → **Environment Variables**.
3. Add:

| Name | Value | Environments |
|---|---|---|
| `MAILCHIMP_API_KEY` | Your full API key | Production, Preview, Development |
| `MAILCHIMP_SERVER_PREFIX` | e.g. `us21` | Production, Preview, Development |
| `MAILCHIMP_AUDIENCE_ID` | Your audience ID | Production, Preview, Development |

4. Click **Save**.

For **local testing**, create `.env.local` in the project root (gitignored):

```
MAILCHIMP_API_KEY=your-key-here-us21
MAILCHIMP_SERVER_PREFIX=us21
MAILCHIMP_AUDIENCE_ID=your-audience-id
```

Restart `npm run dev` after creating `.env.local`.

---

## Part 9 — Wire up the React form

Update `PilotSignupModal.jsx` so `handleSubmit`:

1. Validates the form (browser `required` fields)
2. `POST` to `/api/subscribe` with JSON:

```json
{
  "name": "Alex Watler",
  "email": "alex@example.com",
  "phone": "555-123-4567",
  "role": "Player",
  "age": "12",
  "zip": "11215"
}
```

3. On success → show **"You're in!"**
4. On error → show a friendly retry message
5. Optionally disable the button and show a spinner while submitting

---

## Part 10 — Test end-to-end

### Mailchimp ready
- [ ] Audience exists with merge fields
- [ ] API key created
- [ ] Audience ID copied

### Local (optional)
- [ ] `.env.local` filled in
- [ ] Submit with a real email you control
- [ ] Contact appears in **Audience → All contacts**
- [ ] FNAME, PHONE, ROLE, AGE populated correctly

### Production
- [ ] Env vars set in Vercel
- [ ] Deploy (push to GitHub → Vercel auto-deploys)
- [ ] Submit on live site
- [ ] Contact appears in Mailchimp

### Edge cases
- [ ] Submit as **Player** with Age
- [ ] Submit as **Parent** (no Age)
- [ ] Submit **without Zip**
- [ ] Submit same email twice (should update, not crash)

### Double opt-in
- **ON:** contact shows **Pending** until confirmation email clicked
- **OFF:** contact shows **Subscribed** immediately

---

## Part 11 — Privacy & compliance

Add a line to your Privacy Policy that signup info is stored via **Mailchimp** for event communication.

Consider a note under the form button:

> *By signing up, you agree to receive event updates from Brooklyn Gamebreakers. You can unsubscribe anytime.*

Mailchimp automatically includes unsubscribe links in emails it sends.

---

## Common issues & fixes

| Problem | Likely cause | Fix |
|---|---|---|
| Contact not appearing | Double opt-in ON | Check **Pending** tab, or confirm via email |
| `401 Unauthorized` | Wrong API key or server prefix | Re-copy key; prefix must match key suffix |
| `404 Resource Not Found` | Wrong Audience ID | Re-copy from audience settings |
| `400 Invalid Resource` | Merge field tag mismatch | Tag in code must exactly match Mailchimp |
| Works locally, not on Vercel | Env vars not set | Add vars in dashboard; **redeploy** |
| Form submits but nothing happens | Prototype handler still active | Wire `handleSubmit` to `/api/subscribe` |
| CORS error | Calling Mailchimp from browser | Use the Vercel API route instead |

---

## Recommended order of work

1. **Mailchimp setup (Parts 1–6):** ~20–30 min
2. **Reply when credentials are ready** (don't paste the key in chat)
3. **Implement code:** `api/subscribe.js`, form wiring, loading/error states
4. **Deploy & test** using Part 10 checklist

---

## What Mailchimp gives you after this works

- All contacts in one searchable list
- Export to CSV anytime
- Send clinic reminders and updates
- Segment by tag (`Flag Football Clinic - July 2026`)
- Track opens/clicks on sent emails
