import React, { useState, useMemo, memo } from "react";
import { normalize } from "../engine/normalize.js";
import { calcValues } from "../engine/ciphers.js";
import { rankByCrossMatch } from "../engine/ranking.js";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { Card, Inp, SectionLabel, ValueBadge, EmptyState } from "./ui.jsx";
import { MatchRow } from "./MatchRow.jsx";

export const CalcPanel = memo(function CalcPanel({ indexes, ready }) {
  const [phraseA, setPhraseA] = useState("");
  const [phraseB, setPhraseB] = useState("");

  const normA = useMemo(() => (phraseA ? normalize(phraseA) : ""), [phraseA]);
  const normB = useMemo(() => (phraseB ? normalize(phraseB) : ""), [phraseB]);
  const valsA = useMemo(() => (normA ? calcValues(normA) : null), [normA]);
  const valsB = useMemo(() => (normB ? calcValues(normB) : null), [normB]);

  const sharedKeys = useMemo(() => {
    if (!valsA || !valsB) return [];
    return CIPHER_KEYS.filter(k => valsA[k] === valsB[k]);
  }, [valsA, valsB]);

  const crossMatches = useMemo(() => {
    if (!valsA || !ready || !indexes) return [];
    return rankByCrossMatch(indexes, valsA, null, 5);
  }, [valsA, indexes, ready]);

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Inp value={phraseA} onChange={e => setPhraseA(e.target.value)} placeholder="Phrase A…" aria-label="Phrase A" />
          <Inp value={phraseB} onChange={e => setPhraseB(e.target.value)} placeholder="Phrase B…" aria-label="Phrase B" />
        </div>

        {valsA && (
          <div>
            <SectionLabel>A — {normA}</SectionLabel>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CIPHER_KEYS.map(k => (
                <ValueBadge key={k} value={valsA[k]} color={sharedKeys.includes(k) ? CIPHERS[k].color : "#6b6b80"} />
              ))}
            </div>
          </div>
        )}

        {valsB && (
          <div>
            <SectionLabel>B — {normB}</SectionLabel>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CIPHER_KEYS.map(k => (
                <ValueBadge key={k} value={valsB[k]} color={sharedKeys.includes(k) ? CIPHERS[k].color : "#6b6b80"} />
              ))}
            </div>
          </div>
        )}

        {sharedKeys.length > 0 && (
          <div style={{ fontSize: 12, color: "#4ade80" }}>
            Matching ciphers: {sharedKeys.map(k => CIPHERS[k].short).join(", ")}
          </div>
        )}

        {valsA && valsB && sharedKeys.length === 0 && (
          <EmptyState message="No cipher values match between A and B" />
        )}

        {crossMatches.length > 0 && (
          <div>
            <SectionLabel>Cross-cipher matches for A</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {crossMatches.map(e => (
                <MatchRow key={e.id} entry={e} targetValues={valsA} />
              ))}
            </div>
          </div>
        )}

        {!ready && <EmptyState message="Building index…" />}
      </div>
    </Card>
  );
});
