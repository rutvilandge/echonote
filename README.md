# EchoNote — AI Meeting Assistant for Smarter Teams

Records meetings, generates AI summaries, extracts action items, and keeps
teams organized. Built on Next.js, TypeScript, Prisma, PostgreSQL, NextAuth,
Daily.co, and Groq — all on free-tier infrastructure.

## Setup

### 1. Install
```bash
npm install
```

### 2. Neon (free Postgres)
1. neon.tech → new project → copy connection string → `.env` as `DATABASE_URL`
2. In Neon's SQL editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Then:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### 3. Auth (pick what you want)
- **Email/password** — works with zero setup
- **Google** (console.cloud.google.com) — also enables Calendar sync.
  Redirect URI: `http://localhost:3000/api/auth/callback/google`.
  Enable the Google Calendar API too.
- **GitHub** (github.com/settings/developers) — no billing account needed.
  Callback URL: `http://localhost:3000/api/auth/callback/github`

### 4. Groq (free LLM) — console.groq.com → `.env` as `GROQ_API_KEY`
### 5. Daily.co (free video) — dashboard.daily.co → `.env` as `DAILY_API_KEY`
### 6. NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```
### 7. Run
```bash
npm run dev
```
→ http://localhost:3000

**Your only job: fill in `.env`.** Copy `.env.example` to `.env` and paste in
the keys from steps 2–6.

## What's real (backed by the database, not mocked)

- Landing page, auth (Google/GitHub/email), registration
- Dashboard — real Prisma-aggregated stats: total/upcoming/today's meetings,
  workspaces, summaries generated, pending/completed action items,
  completion rate, plus charts (meetings/month, action item status,
  workspace activity, trend line) and an AI insights panel
- Meetings — create, edit, delete, video call (Daily.co, duplicate-iframe
  bug fixed), templates, transcript upload, AI summary, action items, chat
- Calendar — real month view + automatic Google Calendar sync (if signed in
  with Google)
- Members — invite by email, roles, remove
- Templates — CRUD, selectable when creating a meeting, steers the AI
  summary prompt
- Notifications — real-time creation on events, search, filter, mark-read,
  delete, relative timestamps ("2h ago")
- Global search (⌘K) — searches meetings, action items, templates, and
  members live
- Workspace settings — rename, delete, transfer ownership, Slack webhook
- Analytics — same real data as the dashboard, in more detail
- Settings, Profile, API Keys (SHA-256 hashed, shown once)
- /help, /privacy, /contact pages

## Known limitations, stated honestly

- Zoom, Microsoft Teams, Notion, Jira, Linear, ClickUp, Outlook Calendar
  integrations are not built — each needs its own OAuth developer app.
  Slack works via incoming webhook (no OAuth needed), under Workspace settings.
- No billing/payment processing — this app has no paid tier by design.
- Average meeting duration only populates once meetings have both a
  `startedAt` and `endedAt` timestamp recorded (not wired to the video call
  lifecycle yet — a good next step would be setting these on Daily.co's
  `joined-meeting` / `left-meeting` events).

## Bug fixes in this version

- **Duplicate DailyIframe instances** — `VideoRoom.tsx` now guards against
  React 18's double-effect in dev mode and destroys any stray instance
  before creating a new one.
- **Hydration mismatches on dates** — all locale-formatted dates now use
  `suppressHydrationWarning`, since server/client locale can differ.
- **"workspaceId required" on meeting creation** — the new-meeting form now
  fetches your workspaces itself instead of depending solely on a URL
  param, and auto-selects your first workspace.

## Free-tier limits

| Service | Free limit |
|---|---|
| Neon | 0.5 GB storage, generous compute hours |
| Daily.co | 10,000 participant-minutes/month |
| Groq | Rate-limited, no monthly cap on free tier |
