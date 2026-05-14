# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ODE-N is a **Lettorology Encyclopedia** — a browser-based gematria/numerology tool that computes cipher values for phrases, looks up matching entries from a curated phrase database, visualizes phrases as sigil-like glyphs, and analyzes names via classical numerology components.

## Commands

```bash
npm run dev       # Start Vite dev server (hot reload)
npm run build     # Production build to dist/
npm run preview   # Preview the production build locally
```

There is no test runner or linter configured.

## Architecture

### Layer overview

```
src/data/        → raw phrase lists (single source of truth for the database)
src/engine/      → pure computation: no React, no side effects
src/hooks/       → React glue between engine and components
src/components/  → React UI (one panel per tab + shared primitives)
src/styles/      → design tokens (supplementary; cipher colors live in constants.js)
```

### Data flow

1. **Phrase lists** (`src/data/*.js`) export arrays of raw strings grouped into five categories (`states`, `patterns`, `identity`, `events`, `language`). `src/data/index.js` (`CATEGORY_DEFS`) is the single source of truth consumed by both the worker and the sync fallback.

2. **Dataset building** (`src/engine/dataset.js`) normalizes each phrase (`normalize()` strips non-alpha, lowercases, collapses spaces), deduplicates by normalized form, filters to 1–9 words and 1–60 letters, and computes all 8 cipher values via `calcValues()`.

3. **Index building** also in `dataset.js` creates per-cipher value buckets (`idx[cipher][value] → entry[]`), sorted value arrays for binary search, and a category set index.

4. **Web Worker** (`src/engine/indexWorker.js`) does steps 1–3 off the main thread and `postMessage`s `{ entries, indexes }` once. `useIndexes` (`src/hooks/useIndexes.js`) spawns the worker via Vite's `?worker` import, falls back to synchronous `buildSync()` if the import fails (test/SSR environments), and exposes `{ entries, indexes, ready }`.

5. **Lookup** (`src/engine/ranking.js`) offers two strategies:
   - `nearestInIndex` — two-pointer binary-search walk for nearest cipher values O(k)
   - `rankByCrossMatch` — score = (exact cipher matches × 1000) + Σ 1/(1 + |Δv|)

6. **App state** (`src/App.jsx`) manages the active tab and search text at the top level. History is a `useReducer` (max 100 entries, deduped by `norm`). All panels receive only what they need; `indexes` and `ready` are threaded down from `useIndexes`.

### The 8 ciphers

All defined/exported from `src/engine/constants.js` (`CIPHERS`, `CIPHER_KEYS`) and computed in `src/engine/ciphers.js`:

| Key | Short | Algorithm |
|---|---|---|
| `simple` | SE | ordinal (A=1…Z=26) |
| `reverseSimple` | RS | reverse ordinal (A=26…Z=1) |
| `weighted` | WG | position × word-position scaled ordinal |
| `ascii` | AC | raw ASCII code sum |
| `shadow` | SH | position-weighted reverse ordinal, vowels halved, word-position divided |
| `eclipse` | EC | shadow variant adding first/last letter delta |
| `pythagorean` | PY | classical 1–9 repeating reduction |
| `prime` | PR | A=2, B=3, C=5, … (first 26 primes) |

`calcValues(norm)` returns all 8 in one call via `ciphersFused` (single-pass) + `cipherShadowEclipse` + `cipherWeighted`.

### Glyph engine (`src/engine/glyph.js`)

`buildGlyph(norm)` converts a normalized phrase into SVG geometry (never throws — returns `null` on error). The algorithm:

- Each letter's Pythagorean value (1–8) maps to a cardinal/diagonal direction; value 9 triggers a spiral rotation.
- Step length scales with `√(simple ordinal)` × position and word-position factors.
- Vowels get polygon flourishes (triangle=A, square=E, pentagon=I, hexagon=O, heptagon=U, octagon=Y); consonants get tick marks.
- Multi-word phrases arrange word-paths in a ring; word-to-word connector lines and an optional closing line are added.
- Symmetry detection via 12-angle axis sweep marks the best axis when `avgDist < threshold`.
- Returns a geometry object consumed by `GlyphSvg` in `GlyphPanel.jsx` for SVG rendering.

### Name engine (`src/engine/nameEngine.js`)

`parseName(raw)` produces six numerology components (Expression, Soul Urge, Personality, First, Last, Initials) each with a raw ordinal sum and its digital root. Uses `NAME_VOWELS` (a–u + y as semi-vowel) rather than `CIPHER_VOWELS` (a–u only).

### Styling conventions

All styles are inline objects. No CSS files, no Tailwind. The shared primitive components (`Card`, `Inp`, `Btn`, `ValueBadge`, `EmptyState`, `SectionLabel`, `FieldLabel`) live in `src/components/ui.jsx`. The dark-theme palette is:

- Background `#0f0f13` · Surface `#18181f` · Border `#2a2a35`
- Text `#e8e8f0` · Muted `#6b6b80` · Accent `#7c6af7`

Each cipher has its own color defined in `CIPHERS` inside `src/engine/constants.js` (authoritative) and mirrored in `src/styles/tokens.js`.

## Key conventions

- **Normalization is the identity key.** Every entry is stored and compared by its `norm` (lowercase, letters+spaces only). Never bypass `normalize()` when matching or deduping phrases.
- **Engine modules are pure.** `src/engine/` has no React imports. Keep computation and React lifecycle strictly separated.
- **`CATEGORY_DEFS` is the only place to add phrases.** Add to one of the five `src/data/*.js` files and re-export through `src/data/index.js`. The worker and the sync fallback both consume `CATEGORY_DEFS` — no other registration needed.
- **Dataset filters are intentional.** `buildDataset` silently drops phrases outside 1–9 words / 1–60 letters. New phrases must stay within these bounds or the filter must be explicitly changed.
- **`GlyphPanel` receives the raw geometry object from `buildGlyph`, not SVG strings.** The `GlyphSvg` component applies its own scale/translate transform (`T`) at render time so the geometry stays in glyph-space coordinates.
- **`tokens.js` cipher colors differ from `constants.js`.** Prefer `CIPHERS[key].color` from `constants.js` for anything cipher-color-related; `tokens.js` is a supplementary reference only.
