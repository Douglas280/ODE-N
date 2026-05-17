import React, { useState, useMemo, useCallback, memo } from "react";
import { normalize } from "../engine/normalize.js";
import { calcValues } from "../engine/ciphers.js";
import { rankByCrossMatch, nearestInIndex } from "../engine/ranking.js";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { letterCount, wordCount } from "../engine/normalize.js";
import { CATEGORIES } from "../data/index.js";
import { Card, SectionLabel, FieldLabel, Inp, ValueBadge, CopyBtn, EmptyState, T } from "./ui.jsx";
import { MatchRow } from "./MatchRow.jsx";
import { useDebounce } from "../hooks/useDebounce.js";

const WC_FILTERS = [1, 2, 3, 4, 5];

function wordSimilar(word, indexes, k = 8) {
  if (!indexes) return [];
  const norm   = normalize(word);
  if (!norm) return [];
  const target = calcValues(norm);
  const selfBucket = indexes.idx["simple"][target["simple"]] || [];
  const exactSet   = new Set(selfBucket.filter(e => e.norm === norm).map(e => e.id));
  let results = rankByCrossMatch(indexes, target, exactSet, k);
  if (results.length < k) {
    const seen = new Set(results.map(e => e.id));
    seen.forEach(id => exactSet.add(id));
    for (const c of CIPHER_KEYS) {
      const nearest = nearestInIndex(indexes.idx, indexes.sortedVals, c, target[c], 4);
      for (const n of nearest) {
        for (const e of n.entries) {
          if (!seen.has(e.id) && !exactSet.has(e.id)) {
            results.push(e);
            seen.add(e.id);
          }
        }
      }
      if (results.length >= k) break;
    }
    results = results.slice(0, k);
  }
  return results;
}

