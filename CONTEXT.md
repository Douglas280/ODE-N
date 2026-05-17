# Ode-N — Claude Code Context File

This file briefs Claude Code on everything it needs to know about the Ode-N app.
Read this before touching any file in the project.

---

## What the app is

Ode-N is a gematria and cipher lookup tool. Users type a word or phrase and get its
numerical value across multiple ciphers, matched against a database of ~7,000 seed phrases.
It also has a Name Reading panel (numerological breakdown of a full name), a Calculator
panel (multi-term resonance detection), a Glyph panel (generative SVG sigil from the phrase),
and a History panel.

The app is mobile-first, pure black theme, single-file React JSX.
The primary file is: `src/App.jsx`

---

## File structure for deployment

```
oden/
├── src/
│   └── App.jsx          ← the entire app (4700+ lines)
├── index.html           ← Vite entry point
├── package.json         ← dependencies
├── vite.config.js       ← build config
└── CONTEXT.md           ← this file
```

---

## The 8 ciphers (CIPHER_KEYS order)

| Key | Short | Color | Formula | Class |
|-----|-------|-------|---------|-------|
| simple | SE | #38bdf8 | A=1…Z=26 | Standard |
| reverseSimple | RS | #c084fc | A=26…Z=1 | Standard |
| weighted | WG | #f472b6 | L×(1+(pos-1)/n)×(1+(wi-1)/W) | Sacred Class |
| ascii | AC | #4ade80 | raw charCode sum | Standard |
| shadow | SH | #fb923c | Reverse alpha + vowel halving + positional decay | Sacred Class |
| eclipse | EC | #e879f9 | Shadow + mirror gap penalty | Sacred Class |
| pythagorean | PY | #facc15 | A-I=1-9 repeating | Standard (to be removed) |
| prime | PR | #2dd4bf | First 26 primes (A=2…Z=101) | Standard (to be removed) |

**Sacred Class** = original ciphers invented by Buster. Not doctrine-based. No external precedent.
PY and PR are scheduled for removal. New Sacred Class ciphers are coming.

---

## The 5 phrase categories

| Label | Short | What belongs here |
|-------|-------|-------------------|
| states | states | Internal experience, felt time, body sensation, temporal position |
| patterns | patterns | Behavior, habits, relational dynamics, moral patterns |
| identity | identity | Self, role, archetype, mythopoetic identity, internet-native self |
| events | events | Outcomes, causality, elemental forces, significant moments |
| language | language | The unsaid, withheld speech, indirect communication |

---

## Architecture overview

### Single-pass cipher engine
`ciphersFused(norm)` — one character loop computes SE, RS, AC, PY, PR simultaneously.
`calcValues(norm)` — calls fused + weighted + shadowEclipse, returns 8-value object.

### Index system (Web Worker)
`buildDataset(phrases)` — deduplicates, tags each phrase with its category, computes all cipher values.
`buildIndexes(entries)` — builds `idx` (cipher → value → entries[]), `sortedVals`, `catIdx`.
Runs in an inline Blob Web Worker so main thread never blocks on startup.

### Lookup engine
`rankByCrossMatch` — O(hits × 6) scoring from index buckets.
`nearestInIndex` — binary search for nearest values.
`wordSimilar` — cross-cipher proximity for word chips.

### Glyph engine
`buildGlyph(norm)` — walk-as-signature system:
- Each word starts on a ring around origin (multi-word phrases form petals)
- Each letter steps in a direction from its Pythagorean value (1-9 = 8 compass directions)
- Vowels (a e i o u) become polygons: a=triangle, e=square, i=pentagon, o=hexagon, u=heptagon, y=octagon
- Consonants get perpendicular tick flourishes (count = floor(1 + log2(PY+1)))
- Step length = √(ordinal) × 1.15 × sigmoidPositionFactor × pairwiseMultiplier
- Shadow cipher drives stroke weight (0.35–0.85)
- Prime cipher drives color saturation (62–92% HSL)
- Vowel polygons scaled by context (lone vowels are larger)
- Symmetry detection across 12 axes
- Closing path when walk returns near start
- Word-to-word connection lines for multi-word phrases
- Signature arcs at each word's ring origin
- Pulse markers every 3rd letter
- Fully interactive: pan, zoom (0.3–5×), rotate, tap letter for details, reset button

### Name panel
`parseName(raw)` — splits into first/last/full/vowels/consonants/initials.
Uses SE ordinal (A=1…Z=26) and digital root for each component.
6 components: Expression, Soul Urge, Personality, First, Last, Initials.
Resonance detection highlights components sharing values.

### Theme
All visual tokens in `const T` object: T.bg0, T.bg2, T.border, T.text, T.textMid, T.textDim,
T.mono, T.radius, T.radiusLg. Pure black: #000000 background. Mobile-first, 560px max-width.

---

## Protected elements (never change these)

1. **RainbowEye** visual in the header
2. **Ode-N** app name
3. **Shadow cipher formula** — reverse alpha + vowel halving + positional decay + word-position division
4. **Eclipse cipher formula** — Shadow + mirror gap penalty
5. **The 5 categories** (states/patterns/identity/events/language)

---

## Pending items (build these next)

1. Remove PY and PR from CIPHER_KEYS and CIPHERS object
2. Add new Sacred Class ciphers (formulas coming from Buster)
3. Build cipher explanation page — two sections: Standard and Sacred Class
4. SVG export for glyphs (single button, already SVG, trivial to implement)
5. Inverse lookup — enter a number, get all phrases matching on active cipher
6. Session memory via localStorage — save last phrase, last cipher, history
7. Onboarding moment — one sentence + one example phrase shown on first load
8. AI reading layer — Claude API interpretation of cipher values and glyph geometry

---

## Phrase bank stats

- ~6,950 seed phrases (growing)
- Deduplication: normalized (lowercase, letters+spaces only) before comparison
- Categories: each phrase lives in exactly one category (first assignment wins)
- Quality standard: phrases should embody their category, not label it
- Registers in the bank: classical psychological, oracle/poetic, mythopoetic,
  internet-native, street vernacular, temporal/positional, ethical/moral, evaluative

---

## Deployment fix (why Vercel broke it)

The JSX file cannot be deployed raw. It needs a Vite build. Steps:

```bash
npm create vite@latest oden -- --template react
cd oden
# Replace src/App.jsx with our App.jsx
# Delete src/App.css, src/index.css (app has its own styles inline)
# Edit index.html (see below)
npm install
npm run build
# Deploy the dist/ folder to Vercel
```

index.html should be:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ode-N</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #000; color: #fff; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

main.jsx should be:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

package.json dependencies:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.4.0"
  }
}
```

vite.config.js:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

After `npm run build`, deploy the `dist/` folder to Vercel — not the root folder.
Or connect the GitHub repo and Vercel auto-detects Vite.

---

## Co-creator note

This app was built collaboratively by Buster (@douglasbuster1 on TikTok) and Claude.
The Sacred Class ciphers (Shadow, Eclipse, Weighted, and upcoming additions) are
Buster's original inventions. Claude Code should treat these as protected intellectual
property and never alter their formulas without explicit instruction from Buster.
