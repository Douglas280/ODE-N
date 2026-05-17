import { CIPHER_VOWELS, PYTH_MAP, PRIME_MAP, CIPHER_KEYS } from "./constants.js";
import { normalize, wordCount, letterCount } from "./normalize.js";

/**
 * Single-pass fused cipher — computes simple, reverseSimple, ascii,
 * pythagorean, and prime in one character loop.
 */
export function ciphersFused(norm) {
  let simple = 0, rev = 0, ascii = 0, pyth = 0, prime = 0;
  for (let i = 0; i < norm.length; i++) {
    const cc = norm.charCodeAt(i);
    if (cc < 97 || cc > 122) continue;
    const idx = cc - 97; // 0–25
    const v   = idx + 1; // 1–26
    simple += v;
    rev    += 27 - v;
    ascii  += cc;
    pyth   += PYTH_MAP[idx];
    prime  += PRIME_MAP[idx];
  }
  return { simple, reverseSimple: rev, ascii, pythagorean: pyth, prime };
}

/**
 * Weighted cipher — position-scaled ordinal sum.
 * V(letter) = L × (1 + (p−1)/n) × (1 + (w−1)/W)
 */
export function cipherWeighted(words) {
  const W = words.length;
  if (W === 0) return 0;
  let total = 0;
  for (let wi = 0; wi < W; wi++) {
    const word = words[wi];
    const n = word.length;
    if (n === 0) continue;
    const wFactor = 1 + wi / W;
    for (let pi = 0; pi < n; pi++) {
      total += (word.charCodeAt(pi) - 96) * (1 + pi / n) * wFactor;
    }
  }
  return Math.round(total);
}

/**
 * Shadow + Eclipse ciphers — position-weighted reverse ordinal with vowel halving.
 */
export function cipherShadowEclipse(words) {
  const W = words.length;
  if (W === 0) return { shadow: 0, eclipse: 0 };
  let shadowTotal = 0, eclipseTotal = 0;
  for (let wi = 0; wi < W; wi++) {
    const word = words[wi];
    const n = word.length;
    if (n === 0) continue;
    const freq = {};
    for (let i = 0; i < n; i++) {
      const ch = word[i];
      freq[ch] = (freq[ch] || 0) + 1;
    }
    const adj0     = 27 - (word.charCodeAt(0) - 96);
    const adjFirst = CIPHER_VOWELS.has(word[0])     ? adj0  / 2 : adj0;
    const adjN1    = 27 - (word.charCodeAt(n - 1) - 96);
    const adjLast  = CIPHER_VOWELS.has(word[n - 1]) ? adjN1 / 2 : adjN1;
    let wordTotal = 0;
    for (let i = 0; i < n; i++) {
      const ch = word[i];
      const rv = 27 - (word.charCodeAt(i) - 96);
      wordTotal += (CIPHER_VOWELS.has(ch) ? rv / 2 : rv) * (n - i) * freq[ch];
    }
    const d = wi + 1;
    shadowTotal  += (wordTotal - adjLast) / d;
    eclipseTotal += (wordTotal + Math.abs(adjFirst - adjLast) - adjLast) / d;
  }
  return { shadow: Math.round(shadowTotal), eclipse: Math.round(eclipseTotal) };
}

/** Compute all 8 cipher values for a normalised string. */
export function calcValues(norm) {
  const words = norm.split(" ");
  const fused = ciphersFused(norm);
  const se    = cipherShadowEclipse(words);
  return {
    simple:        fused.simple,
    reverseSimple: fused.reverseSimple,
    weighted:      cipherWeighted(words),
    ascii:         fused.ascii,
    shadow:        se.shadow,
    eclipse:       se.eclipse,
    pythagorean:   fused.pythagorean,
    prime:         fused.prime,
  };
}

/**
 * Evaluate a list of term objects [{id, text, op}] and return totals + avg.
 * Returns null when no terms have non-empty text.
 */
export function calcExpression(terms) {
  const parsed = [];
  for (const t of terms) {
    const norm = normalize(t.text);
    if (!norm.length) continue;
    parsed.push({
      id: t.id, op: t.op, norm,
      values: calcValues(norm),
      wc: wordCount(norm),
      lc: letterCount(norm),
    });
  }
  if (!parsed.length) return null;

  const totals = {};
  for (const c of CIPHER_KEYS) totals[c] = 0;
  let totalWC = 0;

  for (let i = 0; i < parsed.length; i++) {
    const t    = parsed[i];
    const sign = (i === 0 || t.op === "+") ? 1 : -1;
    for (const c of CIPHER_KEYS) totals[c] += sign * t.values[c];
    totalWC += t.wc;
  }

  const avg = {};
  for (const c of CIPHER_KEYS) avg[c] = totalWC > 0 ? Math.round(totals[c] / totalWC) : 0;

  return { parsed, totals, avg, totalWC };
}
