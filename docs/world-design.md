# Jahntow: The Overworld — Design Document

*The top-down world layer. This document is the reference for both the code
and the pixel art: if a decision is here, build and draw against it; if it
changes, change it here first.*

---

## 1. Vision

Jahntow currently plays as a management console: powerful systems, read
through tabs. The overworld makes the same game **visible**: a top-down,
grid-movement world in the spirit of Pokémon/old Zelda, where the war, the
tribes, the economy and the story are things you can walk up to and look at.

The world is a **view**, not a second game. Every number the server owns
today stays owned by the server; the world renders it and routes intents to
the same API the tabs use. Nothing about the backend changes in phases 1–4.

**The one-line test for every world feature:** does this make an existing
system more legible or more atmospheric? If it only adds walking, cut it.

## 2. Locked decisions

| Decision | Choice | Why |
|---|---|---|
| Platform priority | **Mobile-first, portrait** | Most players will be on phones. Desktop inherits. |
| Movement | **Grid-locked steps** (Pokémon-style) | Readable, trivial collision, ages well, easy to author art for, perfect for tap-to-move. |
| Tile size | **32×32 authored**, integer-zoom rendered (2× desktop ≈ 64 px on screen; ~96 physical px on 3× phones) | 12-tile visible field on phones (64px tiles would show only ~6). Art labor is quadratic in resolution. 32→64 redraw is possible later; 64→32 is not. |
| Characters | **32×48** (1 tile footprint, 1.5 tiles tall) | Classic top-down proportions; presence without blocking sightlines. |
| Console | **Stays, forever** — it is E.C.H.O.'s projected interface (diegetic) | Trading/goals/medlab need instant access; mobile needs a non-walking path to everything. The world never gates a console feature. |
| Travel | **Fast-travel to any visited region, always free** | The walk is content, never a toll. |
| Reflexes | **Never required for the economy** | Any future minigame is a bonus path, not the only path. |
| Engine | **Phaser 3** mounted in a React route (`/world`), sharing the flux store/auth | Mature, Tiled-native, coexists with the existing app. |
| Maps | **Tiled** (`.tmx`/JSON), collision + interactables as object layers | Free editor, the format the artist and the engine share. |
| Placeholders | **Kenney.nl CC0 packs** (16px packs rendered at 2×) until hand-drawn art lands | Zero license risk, no attribution debt, swap freely. |

## 3. Controls (mobile-first)

- **Tap-to-move**: tap a tile → A* path on the walkable grid → Jahntow
  walks. Tap an interactable (stall, NPC, door) → walk adjacent, then
  auto-interact. This is the primary input.
- **Hold-drag**: hold near screen edge to walk continuously (no visible
  D-pad by default; an optional corner D-pad is a settings toggle).
- **Desktop**: arrows/WASD to move, E/Enter/click to interact.
- **E.C.H.O. button**: persistent floating 🤖 in a corner. Opens the
  console (the existing tab UI as an overlay) from anywhere, instantly.
  Closing it returns to the world exactly where you stood.
- **Interact affordance**: any interactable in range shows a one-word
  floating chip ("Market", "Zu'ark", "Board") so nothing is guess-and-tap.

## 4. World structure

A **world map screen** (stylized planet map of Zephyr) with seven region
nodes, plus local maps per region. Travel = tap a node. Locked regions show
their barrier in fiction, not in UI-speak.

| Region | Unlocks (storyWins) | Biome & mood | Tribe / camp | Local mission count |
|---|---|---|---|---|
| **Xictlia** | 0 | Desert city + crash site; ochre, dust, adobe | Xictlian Outriders — Zu'ark | 5 |
| **Luxor** | 30 | Trade city; gold/sand, bazaars, canals | Luxorian Free Company — Axenthon | 4 |
| **Xiaojia** | 60 | Forest canopy; boardwalks in the trees | Canopy Rebels — Ava | 4 |
| **Titan Ranges** | 90 | Mountains, scrap-metal forges, snowline | Titan Clan-Mechs — Kazon | 4 |
| **Tuatha** | 120 | Groves, standing stones, green light | Grove Wardens — the Emerald Mage | 4 |
| **Namarupa** | 150 | Mystic salt-flats, choir spires, night sky | The Woken Choir — Zhalia | 3 |
| **The Fortress Wastes** | 180 | Vortex fortress exterior; endgame gray/red | — (host battles) | 2 |

Each region starts as **one screen** (~40×30 tiles) and can grow. Xictlia
gets a second screen from day one: the **crash site** (the ship wreck =
Base) a short walk outside town.

### Hub anatomy (every region, region-flavored)

