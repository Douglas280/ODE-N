import React, { memo } from "react";
import { buildGlyph, polygonPoints, letterColor } from "../engine/glyph.js";
import { useGlyph } from "../hooks/useGlyph.js";
import { Card, Inp, EmptyState } from "./ui.jsx";
import { useCopy } from "../hooks/useCopy.js";

const PAD = 20;

/**
 * Re-builds the smooth SVG path from a segment's point array, applying the
 * viewport transform T so that the path renders in scaled/translated space.
 * Uses quadratic beziers through midpoints for smoothness, with explicit L
 * segments at hard corners and at the final point.
 */
function buildSvgPath(points, T) {
  if (points.length < 2) return "";
  const s = T(points[0].x, points[0].y);
  let d = `M ${s.x.toFixed(2)} ${s.y.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const tp    = T(points[i].x, points[i].y);
    const tPrev = T(points[i - 1].x, points[i - 1].y);
    if (i === 1 || points[i].hardCorner) {
      d += ` L ${tp.x.toFixed(2)} ${tp.y.toFixed(2)}`;
    } else {
      const mx = (tPrev.x + tp.x) / 2;
      const my = (tPrev.y + tp.y) / 2;
      d += ` Q ${tPrev.x.toFixed(2)} ${tPrev.y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
    }
  }
  // Close to the exact last point (quadratic bezier stops at a midpoint).
  const last = T(points[points.length - 1].x, points[points.length - 1].y);
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

