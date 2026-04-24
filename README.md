# Dad Ops

A simple volunteer board for a school's "Dad Ops" crew — a sub-group of the Parents & Teachers Community who pick up hands-on jobs around the school (builds, mowing, working bees, event rosters). Parents Committee leaders post events. Dads put their name down.

No accounts. No emails. Just a name on a list and a job to knock over.

**Live site:** https://novalogix-ckc.github.io/Dad-Ops/

---

## What it does

Each record on the board is an **Event** with a clear brief, a date, a location, and a way to sign up. The signup style flexes to match the job:

| Style | When to use it | Example |
|---|---|---|
| **Open signup** | One big crew, no specific roles | Term working bee — "we need 20 people, put your name down" |
| **Specific jobs** | The event has named roles with their own crew sizes | BBQ shelter build — 3 on concrete, 4 on framing, 2 on roofing |
| **Jobs with sessions** | Roles split into timed sessions, multiple people per session | School disco — BBQ 6–7pm (3 spots), 7–8pm (3 spots), 8–9pm (3 spots); plus Door and Pack-down |

Any visitor can sign up by typing a name. More than one person can volunteer per slot. Names aren't unique — Dave can put his name down even if another Dave already did.

---

## Core flows

### For a Parents Committee leader posting a job

1. Click **Post an Event**
2. Fill in the basics — title, brief, location, date, start/end time, your name
3. Pick a **signup style**
4. Configure the structure:
   - **Open** → just enter a crew size
   - **Jobs** → add named jobs, each with a crew size
   - **Scheduled** → add named jobs, add time sessions to each, each session gets its own crew size
5. Pin it to the board

### For a dad picking up a job

1. Open the **Event Board**
2. Browse what's coming up — each card shows the style, spots left, fill bar, and when/where
3. Open the event
4. Type a name into the slot you can do → **I'm in**
5. Show up, knock it over, head home

### Marking a job done

Any visitor on the event detail page can **Mark event as done**. It moves the event from "Upcoming" to "Jobs done" on the board. (No auth on this — the community runs on trust.)

---

## Data model

```
Event
├── title, details, location, date, start/end time, postedBy, status
├── signupStyle: 'open' | 'jobs' | 'scheduled'
└── jobs[]
    ├── name, description
    └── slots[]
        ├── startTime?, endTime?, capacity
        └── volunteers[] (name, signedUpAt)
```

A **slot** is the unit people sign into. That unification is what lets one data shape cover all three signup styles:

- **Open** = 1 anonymous job ("Crew") with 1 slot (capacity = total)
- **Jobs** = N named jobs, each with 1 slot (capacity per job)
- **Scheduled** = N named jobs, each with M time-windowed slots

---

## Pages

| Route | Purpose |
|---|---|
| `/` | Event board — hero with live counts, Upcoming grid, Jobs Done grid |
| `/events/:eventId` | Event detail — brief, meta, per-style signup UI, mark-done button |
| `/new` | Post an event — dynamic form with style picker and jobs/sessions builder |
| `/about` | One-pager describing the Dad Ops crew |

---

## Design language

Workshop / industrial. Charcoal steel backgrounds, safety-amber accents, hazard-stripe detailing on job cards. Display type is **Oswald** (condensed, stencil-feeling); body is **Inter**. Icons are Lucide.

Palette:

- Background: `#15161a` charcoal
- Accent: `#e08a2b` safety amber
- Destructive/full: `#b3421e` rust red
- Done: `#5f8a3a` workshop green
- Timber highlight: `#7a5a37`

---

## Tech stack

- **Vite** + **React 18** + **TypeScript**
- **TanStack Router** for routing (typed routes, preloading, SPA basepath)
- **TanStack Query** for data fetching/mutation state around the mock store
- **Lucide React** for icons
- **Plain CSS** (no framework) — single `styles.css` with CSS variables
- **GitHub Pages** for hosting, built & deployed by a GitHub Actions workflow on pushes to `main`

There is currently **no backend**. All data lives in an in-memory mock store (`src/data/store.ts`) seeded with example events. Mutations (signup, create event, mark done) all resolve through TanStack Query so the UI updates optimistically and invalidates on success. Data resets on page reload.

When a real backend is wired in, only `src/data/store.ts` needs to change — the pages and hooks use a stable interface.

---

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typechecks then produces dist/
npm run preview  # serves the built dist/
```

## Deployment

Pushing to `main` triggers `.github/workflows/pages.yml`, which builds the Vite bundle and deploys to GitHub Pages. The Vite `base` is set to `/Dad-Ops/` so assets and the SPA router work under the project-site URL. A `404.html` copy of `index.html` is emitted at build time so deep links resolve on Pages.

To enable Pages on a fresh fork: **Settings → Pages → Source → GitHub Actions**.

---

## Repo layout

```
src/
├── main.tsx               # TanStack Router + Query setup, app entry
├── routeTree.tsx          # Route definitions
├── styles.css             # All styling
├── components/
│   ├── Layout.tsx         # Header, nav, footer
│   └── EventCard.tsx      # Event tile for the board grid
├── pages/
│   ├── EventsPage.tsx     # The board (upcoming + done)
│   ├── EventDetailPage.tsx# Per-style signup UI
│   ├── NewEventPage.tsx   # Post-an-event form with dynamic builder
│   └── AboutPage.tsx
├── data/
│   ├── events.ts          # Types + seed data + helpers
│   ├── store.ts           # Mock API (in-memory)
│   └── queries.ts         # TanStack Query hooks
└── lib/
    └── format.ts          # Date/time display helpers
```

---

## Known limitations (by design for MVP)

- No authentication — anyone can sign up, remove others, post events, mark done
- No persistence — refreshing the page resets to seed data
- No notifications — committee leaders can't alert the crew of a new event
- No duplicate-name protection — two "Dave"s look the same on the roster

---

## Next steps / roadmap ideas

- Persistence: swap the mock store for a small backend (Supabase, Cloudflare D1, or a Google Sheet-backed API)
- Soft auth: a shared committee password to gate posting & mark-done
- Share link: per-event URL that copies cleanly for the school newsletter
- Waitlist: when a slot fills, next signups queue up
- ICS export: download a calendar file for the event
- Reminders: opt-in SMS the morning of a job (requires names → phones, adds friction)
