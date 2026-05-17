import React, { useState, useMemo, useCallback, memo } from "react";
import { parseName, NAME_COMPONENTS, COMPONENT_COLORS } from "../engine/nameEngine.js";
import { Card, SectionLabel, Inp, CopyBtn, EmptyState, T } from "./ui.jsx";
import { useDebounce } from "../hooks/useDebounce.js";

export const NamePanel = memo(function NamePanel({ indexes, copy, copiedId }) {
  const [input,   setInput]   = useState("");
  const [focused, setFocused] = useState(null);

  const debouncedInput = useDebounce(input, 100);

  const reading = useMemo(() => {
    const n = debouncedInput.trim();
    if (!n) return null;
    return parseName(n);
  }, [debouncedInput]);

  const focusMatches = useMemo(() => {
    if (!reading || focused === null || !indexes) return [];
    const comp = NAME_COMPONENTS[focused];
    const val  = reading[comp.key];
    return (indexes.idx["simple"][val] || []).slice(0, 20);
  }, [reading, focused, indexes]);

  const resonance = useMemo(() => {
    if (!reading) return [];
    const pairs = [];
    for (let i = 0; i < NAME_COMPONENTS.length; i++) {
      for (let j = i + 1; j < NAME_COMPONENTS.length; j++) {
        if (reading[NAME_COMPONENTS[i].key] === reading[NAME_COMPONENTS[j].key]) {
          pairs.push({ i, j, val: reading[NAME_COMPONENTS[i].key] });
        }
      }
    }
    return pairs;
  }, [reading]);

  const handleChange = useCallback(e => setInput(e.target.value), []);
  const handleFocus  = useCallback(e => {
    const idx = +e.currentTarget.dataset.idx;
    setFocused(f => f === idx ? null : idx);
  }, []);

  return (
    <Card>
      <SectionLabel>Name Reading</SectionLabel>
      <Inp
        value={input}
        onChange={handleChange}
        placeholder="enter a full name..."
        accentColor="#38bdf8"
        style={{ marginBottom: 12 }}
      />

      {reading && (
        <>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {reading.parts.map((p, i) => (
              <span key={i} style={{
                padding:       "3px 10px",
                borderRadius:  6,
                background:    "#38bdf808",
                border:        "1px solid #38bdf833",
                fontSize:      13,
                color:         "#38bdf8",
                fontFamily:    T.mono,
                fontWeight:    700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>{p}</span>
            ))}
          </div>

          <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
            {NAME_COMPONENTS.map((comp, i) => {
              const val      = reading[comp.key];
              const dr       = reading[comp.dr];
              const str      = reading[comp.strKey];
              const color    = COMPONENT_COLORS[i];
              const isActive = focused === i;
              const glows    = resonance.some(r => r.i === i || r.j === i);

              return (
                <div key={comp.key}>
                  <button
                    data-idx={i}
                    onClick={handleFocus}
                    style={{
                      width:          "100%",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "space-between",
                      padding:        "10px 14px",
                      borderRadius:   T.radius,
                      border:         `1px solid ${isActive ? color : glows ? "rgba(255,255,255,0.25)" : color + "33"}`,
                      background:     isActive ? `${color}12` : glows ? "rgba(255,255,255,0.05)" : T.bg2,
                      cursor:         "pointer",
                      textAlign:      "left",
                      boxShadow:      glows && !isActive ? "0 0 8px rgba(255,255,255,0.08)" : "none",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: T.mono }}>{comp.label}</span>
                        <span style={{ fontSize: 9, color: T.textDim }}>{comp.desc}</span>
                      </div>
                      <div style={{ fontSize: 10, color: T.textMid, fontFamily: T.mono, letterSpacing: "0.12em" }}>
                        {str.toUpperCase()}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{
                        fontSize: 22, fontWeight: 900, color, fontFamily: T.mono,
                        textShadow: glows ? `0 0 12px ${color}88` : "none",
                      }}>{val}</div>
                      <div style={{ fontSize: 10, color: `${color}88`, fontFamily: T.mono }}>/{dr}</div>
                    </div>
                  </button>

                  {isActive && (
                    <div style={{ borderLeft: `2px solid ${color}44`, marginLeft: 8, paddingLeft: 10, marginTop: 4, marginBottom: 4 }}>
                      {focusMatches.length === 0
                        ? <div style={{ fontSize: 12, color: T.textDim, padding: "8px 0" }}>No database matches for {val}</div>
                        : focusMatches.map(e => (
                          <div key={e.id} style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", padding: "7px 0",
                            borderBottom: `1px solid ${T.border}`,
                          }}>
                            <span style={{ fontSize: 13, color: T.text }}>{e.raw}</span>
                            <CopyBtn text={e.raw} id={`nm-${e.id}`} copy={copy} copiedId={copiedId} />
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {resonance.length > 0 && (
            <div style={{ background: T.bg0, border: "1px solid rgba(255,255,255,0.12)", borderRadius: T.radius, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: T.textDim, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Resonance</div>
              {resonance.map(({ i, j, val }) => (
                <div key={`${i}-${j}`} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: COMPONENT_COLORS[i], fontFamily: T.mono }}>
                    {NAME_COMPONENTS[i].label}
                  </span>
                  <span style={{ color: T.textDim, fontSize: 11 }}>↔</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: COMPONENT_COLORS[j], fontFamily: T.mono }}>
                    {NAME_COMPONENTS[j].label}
                  </span>
                  <span style={{
                    fontSize: 10, color: "#ffffff", background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 4, padding: "1px 8px", fontFamily: T.mono, fontWeight: 700,
                  }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!reading && input.trim() && (
        <EmptyState text="Could not parse name — letters only" />
      )}
    </Card>
  );
});