function GlyphSvg({ glyph, norm, width, height }) {
  if (!glyph) return null;

  const scaleX = (width - PAD * 2) / Math.max(glyph.width, 1);
  const scaleY = (height - PAD * 2) / Math.max(glyph.height, 1);
  const scale  = Math.min(scaleX, scaleY, 4);
  const ox     = (width  - glyph.width  * scale) / 2 - glyph.minX * scale;
  const oy     = (height - glyph.height * scale) / 2 - glyph.minY * scale;
  const T      = (x, y) => ({ x: x * scale + ox, y: y * scale + oy });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={norm ? `Glyph for: ${norm}` : "Glyph"}
      style={{ display: "block", background: "#0a0a0e", borderRadius: 8 }}
    >
      {/* Aura glow */}
      {glyph.segments.map((seg, i) => {
        const d = buildSvgPath(seg.points, T);
        if (!d) return null;
        const letters = seg.points.filter(p => !p.isStart);
        const avg = letters.length
          ? Math.round(letters.reduce((s, p) => s + p.simple, 0) / letters.length)
          : 13;
        return (
          <path
            key={`aura-${i}`}
            d={d}
            fill="none"
            stroke={letterColor(avg, 0.2, glyph.saturation)}
            strokeWidth={glyph.auraStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}

      {/* Word-to-word connector dashes */}
      {glyph.wordConnections.map((conn, i) => {
        const a = T(conn.x1, conn.y1);
        const b = T(conn.x2, conn.y2);
        return (
          <line
            key={`conn-${i}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="#6b6b80"
            strokeWidth={0.5}
            strokeDasharray="2 3"
            opacity={0.4}
          />
        );
      })}

      {/* Main segment paths */}
      {glyph.segments.map((seg, i) => {
        const d = buildSvgPath(seg.points, T);
        if (!d) return null;
        const first = seg.points.find(p => !p.isStart);
        return (
          <path
            key={`seg-${i}`}
            d={d}
            fill="none"
            stroke={letterColor(first?.simple ?? 13, 0.9, glyph.saturation)}
            strokeWidth={glyph.baseStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}

      {/* Closing line */}
      {glyph.closingLine && (() => {
        const a = T(glyph.closingLine.x1, glyph.closingLine.y1);
        const b = T(glyph.closingLine.x2, glyph.closingLine.y2);
        return (
          <line
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="#6b6b80"
            strokeWidth={0.5}
            strokeDasharray="3 3"
            opacity={0.5}
          />
        );
      })()}

      {/* Flourish ticks */}
      {glyph.flourishes.filter(f => !f.type).map((f, i) => {
        const a = T(f.x1, f.y1);
        const b = T(f.x2, f.y2);
        return (
          <line
            key={`fl-${i}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={letterColor(f.simple || 1, f.opacity ?? 0.6, glyph.saturation)}
            strokeWidth={0.5}
            strokeLinecap="round"
            opacity={f.opacity ?? 0.6}
          />
        );
      })}

      {/* Flourish arcs */}
      {glyph.flourishes.filter(f => f.type === "arc").map((f, i) => {
        const p = T(f.cx, f.cy);
        return (
          <circle
            key={`fl-arc-${i}`}
            cx={p.x} cy={p.y}
            r={Math.max(f.r * scale, 1)}
            fill="none"
            stroke={letterColor(f.simple || 1, f.opacity ?? 0.5, glyph.saturation)}
            strokeWidth={0.5}
            opacity={f.opacity ?? 0.5}
          />
        );
      })}

      {/* Vowel polygon shapes */}
      {glyph.vowelShapes.map((vs, i) => {
        const p   = T(vs.cx, vs.cy);
        const r   = Math.max((vs.radius ?? 2) * scale, 1);
        const pts = polygonPoints(p.x, p.y, r, vs.sides ?? 4, vs.rotation ?? 0);
        const d   = pts.map((pt, j) => `${j === 0 ? "M" : "L"}${pt.x.toFixed(2)},${pt.y.toFixed(2)}`).join(" ") + " Z";
        return (
          <path
            key={`vs-${i}`}
            d={d}
            fill="none"
            stroke={letterColor(vs.simple || 1, 0.5, glyph.saturation)}
            strokeWidth={0.6}
            opacity={0.5}
          />
        );
      })}

      {/* Signature arcs at word start points */}
      {glyph.signatureArcs.map((arc, i) => {
        const c    = T(arc.cx, arc.cy);
        const r    = Math.max((arc.radius ?? 2) * scale, 1);
        const span = arc.arcSpan ?? Math.PI * 2;
        const a0   = arc.angle - span / 2;
        const a1   = arc.angle + span / 2;
        const x1   = c.x + r * Math.cos(a0);
        const y1   = c.y + r * Math.sin(a0);
        const x2   = c.x + r * Math.cos(a1);
        const y2   = c.y + r * Math.sin(a1);
        const d    = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${span > Math.PI ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
        return (
          <path
            key={`sarc-${i}`}
            d={d}
            fill="none"
            stroke="#6b6b80"
            strokeWidth={0.8}
            opacity={0.4}
          />
        );
      })}

      {/* Self-intersection markers (capped at 20 to avoid visual noise) */}
      {glyph.crossings.slice(0, 20).map((c, i) => {
        const p = T(c.x, c.y);
        return (
          <circle key={`cross-${i}`} cx={p.x} cy={p.y} r={1.5} fill="#e8e8f0" opacity={0.25} />
        );
      })}

      {/* Symmetry axis */}
      {glyph.symmetryAxis && (() => {
        const ax = glyph.symmetryAxis;
        const dx = Math.cos(ax.angle) * ax.length;
        const dy = Math.sin(ax.angle) * ax.length;
        const a  = T(ax.cx - dx, ax.cy - dy);
        const b  = T(ax.cx + dx, ax.cy + dy);
        return (
          <line
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="#4ade80"
            strokeWidth={0.5}
            strokeDasharray="4 4"
            opacity={ax.strength * 0.3}
          />
        );
      })()}
    </svg>
  );
}

export const GlyphPanel = memo(function GlyphPanel({ initialPhrase = "" }) {
  const { raw, setRaw, norm, glyph } = useGlyph(initialPhrase);
  const { copied, copy } = useCopy();

  const svgSize = 360;

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Inp
          value={raw}
          onChange={e => setRaw(e.target.value)}
          placeholder="Enter phrase for glyph…"
          aria-label="Glyph phrase input"
        />

        {!norm && <EmptyState message="Enter a phrase to generate its glyph" />}
        {norm && !glyph && <EmptyState message="Could not render glyph for this phrase" />}

        {glyph && (
          <>
            <GlyphSvg glyph={glyph} norm={norm} width={svgSize} height={svgSize} />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#6b6b80", flex: 1 }}>{norm}</span>
              <button
                onClick={() => copy(norm)}
                aria-label={copied ? "Copied" : "Copy phrase"}
                style={{
                  background: "#2a2a35",
                  border: "1px solid #3a3a48",
                  borderRadius: 6,
                  color: copied ? "#4ade80" : "#6b6b80",
                  cursor: "pointer",
                  fontSize: 11,
                  padding: "4px 8px",
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
