# Outreach Desk

Personalized outreach across social platforms — AI writes, you edit & approve.
**Rules baked in:** official APIs only · no scraping · no unsolicited bulk DMs · opt-outs always honored · per-user data isolation · secrets only in server env vars (never in browser, no key-paste screens).

## Build order (strict)
1. **Part 1 — Web dashboard** ✅ (this delivery)
2. **Part 2 — Auto-send backend** ⏸ waiting for owner confirmation
3. **Part 3 — Android keyboard (Kotlin)** ⏸ waiting for Part 2

## Folder structure
```
outreach-desk/
  app/
    page.tsx            Landing + auth gate (Log In first) + dashboard shell
    layout.tsx          Inter font, metadata
    globals.css         Neumorphic design system (light/dark CSS vars)
    api/ai-draft/route.ts  Server-only LLM draft (env key, local-generator fallback)
    api/health/route.ts
    inbox/ login/       Redirect stubs (single-entry app)
  components/Inbox.tsx  Two-pane inbox, composer, drawer, modals (client/offer/reply)
  lib/types.ts          Platform/Status types, platform registry
  lib/seed.ts           Demo clients + default "My Offer"
  prisma/schema.prisma  Supabase Postgres schema (User, Offer, Client, Message)
  .env.example
```

## Part 1 — what's in
- Two-pane unified inbox matching the brief: pill tabs All/Unread/Mentions (red badge), avatar rows, platform icons, red unread badges (3/5/9/99+), blue `@ 2` mention badge, grey muted dot, raised selected row
- Chat: blue gradient bubbles right (`#1E6FE8`, "User" + time), grey bubbles left (name + time), green online dot header
- Composer: text box, **Send**, **AI draft** (English / Roman Urdu, platform-suited tone & length), editable before send
- Client details drawer: contact, niche, notes, status chips (New, Drafted, Sent, Replied, OptedOut), history, mute, opt-out
- Login/Signup (login first), Add/Edit/Delete clients, CSV import (`name,platform,contact,niche`), filter by status + platform, search
- **My Offer** profile used in every AI draft
- Replies: official-API platforms are wired in Part 2; LinkedIn/Reddit/Facebook replies are pasted manually via **Paste reply** → status auto-changes to Replied (follow-ups stop)
- Soft neumorphic style, light + dark mode, mobile single-pane with back arrow, safe-area padding
- Part 1 persistence: per-user (by email) browser storage behind a repository seam — swap to Supabase via `prisma/schema.prisma` + `DATABASE_URL` in Part 2. AI key: server env `LLM_API_KEY` only; with no key, a local generator returns drafts with the same contract (labeled honestly in the UI).

## Run
```bash
cp .env.example .env   # optional: set LLM_API_KEY for live LLM drafts
npm install
npm run dev            # http://localhost:3000
```

## Deploy (Vercel)
```bash
npm run build          # must pass
# Vercel: import this repo/folder, framework = Next.js, set env vars in project settings (server-side only)
```

## Part 1 test checklist
- [ ] Sign up → log out → Log In (login tab is first) → your clients are isolated from another account's
- [ ] Tabs: All / Unread / Mentions counts match badges; selecting a row clears its unread badge
- [ ] Filters (platform + status) and search narrow the list
- [ ] Add client → appears selected with raised style; Edit and Delete work from the drawer
- [ ] CSV import with header `name,platform,contact,niche` adds rows
- [ ] My Offer save → AI draft (English) mentions your service/benefit/CTA and the client's niche
- [ ] AI draft (Roman Urdu) returns a Roman Urdu message; Reddit draft is non-salesy, Email draft has an unsubscribe line
- [ ] Edit a draft → Send → blue bubble appears, status becomes Sent; opted-out client cannot be sent to
- [ ] Paste reply → grey bubble appears, status becomes Replied
- [ ] Dark mode toggle; mobile width: list first, tap → chat, back arrow returns; drawer opens on desktop

## Part 2 (not started — awaiting confirmation)
WhatsApp Business Cloud API (approved templates, opted-in only), Gmail API/SMTP with unsubscribe, Discord bot (invited servers only); queue + rate limits + daily caps; webhooks for delivery/replies; auto-stop on reply/opt-out. LinkedIn/Reddit/Facebook/Instagram cold DMs stay manual.

## Part 3 (not started)
Kotlin `InputMethodService` keyboard, WhatsApp-green theme, AI key in suggestion bar → backend draft → `commitText`. Never auto-sends, no accessibility clicks, skips password fields (`inputType` check), text leaves device only on AI-key tap.
