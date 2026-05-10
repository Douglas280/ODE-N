import { CIPHER_KEYS } from "./constants.js";

/**
 * Find k nearest distinct cipher values using a two-pointer walk from the
 * binary-search insertion point — O(k), no extra allocation or sort.
 */
export function nearestInIndex(idx, sortedVals, cipher, target, k = 6) {
  const vals = sortedVals[cipher];
  const len  = vals.length;
  if (len === 0) return [];

  // Binary search insertion point
  let lo = 0, hi = len;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (vals[mid] < target) lo = mid + 1;
    else hi = mid;
  }

  const results = [];
  let left = lo - 1, right = lo;
  while (results.length < k && (left >= 0 || right < len)) {
    const dLeft  = left  >= 0   ? Math.abs(vals[left]  - target) : Infinity;
    const dRight = right  < len ? Math.abs(vals[right] - target) : Infinity;
    const v = dLeft <= dRight ? vals[left--] : vals[right++];
    results.push({ value: v, delta: v - target, entries: idx[cipher][v].slice() });
  }
  return results;
}

/**
 * Rank database entries against a target value map using only index buckets.
 * Score = (exact cipher matches × 1000) + Σ 1/(1 + |entry_val − target_val|)
 * Only entries that appear in at least one cipher bucket are considered.
 */
export function rankByCrossMatch(indexes, targetValues, exactSet, k = 3) {
  const scoring = new Map(); // id → { e, exactCount, proximity }

  for (const c of CIPHER_KEYS) {
    const bucket = indexes.idx[c][targetValues[c]] || [];
    for (const e of bucket) {
      if (exactSet && exactSet.has(e.id)) continue;
      if (!scoring.has(e.id)) scoring.set(e.id, { e, exactCount: 0, proximity: 0 });
    }
  }

  for (const [, s] of scoring) {
    for (const c of CIPHER_KEYS) {
      const diff = Math.abs(s.e.values[c] - targetValues[c]);
      if (diff === 0) s.exactCount++;
      else s.proximity += 1 / (1 + diff);
    }
  }

  return [...scoring.values()]
    .sort((a, b) => (b.exactCount * 1000 + b.proximity) - (a.exactCount * 1000 + a.proximity))
    .slice(0, k)
    .map(s => s.e);
}
