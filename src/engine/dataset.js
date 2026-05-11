import { normalize, letterCount, wordCount } from "./normalize.js";
import { calcValues } from "./ciphers.js";
import { CIPHER_KEYS } from "./constants.js";

/**
 * Build the entry array from a flat phrase list.
 * @param {string[]} phrases
 * @param {Map<string,string>} phraseCatMap  normalised phrase → category label
 */
export function buildDataset(phrases, phraseCatMap) {
  const seen = new Set();
  const out  = [];
  let   id   = 0;
  for (let i = 0; i < phrases.length; i++) {
    const raw  = String(phrases[i] ?? "").trim();
    if (!raw) continue;
    const norm = normalize(raw);
    if (!norm || seen.has(norm)) continue;
    const wc = wordCount(norm);
    const lc = letterCount(norm);
    if (wc < 1 || wc > 9 || lc < 1 || lc > 60) continue;
    seen.add(norm);
    const cat = phraseCatMap.get(norm) || "other";
    out.push({ id: id++, raw, norm, cat, values: calcValues(norm), wc, lc });
  }
  return out;
}

/** Build forward + category indexes from an entry array. */
export function buildIndexes(entries) {
  const idx = {};
  for (const c of CIPHER_KEYS) idx[c] = {};

  const catIdx = {};

  for (const e of entries) {
    for (const c of CIPHER_KEYS) {
      const v = e.values[c];
      if (!idx[c][v]) idx[c][v] = [];
      idx[c][v].push(e);
    }
    if (!catIdx[e.cat]) catIdx[e.cat] = new Set();
    catIdx[e.cat].add(e.id);
  }

  const sortedVals = {};
  for (const c of CIPHER_KEYS) {
    sortedVals[c] = Object.keys(idx[c]).map(Number).sort((a, b) => a - b);
  }

  return { idx, sortedVals, catIdx };
}
