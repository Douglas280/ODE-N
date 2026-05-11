import React, { useState, useMemo, memo } from "react";
import { parseName, NAME_COMPONENTS, COMPONENT_COLORS } from "../engine/nameEngine.js";
import { Card, Inp, SectionLabel, FieldLabel, ValueBadge, EmptyState } from "./ui.jsx";

export const NamePanel = memo(function NamePanel() {
  const [raw, setRaw] = useState("");

  const parsed = useMemo(() => (raw.trim() ? parseName(raw) : null), [raw]);

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Inp
          value={raw}
          onChange={e => setRaw(e.target.value)}
          placeholder="Enter full name…"
          aria-label="Full name input"
        />

        {!parsed && raw.trim() && (
          <EmptyState message="Could not parse name — letters only" />
        )}

        {parsed && (
          <>
            <div>
              <SectionLabel>Name breakdown</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
                {NAME_COMPONENTS.map((comp, i) => {
                  const color = COMPONENT_COLORS[i % COMPONENT_COLORS.length];
                  return (
                    <div
                      key={comp.key}
                      style={{
                        background: "#0f0f13",
                        border: `1px solid ${color}44`,
                        borderRadius: 8,
                        padding: "10px 12px",
                      }}
                    >
                      <FieldLabel>{comp.label}</FieldLabel>
                      <div style={{ color, fontSize: 22, fontWeight: 700 }}>
                        {parsed[comp.dr]}
                      </div>
                      <div style={{ color: "#6b6b80", fontSize: 11, marginTop: 2 }}>
                        {parsed[comp.key]} · {parsed[comp.strKey]}
                      </div>
                      <div style={{ color: "#6b6b80", fontSize: 10, marginTop: 2 }}>
                        {comp.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <SectionLabel>Parts</SectionLabel>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {parsed.parts.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#2a2a35",
                      borderRadius: 4,
                      color: "#e8e8f0",
                      fontSize: 12,
                      padding: "3px 8px",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
});
