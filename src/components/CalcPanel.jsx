import React, { useState, useMemo, memo } from "react";
import { normalize } from "../engine/normalize.js";
import { calcValues } from "../engine/ciphers.js";
import { rankByCrossMatch } from "../engine/ranking.js";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { Card, Inp, SectionLabel, ValueBadge, EmptyState, LoadingState } from "./ui.jsx";
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

  const bothEmpty = !phraseA && !phraseB;

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Inp
            value={phraseA}
            onChange={e => setPhraseA(e.target.value)}
            placeholder="Phrase A…"
            aria-label="Phrase A"
          />
          <Inp
            value={phraseB}
            onChange={e => setPhraseB(e.target.value)}
            placeholder="Phrase B…"
            aria-label="Phrase B"
          />
        </div>

        {bothEmpty && (
          <EmptyState icon="⇌" message="Enter two phrases to compare their cipher values" />
        )}

        {/* Phrase A values */}
        {valsA && (
          <div className="calc-phrase-block">
            <SectionLabel>A — {normA}</SectionLabel>
            <div className="values-row">
              {CIPHER_KEYS.map(k => (
                <ValueBadge
                  key={k}
                  value={valsA[k]}
                  color={sharedKeys.includes(k) ? CIPHERS[k].color : "#3a3a52"}
                />
              ))}
            </div>
          </div>
        )}

        {/* Phrase B values */}
        {valsB && (
          <div className="calc-phrase-block">
            <SectionLabel>B — {normB}</SectionLabel>
            <div className="values-row">
              {CIPHER_KEYS.map(k => (
                <ValueBadge
                  key={k}
                  value={valsB[k]}
                  color={sharedKeys.includes(k) ? CIPHERS[k].color : "#3a3a52"}
                />
              ))}
            </div>
          </div>
        )}

        {/* Shared cipher result */}
        {valsA && valsB && sharedKeys.length > 0 && (
          <div className="match-highlight">
            <span>✦</span>
            <span>
              Matching on {sharedKeys.map(k => CIPHERS[k].label).join(", ")}
            </span>
          </div>
        )}

        {valsA && valsB && sharedKeys.length === 0 && (
          <EmptyState icon="◌" message="No cipher values match between A and B" />
        )}

        {/* Loading */}
        {!ready && <LoadingState message="Building index…" />}

        {/* Cross-cipher matches for A */}
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
      </div>
    </Card>
  );
});
