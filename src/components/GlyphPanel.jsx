import React, { useState, useMemo, useRef, memo } from "react";
import { normalize } from "../engine/normalize.js";
import { buildGlyph, polygonPoints } from "../engine/glyph.js";
import { Card, Inp, EmptyState } from "./ui.jsx";
import { useCopy } from "../hooks/useCopy.js";

const PAD = 20;

function GlyphSvg({ glyph, width, height }) {
  if (!glyph) return null;

  const scaleX = (width - PAD * 2) / Math.max(glyph.width, 1);
  const scaleY = (height - PAD * 2) / Math.max(glyph.height, 1);
  const scale = Math.min(scaleX, scaleY, 4);
  const tx = (width  - glyph.width  * scale) / 2 - glyph.minX * scale;
  const ty = (height - glyph.height * scale) / 2 - glyph.minY * scale;

  const T = (x, y) => ({ x: x * scale + tx, y: y * scale + ty });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Glyph for: ${glyph.label ?? ""}`}
      style={{ display: "block", background: "#07070d" }}
    >
      {/* Aura lines */}
      {glyph.segments.map((seg, i) => {
        const a = T(seg.x1, seg.y1), b = T(seg.x2, seg.y2);
        return (
          <line
            key={`aura-${i}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={seg.color}
            strokeWidth={seg.auraStroke ?? 3}
            strokeLinecap="round"
            opacity={(seg.opacity ?? 0.7) * 0.25}
          />
        );
      })}

      {/* Main segments */}
      {glyph.segments.map((seg, i) => {
        const a = T(seg.x1, seg.y1), b = T(seg.x2, seg.y2);
        return (
          <line
            key={`seg-${i}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={seg.color}
            strokeWidth={seg.strokeWidth ?? 1}
            strokeLinecap="round"
            opacity={seg.opacity ?? 0.9}
          />
        );
      })}

      {/* Flourishes */}
      {glyph.flourishes.map((f, i) => {
        const p = T(f.x, f.y);
        return (
          <circle
            key={`fl-${i}`}
            cx={p.x} cy={p.y}
            r={(f.r ?? 1.5) * scale}
            fill={f.color}
            opacity={f.opacity ?? 0.6}
          />
        );
      })}

      {/* Vowel shapes */}
      {glyph.vowelShapes.map((vs, i) => {
        const pts = polygonPoints(
          vs.cx * scale + tx, vs.cy * scale + ty,
          (vs.r ?? 2) * scale, vs.sides ?? 4, vs.rotation ?? 0
        );
        const d = pts.map((p, j) => `${j === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
        return (
          <path key={`vs-${i}`} d={d} fill="none" stroke={vs.color} strokeWidth={0.6} opacity={vs.opacity ?? 0.5} />
        );
      })}

      {/* Signature arcs */}
      {glyph.signatureArcs.map((arc, i) => {
        const c = T(arc.cx, arc.cy);
        const r = arc.r * scale;
        const d = `M ${c.x + r} ${c.y} A ${r} ${r} 0 1 1 ${c.x + r - 0.001} ${c.y}`;
        return (
          <path
            key={`arc-${i}`}
            d={d}
            fill="none"
            stroke={arc.color}
            strokeWidth={arc.strokeWidth ?? 0.8}
            strokeDasharray={arc.dashArray}
            opacity={arc.opacity ?? 0.4}
          />
        );
      })}
    </svg>
  );
}

export const GlyphPanel = memo(function GlyphPanel({ initialPhrase = "" }) {
  const [raw, setRaw] = useState(initialPhrase);
  const { copied, copy } = useCopy();
  const svgContainerRef = useRef(null);

  const norm = useMemo(() => (raw ? normalize(raw) : ""), [raw]);
  const glyph = useMemo(() => (norm ? buildGlyph(norm) : null), [norm]);

  const svgSize = 360;

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Inp
          value={raw}
          onChange={e => setRaw(e.target.value)}
          placeholder="Enter phrase to generate its glyph…"
          aria-label="Glyph phrase input"
        />

        {!norm && (
          <EmptyState icon="✦" message="Type a phrase to generate its unique glyph signature" />
        )}

        {norm && !glyph && (
          <EmptyState icon="◌" message="Could not render glyph for this phrase" />
        )}

        {glyph && (
          <>
            <div ref={svgContainerRef} className="glyph-svg-wrap">
              <GlyphSvg glyph={glyph} width={svgSize} height={svgSize} />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {norm}
              </span>
              <button
                onClick={() => copy(norm)}
                aria-label={copied ? "Copied" : "Copy phrase"}
                className={`btn${copied ? "" : ""}`}
                style={{
                  fontSize: 11,
                  padding: "5px 10px",
                  color: copied ? "var(--success)" : undefined,
                  borderColor: copied ? "rgba(74,222,128,0.3)" : undefined,
                  background: copied ? "rgba(74,222,128,0.08)" : undefined,
                }}
              >
                {copied ? "✓ Copied" : "Copy phrase"}
              </button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
});
