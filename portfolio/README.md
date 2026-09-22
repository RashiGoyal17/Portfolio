# Rashi Goyal — Portfolio

A polished, self-editable portfolio site for Rashi Goyal (Associate AI Engineer, IIT Kharagpur).
Visitors view a public site (hero, about, experience, projects, skills, education, awards,
contact); Rashi logs in at `/admin` to edit every section herself and review contact
submissions.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4**
- **Vercel KV** (`@vercel/kv`, Upstash Redis) for persistent content + contact messages, with a
  local JSON fallback (`data/content.json`, `data/messages.json`) so `npm run dev` works with no
  KV setup
- **NextAuth (Auth.js) v5** — Google OAuth restricted to one email, alongside a simple
  password + signed-cookie auth flow
- **Resend** for contact-form email notifications

## Project structure

```
app/
  page.tsx                 Public homepage (Hero/About/Experience/Projects/Skills/Education/Awards)
  contact/page.tsx         Public contact page
  admin/
    login/page.tsx         Password + Google sign-in
    page.tsx                Content editor dashboard
    messages/page.tsx      Contact submissions (newest first)
  api/
    admin/content/route.ts  GET/POST portfolio content (protected)
    admin/messages/route.ts GET contact messages (protected)
    admin/login/route.ts    Password auth -> signed cookie
    admin/logout/route.ts   Clears session cookie
    auth/[...nextauth]/route.ts  NextAuth handlers (Google OAuth)
    contact/route.ts        Public contact form submit (validated + rate limited)
components/                 Public sections, admin editor, contact form, nav, footer
lib/
  kv.ts                    KV access + local-file fallback + rate limiting
  session.ts               HMAC-signed session cookie (Web Crypto, Edge-safe)
  types.ts                 Content/message TypeScript types
data/
  content.json             Seed/fallback content (source of truth when KV isn't configured)
  messages.json             Local fallback store for contact submissions
auth.ts                     NextAuth v5 config (Google provider, email allowlist)
middleware.ts                Protects /admin/* and /api/admin/* via either auth method
public/resume.pdf            Placeholder — replace with the real resume PDF
```

## Environment variables

See `.env.example` for the full annotated list. Summary:

| Variable | Used in | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | `app/api/admin/login/route.ts` | Password for simple admin login |
| `SESSION_SECRET` | `lib/session.ts` | HMAC key signing the admin session cookie |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | `auth.ts` | Google OAuth app credentials |
| `ADMIN_EMAIL` | `auth.ts` | Only this email may sign in via Google |
| `NEXTAUTH_SECRET` | NextAuth internals | Encrypts NextAuth session/JWT |
| `NEXTAUTH_URL` | NextAuth internals | Base URL of the deployed app |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | `lib/kv.ts` | Vercel KV (Upstash Redis) connection |
| `RESEND_API_KEY` | `app/api/contact/route.ts` | Sends contact-form email notifications |
| `CONTACT_TO_EMAIL` | `app/api/contact/route.ts` | Notification recipient (defaults to rashiwork17@gmail.com) |
| `CONTACT_FROM_EMAIL` | `app/api/contact/route.ts` | Sender address (Resend-verified domain, or `onboarding@resend.dev` for testing) |

None of these are ever sent to the client — all reads happen in server components, API routes,
or middleware.

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in at least ADMIN_PASSWORD and SESSION_SECRET
npm run dev
```

Without `KV_REST_API_URL`/`KV_REST_API_TOKEN` set, content reads/writes fall back to
`data/content.json` and `data/messages.json` automatically — no external services required to
develop locally. Visit `/admin/login` and sign in with `ADMIN_PASSWORD` to edit content.

## Deploying to Vercel

1. **Push to GitHub** (or use the Vercel CLI): `vercel` from the project root, or connect the
   repo at [vercel.com/new](https://vercel.com/new).
2. **Add Vercel KV**: in the Vercel dashboard, open your project → **Storage** tab → **Create
   Database** → choose **KV** (Upstash Redis). Connect it to the project; this automatically sets
   `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you.
3. **Set the remaining env vars** in Project Settings → Environment Variables:
   - `ADMIN_PASSWORD`, `SESSION_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_SECRET` (same command), `NEXTAUTH_URL` = your production URL
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAIL` (see below)
   - `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
4. **Google OAuth setup** (optional, for Google sign-in on `/admin`):
   - Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
   - Create an **OAuth Client ID** (type: Web application)
   - Authorized redirect URI: `https://<your-domain>/api/auth/callback/google`
   - Copy the client ID/secret into the env vars above
5. **Resend setup**: sign up at [resend.com](https://resend.com), create an API key
   (`RESEND_API_KEY`), and either verify your own sending domain or use
   `onboarding@resend.dev` as `CONTACT_FROM_EMAIL` for testing.
6. **Redeploy** after setting env vars so they take effect.
7. Replace `public/resume.pdf` with Rashi's actual resume before going live.

## Auth notes

- **Password auth** is fully implemented: `/admin/login` posts to
  `app/api/admin/login/route.ts`, which sets an HMAC-SHA256-signed, httpOnly cookie
  (`lib/session.ts`, built on the Web Crypto API so it also runs in the Edge middleware).
- **Google OAuth** is fully wired via NextAuth v5 (`auth.ts`), with the `signIn` callback
  restricting access to `ADMIN_EMAIL`. `middleware.ts` allows access to `/admin/*` if **either**
  the password cookie or a valid NextAuth session cookie is present, so both auth methods work
  side by side.
- If Google sign-in fails locally, double check `NEXTAUTH_URL` matches the origin you're testing
  from and that the redirect URI is registered exactly in the Google Cloud Console.

## Content editing

All content (bio, experience, projects, skills, awards, education, contact/social links) lives in
one JSON document (seeded in `data/content.json`, persisted to Vercel KV once configured). The
`/admin` dashboard provides add/edit/delete/reorder forms for every collection and a single
"Save Changes" action that validates and writes the whole document via
`app/api/admin/content/route.ts`. `/admin/messages` lists contact-form submissions newest first.

## Security

- All admin API routes are protected by `middleware.ts`.
- Contact form input is validated server-side (required fields, length limits, email regex).
- The contact API is rate-limited to 5 requests/hour per IP (KV-backed counter, in-memory
  fallback locally).
- Secrets (`ADMIN_PASSWORD`, `SESSION_SECRET`, `RESEND_API_KEY`, KV tokens) are read only in
  server code and never exposed to the client bundle.
