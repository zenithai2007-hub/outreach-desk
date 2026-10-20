# Outreach Wise

Manual-only outreach app — naam aur theme user ke Baymax logo jaisi (red `#BC3B3F` + white).
AI draft yahan banta hai, aap **copy** kar ke WhatsApp / LinkedIn / Instagram waghera mein **khud bhejte** hain, phir wapis aa kar **Mark as sent** karte hain. Client ka reply **Paste reply** se haath se add hota hai.

**Sakht usool:** koi auto-send nahi · koi bahir ka login / OAuth nahi · koi key entry nahi · koi settings screen nahi · per-user data isolation · opted-out client ko message mark nahi hota.

## Folder structure
```
outreach-desk/
  app/
    page.tsx               Landing + login (Log In pehle) + dashboard
    layout.tsx             Inter, title, logo favicon
    globals.css            Red/white neumorphic theme (light/dark)
    api/ai-draft/route.ts  Built-in draft engine (server-side templates, koi key nahi)
    api/health/route.ts
  components/Inbox.tsx     Two-pane inbox, composer (Copy / Mark as sent), drawer, modals
  lib/types.ts             Platforms + status
  lib/seed.ts              Demo clients + default "My Offer"
  public/logo.jpg          User ka logo (landing, header, favicon source)
```

## Kaise kaam karta hai
1. Client select karein (ya Add / CSV import — header row: `name,platform,contact,niche`)
2. **AI draft** dabayein — draft "My Offer" + client notes se banta hai, platform ki tone mein, English ya Roman Urdu mein
3. Draft edit karein → **Copy message** → platform app/website par ja kar khud paste + send karein
4. Wapis aa kar **Mark as sent** — message chat mein record ho jata hai, status **Sent**
5. Client reply de to **Paste reply** — reply chat mein aa jata hai, status **Replied**
- Header mein sirf platform ka naam aur status dikhta hai. Drawer: contact, notes, status chips (New, Drafted, Sent, Replied, OptedOut), history, mute.
- Data har account ke liye alag, isi device/browser mein save rehta hai.

## Run / Deploy
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # deploy se pehle pass hona chahiye (Vercel: Next.js, koi env var nahi chahiye)
```

## Test checklist
- [ ] Sign up → log out → Log In (login tab pehle) → dusre account ke clients nazar nahi aate
- [ ] Tabs All/Unread/Mentions, badges, filters (platform + status), search
- [ ] Add/Edit/Delete client, CSV import
- [ ] My Offer save → AI draft (English + Roman Urdu) offer aur niche use karta hai; Email draft mein unsubscribe line
- [ ] **Copy message** clipboard mein copy karta hai; khali composer par warning aati hai
- [ ] **Mark as sent** message ko blue bubble bana kar record karta hai, status Sent; opted-out par block
- [ ] **Paste reply** grey bubble + status Replied
- [ ] Pori UI mein kahin "auto-send", bahir ke login ya key ka koi zikr nahi
- [ ] Dark mode; mobile par single pane + back arrow

## Part 3 — Android keyboard (baad mein, user ki confirmation par)
Kotlin `InputMethodService`, WhatsApp-green theme, suggestion bar mein AI key → wahi built-in draft engine → `commitText`. Keyboard kabhi khud send nahi karta, koi accessibility auto-click nahi, password fields par kaam nahi karta (`inputType` check), text sirf AI key dabane par device se jata hai. App mein koi key entry nahi.
