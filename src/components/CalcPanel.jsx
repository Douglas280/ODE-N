import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
import { calcExpression } from "../engine/ciphers.js";
import { nearestInIndex } from "../engine/ranking.js";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { digitalRoot } from "../engine/normalize.js";
import { Card, SectionLabel, Btn, CopyBtn, EmptyState, T, baseInputStyle } from "./ui.jsx";
import { MatchRow } from "./MatchRow.jsx";

let _termId = 0;
function newTerm(op = "+") { return { id: _termId++, text: "", op }; }

const TERM_ROW_STYLE = { display: "flex", gap: 4, marginBottom: 6, alignItems: "center" };
const TERM_NUM_STYLE = {
  width: 22, fontSize: 10, color: "#444444", textAlign: "center",
  flexShrink: 0, fontFamily: T.mono, fontWeight: 700,
};

export const CalcPanel = memo(function CalcPanel({ indexes, activeCipher, copy, copiedId }) {
  const [terms,       setTerms]      = useState(() => [newTerm("+"), newTerm("+")]);
  const [showMatches, setShowMatches] = useState(false);
  const [view,        setView]       = useState("terms");
  const [showAvg,     setShowAvg]    = useState(false);
  const [showNearest, setShowNearest] = useState(false);
  const [expandCipher, setExpandCipher] = useState(activeCipher);

  useEffect(() => { setExpandCipher(activeCipher); }, [activeCipher]);
  const ac = CIPHERS[activeCipher];

  const result = useMemo(() => calcExpression(terms), [terms]);

  const activeValues = useMemo(() => {
    if (!result) return null;
    return showAvg ? result.avg : result.totals;
  }, [result, showAvg]);

  const allMatches = useMemo(() => {
    if (!activeValues || !indexes) return {};
    const out = {};
    for (const c of CIPHER_KEYS) {
      const v = activeValues[c];
      out[c] = v >= 0 ? (indexes.idx[c][v] || []) : [];
    }
    return out;
  }, [activeValues, indexes]);

  const nearest = useMemo(() => {
    if (!activeValues || !showNearest || !indexes) return null;
    const v     = activeValues[expandCipher];
    const exact = indexes.idx[expandCipher][v] || [];
    if (exact.length > 0) return null;
    return nearestInIndex(indexes.idx, indexes.sortedVals, expandCipher, v, 6);
  }, [activeValues, showNearest, indexes, expandCipher]);

  const parsedTerms = result ? result.parsed : [];

  const resonance = useMemo(() => {
    if (!parsedTerms || parsedTerms.length < 2) return { pairs: [], glowCiphers: new Set() };
    const pairs = [], glowCiphers = new Set();
    for (let i = 0; i < parsedTerms.length; i++) {
      for (let j = i + 1; j < parsedTerms.length; j++) {
        const shared = [];
        for (const c of CIPHER_KEYS) {
          if (parsedTerms[i].values[c] === parsedTerms[j].values[c]) {
            shared.push(c); glowCiphers.add(c);
          }
        }
        if (shared.length) pairs.push({ i, j, shared });
      }
    }
    return { pairs, glowCiphers };
  }, [parsedTerms]);

  const chartMatches = useMemo(() => {
    if (!activeValues || !showMatches || !indexes) return [];
    const seen = new Set(), scored = [];
    for (const c of CIPHER_KEYS) {
      for (const e of (indexes.idx[c][activeValues[c]] || [])) {
        if (seen.has(e.id)) continue;
        seen.add(e.id);
        let hits = 0;
        const hitCiphers = [];
        for (const cc of CIPHER_KEYS) {
          if (e.values[cc] === activeValues[cc]) { hits++; hitCiphers.push(cc); }
        }
        scored.push({ e, hits, hitCiphers });
      }
    }
    scored.sort((a, b) => b.hits - a.hits);
    return scored;
  }, [activeValues, indexes, showMatches]);

  const handleTermText = useCallback(e => {
    const id = e.currentTarget.dataset.id;
    const val = e.currentTarget.value;
    setTerms(ts => ts.map(t => t.id === +id ? { ...t, text: val } : t));
  }, []);
  const handleTermOp = useCallback(e => {
    const id = e.currentTarget.dataset.id;
    const val = e.currentTarget.value;
    setTerms(ts => ts.map(t => t.id === +id ? { ...t, op: val } : t));
  }, []);
  const handleRemoveTerm = useCallback(e => {
    const id = +e.currentTarget.dataset.id;
    setTerms(ts => ts.length > 1 ? ts.filter(t => t.id !== id) : ts);
  }, []);
  const addTerm  = useCallback(() => setTerms(ts => [...ts, newTerm("+")]), []);
  const clearAll = useCallback(() => { setTerms([newTerm("+"), newTerm("+")]); setView("terms"); setShowMatches(false); }, []);
  const handleViewTerms   = useCallback(() => setView("terms"), []);
  const handleViewMatches = useCallback(() => { setView("chart"); setShowMatches(true); }, []);

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <SectionLabel>Calculator</SectionLabel>
        <div style={{ display: "flex", gap: 4 }}>
          <Btn active={view === "terms"} color={ac.color} onClick={handleViewTerms} style={{ fontSize: 10, padding: "3px 8px" }}>terms</Btn>
          <Btn active={view === "chart"} color={ac.color} onClick={handleViewMatches} style={{ fontSize: 10, padding: "3px 8px" }}>matches</Btn>
          <Btn onClick={addTerm}  style={{ fontSize: 10, padding: "3px 7px" }}>+</Btn>
          <Btn onClick={clearAll} style={{ fontSize: 10, padding: "3px 7px" }}>clear</Btn>
        </div>
      </div>

      {view === "terms" && (
        <>
          {terms.map((t, i) => (
            <div key={t.id} style={TERM_ROW_STYLE}>
              <div style={TERM_NUM_STYLE}>{i + 1}</div>
              {i > 0 && (
                <select
                  data-id={t.id}
                  value={t.op}
                  onChange={handleTermOp}
                  style={{ ...baseInputStyle, width: 36, padding: "6px 3px", flexShrink: 0, textAlign: "center" }}
                >
                  <option value="+">+</option>
                  <option value="-">−</option>
                </select>
              )}
              <input
                data-id={t.id}
                value={t.text}
                onChange={handleTermText}
                placeholder={`Term ${i + 1}`}
                style={{ ...baseInputStyle, flex: 1, borderColor: t.text ? `${ac.color}55` : T.border }}
              />
              <Btn data-id={t.id} onClick={handleRemoveTerm} style={{ padding: "4px 6px", color: "#ef4444", borderColor: "transparent", flexShrink: 0 }}>×</Btn>
            </div>
          ))}

          {result && (
            <>
              <div style={{ background: T.bg0, border: `1px solid ${ac.color}44`, borderRadius: T.radius, padding: "8px 10px", marginTop: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, color: T.textDim }}>
                      {showAvg ? `avg · ÷${result.totalWC}w` : `totals · ${result.totalWC}w`}
                    </span>
                    <Btn active={showAvg} color={ac.color} onClick={() => setShowAvg(x => !x)} style={{ fontSize: 9, padding: "2px 7px" }}>avg</Btn>
                  </div>
                  <CopyBtn
                    text={CIPHER_KEYS.map(c => `${CIPHERS[c].short}:${activeValues[c]}`).join(" ")}
                    id="calc-totals" copy={copy} copiedId={copiedId}
                  />
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {CIPHER_KEYS.map(c => {
                    const glows = resonance.glowCiphers.has(c);
                    return (
                      <span key={c} style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", borderRadius: 6,
                        border:      `1px solid ${glows ? "rgba(255,255,255,0.5)" : CIPHERS[c].color + "33"}`,
                        fontSize:    12, fontFamily: T.mono, fontWeight: 700,
                        color:       glows ? "#ffffff" : CIPHERS[c].color,
                        background:  glows ? "rgba(255,255,255,0.08)" : "transparent",
                        boxShadow:   glows ? "0 0 8px rgba(255,255,255,0.2)" : "none",
                        flexShrink:  0,
                      }}>
                        <span style={{ opacity: 0.55, fontWeight: 400, fontSize: 10 }}>{CIPHERS[c].short}</span>
                        {activeValues[c]}
                        <span style={{ opacity: 0.4, fontSize: 9 }}>/{digitalRoot(activeValues[c])}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {resonance.pairs.length > 0 && (
                <div style={{ background: T.bg0, border: "1px solid rgba(255,255,255,0.12)", borderRadius: T.radius, padding: "8px 10px", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: T.textDim, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Resonance</div>
                  {resonance.pairs.map(({ i, j, shared }) => (
                    <div key={`${i}-${j}`} style={{ fontSize: 11, color: T.textMid, marginBottom: 3, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ color: T.text, fontWeight: 700 }}>{i + 1}</span>
                      <span style={{ color: T.textDim }}>↔</span>
                      <span style={{ color: T.text, fontWeight: 700 }}>{j + 1}</span>
                      <span style={{ color: T.textDim }}>·</span>
                      {shared.map(c => (
                        <span key={c} style={{
                          fontSize: 10, fontFamily: T.mono, fontWeight: 700,
                          color: "#ffffff", background: `${CIPHERS[c].color}30`,
                          border: `1px solid ${CIPHERS[c].color}`,
                          borderRadius: 4, padding: "1px 6px",
                        }}>{CIPHERS[c].short} {parsedTerms[i].values[c]}</span>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
                {CIPHER_KEYS.map(c => {
                  const hits = allMatches[c]?.length || 0;
                  const { color, short } = CIPHERS[c];
                  return (
                    <Btn key={c} active={expandCipher === c} color={color} onClick={() => setExpandCipher(c)}>
                      {short} <span style={{ opacity: 0.7 }}>({hits})</span>
                    </Btn>
                  );
                })}
                <Btn active={showNearest} color={ac.color} onClick={() => setShowNearest(x => !x)} style={{ marginLeft: "auto" }}>nearest</Btn>
              </div>

              <div style={{ maxHeight: 200, overflowY: "auto", display: "grid", gap: 3 }}>
                {(allMatches[expandCipher] || []).length === 0 && !nearest
                  ? <EmptyState text={`No matches · ${CIPHERS[expandCipher].short} = ${activeValues[expandCipher]}`} />
                  : (allMatches[expandCipher] || []).map(e => (
                    <MatchRow key={e.id} entry={e} cipher={expandCipher} copy={copy} copiedId={copiedId} showAllCiphers />
                  ))
                }
                {nearest && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 9, color: T.textDim, marginBottom: 4 }}>NEAREST VALUES</div>
                    {nearest.map(n => (
                      <div key={n.value} style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 10, color: CIPHERS[expandCipher].color, fontFamily: T.mono }}>
                          {n.value} <span style={{ color: T.textDim }}>({n.delta > 0 ? "+" : ""}{n.delta})</span>
                        </div>
                        <div style={{ paddingLeft: 8 }}>
                          {n.entries.slice(0, 3).map(e => (
                            <div key={e.id} style={{ fontSize: 10, color: T.textMid, marginTop: 1 }}>{e.raw}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {view === "chart" && (
        <>
          {parsedTerms.length === 0
            ? <EmptyState text="Enter terms to see matches" />
            : chartMatches.length === 0
              ? <EmptyState text="No database matches found" />
              : (
                <>
                  <div style={{ fontSize: 10, color: T.textDim, marginBottom: 8 }}>
                    {chartMatches.length} match{chartMatches.length !== 1 ? "es" : ""} · sorted by cipher overlap
                  </div>
                  <div style={{ maxHeight: 440, overflowY: "auto", display: "grid", gap: 4 }}>
                    {chartMatches.map(({ e, hits, hitCiphers }) => (
                      <div key={e.id} style={{
                        padding:   "6px 8px",
                        borderRadius: 6,
                        background: hits > 1 ? "rgba(255,255,255,0.06)" : T.bg0,
                        border:    `1px solid ${hits > 1 ? "rgba(255,255,255,0.2)" : T.border}`,
                        boxShadow: hits > 1 ? "0 0 8px rgba(255,255,255,0.06)" : "none",
                      }}>
                        <div style={{ color: hits > 1 ? "#ffffff" : T.text, fontSize: 12, lineHeight: 1.3, marginBottom: 4 }}>{e.raw}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                          {hitCiphers.map(c => (
                            <span key={c} style={{
                              fontSize: 9, fontFamily: T.mono, fontWeight: 700,
                              color:      hits > 1 ? "#ffffff" : CIPHERS[c].color,
                              background: hits > 1 ? `${CIPHERS[c].color}30` : `${CIPHERS[c].color}15`,
                              border:     `1px solid ${hits > 1 ? CIPHERS[c].color : CIPHERS[c].color + "44"}`,
                              borderRadius: 4, padding: "1px 5px",
                            }}>{CIPHERS[c].short} {e.values[c]}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
          }
        </>
      )}
    </Card>
  );
});
