# HAVOC

A gamified wellness app where your real habits keep a cyberpunk shelter alive. Drink water, move, and rest — or watch the room decay from tidy to desolate.

Built for ASYNC'26.

> **Status: Hackathon prototype.** No CI/CD pipeline, automated test suite, or backend is configured — see [Maturity & Known Limitations](#maturity--known-limitations) for the honest version of what that means.

---

## 1. Context & Overview

### Elevator pitch

Habit trackers get abandoned because the reward feels far away. HAVOC turns water, activity, and recovery logs into a survival game: each habit earns a different in-world material (Coolant, Power Cells, Data Shards), your shelter's visual state reflects your real stats, and an in-shelter companion reacts to how you're doing. Because materials are tied to specific habit types, no single habit can be grinded to unlock everything — the game mechanically enforces balance across water, movement, and rest.

**Target audience:** students and young professionals with irregular routines who've bounced off conventional habit trackers.

**Core features:**
- Daily missions (water, activity, recovery) with timer- and cooldown-based verification
- A living shelter that visually decays or thrives (tidy → lived-in → worn → neglected → desolate) based on real stats
- An in-shelter companion with reactive dialogue and expressions
- An underground Trading Centre: habit-specific materials, mixed-currency item costs, and room customization via filters
- Name-based login, companion rename, and a settings/logout flow
- Auto-triggered first-launch intro, logged under Missions
- Background ambient audio with mute toggle

### Build status

| Check | Status |
|---|---|
| CI/CD pipeline | Not configured — manual build/deploy only |
| Automated tests | None written |
| Deployment | Vercel, auto-deploys from `main` |

### Demo

- **Live demo:** `[add Vercel URL here]`
- **Demo video:** `[add link here]`
- Screenshots: `[add screenshots to /docs/screenshots or link here]`

---

## 2. Architecture & System Design

HAVOC is a client-only React app. There is no backend or external API — all state lives in the browser.

```
┌─────────────────────────────────────────────┐
│                  App.jsx                     │
│  (gates on playerName → LoginScreen or app)   │
└───────────────────┬───────────────────────────┘
                     │
         ┌───────────┴────────────┐
         │     gameStore.js        │   ← single Zustand store,
         │  (stats, currencies,    │     persisted to localStorage
         │   missions, themes,     │
         │   companion, events)    │
         └───────────┬────────────┘
                     │ read/write
   ┌─────────┬───────┼───────┬──────────┐
   ▼         ▼       ▼       ▼          ▼
Shelter   Missions  Trading  Companion  EventCard /
Screen    Screen    Screen   (overlay)  BackgroundMusic
```

### End-to-end execution flow

```
User logs mission complete
        ↓
gameStore: stat updated (energy/water/health)
        ↓
gameStore: material currency credited (coolant/cells/shards)
        ↓
checkEvents() fires → may trigger EventCard overlay
        ↓
ShelterScreen re-renders → tier recalculated from stat average
        ↓
Shelter image crossfades to new tier; theme filter (if equipped)
layers on top
        ↓
Companion dialogue re-evaluated against new state
```

Everything above happens synchronously in one tab, in memory, persisted to `localStorage` on write. There is no server round-trip at any point in this flow.

### Documentation

- No OpenAPI/Swagger spec — there is no API; the app has no backend.
- Setup/design notes: see [Installation](#3-installation--configuration) below and inline comments in `src/store/gameStore.js`.

---

## 3. Installation & Configuration

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | >= 20.19 |
| npm | bundled with Node |
| Browser | any current Chrome, Edge, Firefox, or Safari (uses CSS `filter`, `localStorage`, HTML5 `<audio>`) |

No GPU, no database, no external services required.

### Tech stack

| Layer | Tool |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State | Zustand (persisted to `localStorage`) |
| Audio | Native HTML5 `<audio>` |
| Hosting | Vercel |

### Step-by-step installation

```bash
git clone https://github.com/<org>/havoc-the-game-changer.git
cd havoc-the-game-changer
npm install
npm run dev
```

The dev server prints a local URL (default `http://localhost:5173`). Open it in a browser to run the app.

To build for production:

```bash
npm run build
npm run preview   # serves the production build locally for a final check
```

### Environment variables

| Key | Description | Type | Default | Required |
|---|---|---|---|---|
| — | None. The app has no backend, so there are no secrets or environment-specific config values. | — | — | — |

---

## 4. Developer Experience & Quality Control

### Usage snippets

Reading player stats and triggering a mission completion from anywhere in the app:

```js
import { useGame } from "../store/gameStore";

const { energy, water, health } = useGame((s) => ({
  energy: s.energy, water: s.water, health: s.health,
}));

const completeMission = useGame((s) => s.completeMission);
completeMission("water");
```

Equipping a purchased shelter theme:

```js
const equipTheme = useGame((s) => s.equipTheme);
equipTheme("neon_pink");
```

### Testing & QA

```bash
npm run lint       # ESLint, included in the Vite React template
```

No unit or integration test suite exists. QA for this project is manual: the team walks the full loop (login → mission → currency → shelter tier → trading → theme) on a real phone before each milestone, not via automated checks.

---

## 5. Reliability, Performance & Security

### Maturity & Known Limitations

**Maturity status: Alpha / hackathon prototype.** Not production-ready. Built for a 7-day team sprint and a live demo, not for sustained multi-user traffic.

No throughput/latency benchmarks exist — there is no server to benchmark. Client-side interactions (crossfades, timers) are tuned by feel during development rather than measured.

| Known limitation | Why | Workaround |
|---|---|---|
| Progress is single-device, single-browser | No backend or account sync; `localStorage` only | None — clearing site data or switching devices loses the save |
| No real anti-cheat | No sensors/wearable integration; verification is timers + cooldowns only | Acceptable for a wellness app's honor-system norm; flagged as future work |
| No multiplayer / visiting other shelters | No backend | Out of scope for this build |
| Autoplay audio is silent until first tap | Browser autoplay policy blocks sound before user interaction | Expected behavior, not a bug — resolves on the login screen's first tap |
| Case-sensitive import paths can break on deploy but not locally | Vercel runs Linux; local dev is often Windows/Mac (case-insensitive) | Match filename casing to import statements exactly |
| `package-lock.json` merge conflicts after multi-branch merges | Divergent `npm install` runs across branches produce different lockfiles | Resolve `package.json` first, then regenerate the lockfile with `npm install` rather than hand-editing it |

### Security reporting

This is a student hackathon project with no production deployment of sensitive data (no accounts beyond a locally-stored display name, no payment handling, no PII). There is no formal vulnerability disclosure process. For concerns, open a GitHub issue or contact the team directly via the repository's contributor list.

---

## 6. Governance & License

### Contributing

This repository was built by a 4-person team for ASYNC'26 under a divided-ownership model:

- One contributor owns `src/store/gameStore.js` — other contributors propose changes via PR rather than editing it directly, to avoid merge conflicts on shared state.
- Each other screen/feature area (Missions, Trading Centre, Companion, Shelter) has a primary owner; cross-cutting changes go through a PR.

### Code style

- ESLint config as shipped by the Vite React template (`eslint.config.js`).
- No enforced formatter (e.g. Prettier) is currently configured.

### License



---

*Team HAVOC — ASYNC'26*
