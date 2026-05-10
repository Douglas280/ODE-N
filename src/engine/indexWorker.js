import { CATEGORY_DEFS } from "../data/index.js";
import { buildDataset, buildIndexes } from "./dataset.js";

// Build phrase→category map and flat phrase list from single source of truth
const phraseCatMap = new Map();
const allPhrases = [];

for (const cat of CATEGORY_DEFS) {
  for (const phrase of cat.phrases) {
    allPhrases.push(phrase);
    // dataset.js normalises before lookup, but pre-populate with raw too
    phraseCatMap.set(phrase.trim().toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " "), cat.key);
  }
}

const entries = buildDataset(allPhrases, phraseCatMap);
const indexes = buildIndexes(entries);

self.postMessage({ entries, indexes });
