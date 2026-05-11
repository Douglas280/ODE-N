import React, { useState, useMemo, memo } from "react";
import { parseName, NAME_COMPONENTS, COMPONENT_COLORS } from "../engine/nameEngine.js";
import { Card, Inp, SectionLabel, FieldLabel, EmptyState } from "./ui.jsx";

export const NamePanel = memo(function NamePanel() {
  const [raw, setRaw] = useState("");

  const parsed = useMemo(() => (raw.trim() ? parseName(raw) : null), [raw]);

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Inp
          value={raw}
          onChange={e => setRaw(e.target.value)}
          placeholder="Enter full name…"
          aria-label="Full name input"
        />

        {!raw.trim() && (
          <EmptyState icon="✦" message="Enter a name to calculate its numerological components" />
        )}

        {!parsed && raw.trim() && (
          <EmptyState icon="◌" message="Could not parse name — letters only" />
        )}

        {parsed && (
          <>
            <div>
              <SectionLabel>Name breakdown</SectionLabel>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
                gap: 8,
              }}>
                {NAME_COMPONENTS.map((comp, i) => {
                  const color = COMPONENT_COLORS[i % COMPONENT_COLORS.length];
                  return (
                    <div
                      key={comp.key}
                      className="name-card"
                      style={{ borderColor: `${color}33` }}
                    >
                      <FieldLabel>{comp.label}</FieldLabel>
                      <div style={{ color, fontSize: 26, fontWeight: 700, lineHeight: 1.1, marginBottom: 4 }}>
                        {parsed[comp.dr]}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 2 }}>
                        {parsed[comp.key]} · {parsed[comp.strKey]}
                      </div>
                      <div style={{ color: "var(--text-dim)", fontSize: 10 }}>
                        {comp.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <SectionLabel>Name parts</SectionLabel>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {parsed.parts.map((p, i) => (
                  <span key={i} className="part-tag">{p}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
});