| World object | Opens / does | Notes |
|---|---|---|
| **Ship wreck** (Xictlia crash site only) | Base panel (Ship/Equipment/Medlab) | The wreck IS the base; E.C.H.O. was born here. |
| **Market stall** | Market panel | Stall dressing varies by biome. |
| **War camp** | Warbands panel (this tribe's card focused) | See state reflection — the camp is the readiness UI. |
| **Mission board** | Missions panel filtered to this region | Launching plays the mission theater in place. |
| **Property plots** | Properties panel | Owned properties render as buildings (see §5). |
| **Story marker** (glowing) | Story panel | Present only when the current chapter takes place here. |
| **Named NPCs** | Dialogue: dossier + 1–3 lines that change with story progress | Cast placed per their lore (Zu'ark at the Xictlian camp, etc.). |
| **Salvage nodes** | Small pickup → market item into inventory | 2–3 per region, slow respawn. The "energy is empty, wander anyway" loop. |

## 5. State reflection — the world is the UI

The core rulebook. Everything here reads existing serialized state; nothing
new is stored.

**Liberation (the map is a progress bar).** Each region has three dressing
states driven by `storyWins` against that region's chapter block:

- **Occupied** (story hasn't finished this region's chapters): Vortex
  patrol NPCs, shuttered stalls, few civilians, muted palette overlay.
- **Contested** (its chapters are in progress): barricades, tribal banner
  half-raised, mixed crowd.
- **Liberated** (its block is done): banners up, stalls open, civilians
  out, patrols gone.

The **Chronicle** makes this matter twice: prestige at 210 resets
`storyWins`, and the whole world visibly re-occupies — retelling the war
*looks* like a war to retell.

**The war camp is the warband UI:**

| State | Rendering |
|---|---|
| Strength 0 / 1–40 / 41–120 / 121–200 | No camp / 2 tents / 4 tents + palisade / 6 tents + banner tower |
| Provisions > 0 | Cook fire lit (animated) — dry camp: cold fire, gray smoke |
| Kit coverage | Weapon racks: empty / half / full |
| Reserves | Idle warrior sprites around the fire (1 sprite ≈ 20 strength) |
| Active orders | One marching-column sprite at the gate per order, with a chip ("Patrol ×35") |
| Boon earned | Tribal totem beside the banner |

**Properties**: owned property = its building appears on its region's map.
Upgrade L2 adds a banner, L3 adds lights. Pending production ≥ 1 → smoke
puffs (tap → collect via the existing endpoint).

**Events**: merchant event → a caravan NPC parked in the hub for the
duration. Price spike/crash on a local item → small crowd marker at the
stall. Bounty on a local mission → poster marker on the board.

**Story**: the current chapter's region gets the glowing marker; the
finale battles render a Vortex war-banner at the region edge while their
warband gate is unmet, which lowers when the gate is satisfied.

## 6. Art spec (draw against this)

- **Grid**: 32×32 px tiles. Maps authored in Tiled on a 32 px grid.
- **Characters**: 32×48 px, anchored bottom-center to their tile.
- **Jahntow** (the only full sprite): walk cycle 4 directions × 3 frames
  (12), idle 2 frames, ~8 fps. One 256×192 sheet (8×4 cells of 32×48).
- **E.C.H.O.**: 24×24, 2-frame hover bob, follows one tile behind.
- **Named NPCs (13)**: *static presence only* — idle 2 frames, facing one
  direction. No walk cycles. (This cuts the character workload ~85%; they
  stand where their lore puts them. Dialogue uses the existing painted
  portraits, which stay in the game.)
- **Generic NPCs**: 3 civilians + 1 Vortex trooper + 1 tribal warrior per
  biome look, idle 2 frames; recolors encouraged.
- **Tilesets**: one sheet per biome (`tiles_xictlia.png`, …), 32 px grid,
  power-of-two width (512 px). Terrain, buildings, props, and the
  occupied/liberated dressing variants live on the same sheet.
- **Animated tiles**: cook fire, water, banners — 2–4 frames each.
- **Palette**: start from **DB32 (DawnBringer 32)**; give each biome a
  dominant 8–10 color slice of it so regions read distinctly at a glance.
- **Outline convention**: 1 px darkened-local-color outline on characters
  and props; none on terrain.
- **Assets live in the repo** (`src/front/assets/world/`), imported
  through Vite. No CDN. (The 13 Cloudinary portraits migrate into the
  repo as part of phase 1.)

**Minimum viable art shopping list (phase 1, Xictlia only):** 1 biome
tileset, Jahntow sheet, E.C.H.O., Zu'ark idle, 3 civilians + 1 trooper,
ship wreck (3×2 tiles), stall, tents ×2 sizes, mission board, fire. Kenney
placeholders stand in for every one of these until drawn.

## 7. What stays console-only

Full market board & portfolio, Goals/contracts/achievements, Leaderboard,
Medlab purchases, Equipment store, Ship modules, the story journal. All
reachable in two taps from anywhere via the E.C.H.O. button. The world
links into these panels; it never reimplements them.

## 8. Minigames (deferred, embedded-only)

If added later, they live inside the world where the fiction wants them —
a salvage sweep as a short scavenging run in the Wastes, an E.C.H.O.
recon-drone flight, a smelter you operate. Always a bonus on top of an
existing system's payout, never the only path, never reflex-gated economy.
No standalone arcade (no slots/galaga — one man on an occupied planet).

## 9. Phases

1. **Xictlia proof** — town + crash site screens, tap-to-move, E.C.H.O.
   console overlay, five interactables opening existing panels, Kenney
   placeholders, Cloudinary portraits migrated into the repo.
   *Accept: a phone player can do a full normal session (mission, trade,
   provision) without ever opening the old tab bar directly.*
2. **State reflection** — camp scaling, orders at the gate, property
   buildings, liberation dressing states, event markers.
   *Accept: strength/readiness/orders are readable with zero numbers.*
3. **World map + Luxor** — travel screen, region gating as fiction,
   second biome proves the tileset pipeline.
4. **The cast + story markers** — all named NPCs placed, dialogue lines
   keyed to story progress, chapter markers, finale war-banners.
5. **Optional forever-list** — interiors, embedded minigames, remaining
   biome dressing passes, ambient audio.

Phases 1–4 require **zero backend changes**.

## 10. Risks & guardrails

- **The tax trap**: any time the world makes a common action slower than
  the tab did, add a shortcut (the E.C.H.O. button is the universal one).
- **Art scope**: the phase-1 shopping list is one sitting per asset at
  32 px. Nothing outside it blocks phase 1.
- **Mobile perf**: one screen ≈ 1,200 tiles + <30 sprites — trivial for
  Phaser on any phone from the last decade. Keep it that way: no
  particles, no dynamic lighting, no full-map pathfinding per frame.
- **Save nothing new**: the world derives everything. If a world feature
  seems to need new server state, it's out of scope or mis-designed.