export const LookupPanel = memo(function LookupPanel({ indexes, activeCipher, copy, copiedId, onHistoryPush }) {
  const [input,     setInput]     = useState("");
  const [numInput,  setNumInput]  = useState("");
  const [wcFilter,  setWcFilter]  = useState(0);
  const [catFilter, setCatFilter] = useState(new Set());
  const [swapWord,  setSwapWord]  = useState(null);

  const debouncedInput    = useDebounce(input, 80);
  const debouncedNumInput = useDebounce(numInput, 80);
  const ac = CIPHERS[activeCipher];

  const norm     = useMemo(() => normalize(debouncedInput), [debouncedInput]);
  const computed = useMemo(() => {
    if (!norm) return null;
    return { values: calcValues(norm), wc: wordCount(norm), lc: letterCount(norm) };
  }, [norm]);

  const filterEntries = useCallback((arr) => {
    let out = arr;
    if (wcFilter > 0) {
      out = wcFilter === 6 ? out.filter(e => e.wc >= 5) : out.filter(e => e.wc === wcFilter);
    }
    if (catFilter.size > 0 && indexes) {
      const allowed = new Set();
      for (const cat of catFilter) {
        const ids = indexes.catIdx[cat];
        if (ids) for (const id of ids) allowed.add(id);
      }
      out = out.filter(e => allowed.has(e.id));
    }
    return out;
  }, [wcFilter, catFilter, indexes]);

  const matches = useMemo(() => {
    if (!computed || !indexes) return [];
    return filterEntries(indexes.idx[activeCipher][computed.values[activeCipher]] || []);
  }, [computed, indexes, activeCipher, filterEntries]);

  const ranked = useMemo(() => {
    if (!computed || !indexes) return [];
    const exact    = indexes.idx[activeCipher][computed.values[activeCipher]] || [];
    const exactSet = new Set(exact.map(e => e.id));
    return filterEntries(rankByCrossMatch(indexes, computed.values, exactSet, 6)).slice(0, 3);
  }, [computed, indexes, activeCipher, filterEntries]);

  const numTarget = useMemo(() => {
    if (debouncedNumInput.trim() === "") return null;
    const n = parseInt(debouncedNumInput, 10);
    return isNaN(n) ? null : n;
  }, [debouncedNumInput]);

  const numMatches = useMemo(() => {
    if (numTarget === null || !indexes) return [];
    return filterEntries(indexes.idx[activeCipher][numTarget] || []);
  }, [numTarget, indexes, activeCipher, filterEntries]);

  const numRanked = useMemo(() => {
    if (numTarget === null || !indexes) return [];
    const tv = {};
    for (const c of CIPHER_KEYS) tv[c] = numTarget;
    const exactSet = new Set((indexes.idx[activeCipher][numTarget] || []).map(e => e.id));
    return filterEntries(rankByCrossMatch(indexes, tv, exactSet, 6)).slice(0, 3);
  }, [numTarget, indexes, activeCipher, filterEntries]);

  const swapResults = useMemo(() => {
    if (!swapWord || !indexes) return [];
    return wordSimilar(swapWord.word, indexes, 8);
  }, [swapWord, indexes]);

  const wordChips = useMemo(() => norm ? norm.split(" ") : [], [norm]);

  const handleChange    = useCallback(e => { setInput(e.target.value); setSwapWord(null); }, []);
  const handleNumChange = useCallback(e => setNumInput(e.target.value), []);
  const handleKey       = useCallback(e => { if (e.key === "Enter" && norm) onHistoryPush(norm); }, [norm, onHistoryPush]);
  const handleWcFilter  = useCallback(e => {
    const v = +e.currentTarget.dataset.wc;
    setWcFilter(x => x === v ? 0 : v);
  }, []);
  const handleCatFilter = useCallback(e => {
    const cat = e.currentTarget.dataset.cat;
    setCatFilter(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }, []);
  const handleWordTap = useCallback(e => {
    const idx = +e.currentTarget.dataset.widx;
    const w   = e.currentTarget.dataset.word;
    setSwapWord(s => s && s.wordIdx === idx ? null : { wordIdx: idx, word: w });
  }, []);
  const closeSwap = useCallback(() => setSwapWord(null), []);

  return (
    <Card>
      <SectionLabel>Lookup</SectionLabel>
      <Inp
        value={input}
        onChange={handleChange}
        placeholder="any word or phrase..."
        accentColor={ac.color}
        onKeyDown={handleKey}
        style={{ marginBottom: 10 }}
      />

      {computed && norm && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: T.textDim }}>{computed.wc}w · {computed.lc}L</span>
            <CopyBtn text={norm} id="lu-norm" copy={copy} copiedId={copiedId} />
          </div>

          <div style={{
            display: "flex", gap: 6, marginBottom: 12,
            overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
          }}>
            {CIPHER_KEYS.map(c => (
              <ValueBadge key={c} cipher={c} cipherDef={CIPHERS[c]} value={computed.values[c]} showRoot />
            ))}
          </div>

          {wordChips.length > 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
              {wordChips.map((w, i) => {
                const active = swapWord && swapWord.wordIdx === i;
                const wVal   = calcValues(normalize(w))[activeCipher];
                return (
                  <button key={i} data-widx={i} data-word={w} onClick={handleWordTap} style={{
                    padding:       "5px 10px",
                    borderRadius:  T.radius,
                    border:        `1px solid ${active ? ac.color : T.border2}`,
                    background:    active ? `${ac.color}1a` : T.bg2,
                    color:         active ? ac.color : T.textMid,
                    fontSize:      12,
                    fontFamily:    T.mono,
                    cursor:        "pointer",
                    fontWeight:    active ? 700 : 400,
                    display:       "flex",
                    flexDirection: "column",
                    alignItems:    "center",
                    gap:           2,
                  }}>
                    <span>{w}</span>
                    <span style={{ fontSize: 9, color: active ? ac.color : T.textDim, fontWeight: 700 }}>{wVal}</span>
                  </button>
                );
              })}
            </div>
          )}

          {swapWord && (
            <div style={{
              background:   T.bg0,
              border:       `1px solid ${ac.color}55`,
              borderRadius: T.radius,
              padding:      "10px 12px",
              marginBottom: 10,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: ac.color, fontWeight: 700 }}>
                  similar to "{swapWord.word}"
                </span>
                <button onClick={closeSwap} style={{
                  background: "transparent", border: "none", color: T.textDim,
                  cursor: "pointer", fontSize: 14, padding: "0 4px",
                }}>×</button>
              </div>
              {swapResults.length === 0
                ? <EmptyState text="No similar entries found" />
                : swapResults.map(e => (
                  <MatchRow key={e.id} entry={e} cipher={activeCipher} copy={copy} copiedId={copiedId} showAllCiphers />
                ))
              }
            </div>
          )}

          <div style={{
            display: "flex", gap: 5, marginBottom: 8,
            overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
          }}>
            {CATEGORIES.map(({ label, short }) => {
              const on = catFilter.has(label);
              return (
                <button key={label} data-cat={label} onClick={handleCatFilter} style={{
                  padding:      "3px 10px",
                  borderRadius: 20,
                  border:       `1px solid ${on ? ac.color : T.border}`,
                  background:   on ? `${ac.color}1a` : "transparent",
                  color:        on ? ac.color : T.textDim,
                  fontSize:     11,
                  fontFamily:   T.mono,
                  cursor:       "pointer",
                  flexShrink:   0,
                  fontWeight:   on ? 700 : 400,
                }}>{short}</button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
            {WC_FILTERS.map(n => (
              <button key={n} data-wc={n} onClick={handleWcFilter} style={{
                padding:      "3px 10px",
                borderRadius: 20,
                border:       `1px solid ${wcFilter === n ? ac.color : T.border}`,
                background:   wcFilter === n ? `${ac.color}1a` : "transparent",
                color:        wcFilter === n ? ac.color : T.textDim,
                fontSize:     11,
                fontFamily:   T.mono,
                cursor:       "pointer",
              }}>{n}w</button>
            ))}
            <button data-wc={6} onClick={handleWcFilter} style={{
              padding:      "3px 10px",
              borderRadius: 20,
              border:       `1px solid ${wcFilter === 6 ? ac.color : T.border}`,
              background:   wcFilter === 6 ? `${ac.color}1a` : "transparent",
              color:        wcFilter === 6 ? ac.color : T.textDim,
              fontSize:     11, fontFamily: T.mono, cursor: "pointer",
            }}>5+w</button>
          </div>

          <div style={{ fontSize: 11, color: ac.color, fontWeight: 700, marginBottom: 8 }}>
            {matches.length} match{matches.length !== 1 ? "es" : ""} · {ac.short} = {computed.values[activeCipher]}
          </div>

          <div style={{ maxHeight: 280, overflowY: "auto", display: "grid", gap: 4, marginBottom: 12 }}>
            {ranked.length > 0 && (
              <>
                {ranked.map(e => (
                  <MatchRow key={`ranked-${e.id}`} entry={e} cipher={activeCipher} copy={copy} copiedId={copiedId} showAllCiphers />
                ))}
                {matches.length > 0 && <div style={{ borderTop: `1px solid ${T.border}`, margin: "2px 0" }} />}
              </>
            )}
            {matches.length === 0 && ranked.length === 0
              ? <EmptyState text="No database matches" />
              : matches.map(e => (
                <MatchRow key={e.id} entry={e} cipher={activeCipher} copy={copy} copiedId={copiedId} showAllCiphers={false} />
              ))
            }
          </div>
        </>
      )}

      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
        <FieldLabel>{ac.short} value search</FieldLabel>
        <Inp
          type="number"
          value={numInput}
          onChange={handleNumChange}
          placeholder={`search by ${ac.short} value...`}
          accentColor={ac.color}
          style={{ marginBottom: numTarget !== null ? 10 : 0 }}
        />
        {numTarget !== null && (
          <>
            <div style={{ fontSize: 11, color: ac.color, fontWeight: 700, marginBottom: 8 }}>
              {numMatches.length} match{numMatches.length !== 1 ? "es" : ""} · {ac.short} = {numTarget}
            </div>
            <div style={{ maxHeight: 260, overflowY: "auto", display: "grid", gap: 4 }}>
              {numRanked.length > 0 && (
                <>
                  {numRanked.map(e => (
                    <MatchRow key={`numranked-${e.id}`} entry={e} cipher={activeCipher} copy={copy} copiedId={copiedId} showAllCiphers />
                  ))}
                  {numMatches.length > 0 && <div style={{ borderTop: `1px solid ${T.border}`, margin: "2px 0" }} />}
                </>
              )}
              {numMatches.length === 0 && numRanked.length === 0
                ? <EmptyState text="No matches for this value" />
                : numMatches.map(e => (
                  <MatchRow key={e.id} entry={e} cipher={activeCipher} copy={copy} copiedId={copiedId} showAllCiphers={false} />
                ))
              }
            </div>
          </>
        )}
      </div>
    </Card>
  );
});
