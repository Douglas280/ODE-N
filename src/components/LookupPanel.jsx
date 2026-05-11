import React, { useMemo, memo } from "react";
import { normalize } from "../engine/normalize.js";
import { calcValues } from "../engine/ciphers.js";
import { rankByCrossMatch, nearestInIndex } from "../engine/ranking.js";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { Card, Inp, SectionLabel, ValueBadge, EmptyState } from "./ui.jsx";
import { CipherSelector } from "./CipherSelector.jsx";
import { MatchRow } from "./MatchRow.jsx";

export const LookupPanel = memo(function LookupPanel({
  value,
  onChange,
  indexes,
  ready,
  onHistoryAdd,
}) {
  const [cipher, setCipher] = React.useState("simple");

  const norm = useMemo(() => (value ? normalize(value) : ""), [value]);
  const vals = useMemo(() => (norm ? calcValues(norm) : null), [norm]);

  const exactMatches = useMemo(() => {
    if (!vals || !ready || !indexes) return [];
    const bucket = indexes.idx[cipher]?.[vals[cipher]] ?? [];
    const exactSet = new Set(bucket.map(e => e.id));
    return bucket;
  }, [vals, cipher, indexes, ready]);

  const nearMatches = useMemo(() => {
    if (!vals || !ready || !indexes) return [];
    const exactSet = new Set(exactMatches.map(e => e.id));
    const groups = nearestInIndex(indexes.idx, indexes.sortedVals, cipher, vals[cipher], 4);
    return groups
      .filter(g => g.delta !== 0)
      .flatMap(g => g.entries.filter(e => !exactSet.has(e.id)).slice(0, 2));
  }, [vals, cipher, indexes, ready, exactMatches]);

  const crossMatches = useMemo(() => {
    if (!vals || !ready || !indexes) return [];
    const exactSet = new Set(exactMatches.map(e => e.id));
    return rankByCrossMatch(indexes, vals, exactSet, 5);
  }, [vals, indexes, ready, exactMatches]);

  const handleAddHistory = () => {
    if (norm && vals) onHistoryAdd?.({ raw: value.trim(), norm, values: vals });
  };

  const activeVal = vals?.[cipher];

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Inp
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Enter a phrase…"
            aria-label="Phrase input"
            style={{ flex: 1 }}
          />
          <button
            onClick={handleAddHistory}
            disabled={!norm}
            aria-label="Add to history"
            style={{
              background: "#2a2a35",
              border: "1px solid #3a3a48",
              borderRadius: 6,
              color: "#e8e8f0",
              cursor: norm ? "pointer" : "not-allowed",
              opacity: norm ? 1 : 0.4,
              padding: "0 14px",
            }}
          >
            +
          </button>
        </div>

        <CipherSelector active={cipher} onChange={setCipher} />

        {vals && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CIPHER_KEYS.map(k => (
              <ValueBadge key={k} value={vals[k]} color={CIPHERS[k].color} />
            ))}
          </div>
        )}

        {!ready && (
          <EmptyState message="Building index…" />
        )}

        {ready && norm && exactMatches.length === 0 && (
          <EmptyState message={`No exact matches for ${cipher} = ${activeVal}`} />
        )}

        {exactMatches.length > 0 && (
          <div>
            <SectionLabel>Exact matches — {CIPHERS[cipher].label} {activeVal}</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {exactMatches.slice(0, 12).map(e => (
                <MatchRow key={e.id} entry={e} targetValues={vals} onSelect={onChange} />
              ))}
            </div>
          </div>
        )}

        {nearMatches.length > 0 && (
          <div>
            <SectionLabel>Near matches</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {nearMatches.map(e => (
                <MatchRow key={e.id} entry={e} targetValues={vals} onSelect={onChange} />
              ))}
            </div>
          </div>
        )}

        {crossMatches.length > 0 && (
          <div>
            <SectionLabel>Cross-cipher matches</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {crossMatches.map(e => (
                <MatchRow key={e.id} entry={e} targetValues={vals} onSelect={onChange} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});
