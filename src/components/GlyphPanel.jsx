import React, { useState, useMemo, useEffect, useRef, useCallback, memo } from "react";
import { normalize } from "../engine/normalize.js";
import { calcValues } from "../engine/ciphers.js";
import { buildGlyph, polygonPoints, letterColor } from "../engine/glyph.js";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { Card, SectionLabel, Inp, CopyBtn, ValueBadge, T } from "./ui.jsx";
import { useDebounce } from "../hooks/useDebounce.js";

function getTwoFingerState(touches) {
  if (!touches || touches.length < 2) return null;
  const dx = touches[1].clientX - touches[0].clientX;
  const dy = touches[1].clientY - touches[0].clientY;
  return { dist: Math.sqrt(dx * dx + dy * dy), angle: Math.atan2(dy, dx) };
}

export const GlyphPanel = memo(function GlyphPanel({ copy, copiedId }) {
  const [input,    setInput]    = useState("");
  const [tx,       setTx]       = useState(0);
  const [ty,       setTy]       = useState(0);
  const [scale,    setScale]    = useState(1);
  const [rot,      setRot]      = useState(0);
  const [selected, setSelected] = useState(null);

  const gestureRef = useRef({
    mode: null, startX: 0, startY: 0, startTx: 0, startTy: 0,
    startDist: 1, startScale: 1, startAngle: 0, startRot: 0, moved: false,
  });

  const debouncedInput = useDebounce(input, 120);
  const norm   = useMemo(() => normalize(debouncedInput), [debouncedInput]);
  const glyph  = useMemo(() => norm ? buildGlyph(norm) : null, [norm]);
  const values = useMemo(() => norm ? calcValues(norm) : null, [norm]);

  const totalLetters = useMemo(() => {
    if (!glyph) return 0;
    let n = 0;
    for (const s of glyph.segments) n += s.points.length - 1;
    return n;
  }, [glyph]);

  useEffect(() => {
    setTx(0); setTy(0); setScale(1); setRot(0); setSelected(null);
  }, [norm]);

  const handleChange     = useCallback(e => setInput(e.target.value), []);
  const handleReset      = useCallback(() => { setTx(0); setTy(0); setScale(1); setRot(0); setSelected(null); }, []);
  const handlePointerEnd = useCallback(() => { gestureRef.current.mode = null; }, []);
  const handleWheel      = useCallback(e => {
    e.preventDefault();
    setScale(s => Math.max(0.3, Math.min(5, s * (e.deltaY < 0 ? 1.1 : 0.9))));
  }, []);
  const handleLetterTap = useCallback((si, pi, pt) => {
    if (gestureRef.current.moved) return;
    setSelected(sel => sel && sel.segIdx === si && sel.ptIdx === pi ? null : { segIdx: si, ptIdx: pi, ...pt });
  }, []);
  const handlePointerStart = useCallback(e => {
    const g = gestureRef.current; g.moved = false;
    if (e.touches && e.touches.length === 2) {
      const ts = getTwoFingerState(e.touches);
      g.mode = "pinch"; g.startDist = ts.dist; g.startAngle = ts.angle;
      g.startScale = scale; g.startRot = rot; e.preventDefault();
    } else {
      const p = e.touches ? e.touches[0] : e;
      g.mode = "pan"; g.startX = p.clientX; g.startY = p.clientY; g.startTx = tx; g.startTy = ty;
    }
  }, [tx, ty, scale, rot]);
  const handlePointerMove = useCallback(e => {
    const g = gestureRef.current; if (!g.mode) return;
    if (g.mode === "pinch" && e.touches && e.touches.length === 2) {
      const ts = getTwoFingerState(e.touches);
      setScale(Math.max(0.3, Math.min(5, g.startScale * (ts.dist / g.startDist))));
      setRot(g.startRot + (ts.angle - g.startAngle));
      g.moved = true; e.preventDefault();
    } else if (g.mode === "pan") {
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - g.startX, dy = p.clientY - g.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) g.moved = true;
      setTx(g.startTx + dx); setTy(g.startTy + dy);
    }
  }, []);

  const showLabels = totalLetters > 0 && totalLetters <= 10;
  const sat  = (glyph && isFinite(glyph.saturation)) ? glyph.saturation : 78;
  const gW   = (glyph && glyph.width  > 0) ? glyph.width  : 360;
  const gH   = (glyph && glyph.height > 0) ? glyph.height : 360;
  const gCX  = (glyph && isFinite(glyph.centerX)) ? glyph.centerX : 0;
  const gCY  = (glyph && isFinite(glyph.centerY)) ? glyph.centerY : 0;
  const svgT = glyph
    ? `translate(${tx * (gW / 360)} ${ty * (gH / 360)}) rotate(${rot * 180 / Math.PI} ${gCX} ${gCY}) translate(${gCX * (1 - scale)} ${gCY * (1 - scale)}) scale(${scale})`
    : "";
  const selPt = (selected && glyph) ? glyph.segments[selected.segIdx]?.points[selected.ptIdx] : null;

  return (
    <Card>
      <SectionLabel>Glyph</SectionLabel>
      <Inp
        value={input}
        onChange={handleChange}
        placeholder="enter word or phrase..."
        accentColor="#e879f9"
        style={{ marginBottom: 14 }}
      />

      {glyph && norm && (
        <>
          <div style={{
            width: "100%", aspectRatio: "1/1",
            background: "radial-gradient(circle at center, #0a0a14 0%, #000000 70%)",
            border: `1px solid ${T.border}`, borderRadius: T.radiusLg,
            overflow: "hidden", marginBottom: 12, position: "relative", touchAction: "none",
          }}
            onMouseDown={handlePointerStart} onMouseMove={handlePointerMove}
            onMouseUp={handlePointerEnd} onMouseLeave={handlePointerEnd}
            onTouchStart={handlePointerStart} onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerEnd} onWheel={handleWheel}
          >
            <svg
              viewBox={`${glyph.minX} ${glyph.minY} ${glyph.width} ${glyph.height}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ width: "100%", height: "100%", display: "block", cursor: "grab" }}
            >
              <defs>
                <filter id="gl-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="0.5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="gl-aura" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="2.2" />
                </filter>
                {glyph.segments.map((seg, si) => {
                  const fa = seg.points[1]?.simple || 13;
                  const la = seg.points[seg.points.length - 1]?.simple || 13;
                  return (
                    <linearGradient key={`g${si}`} id={`pg${si}`}
                      x1={seg.startX} y1={seg.startY} x2={seg.endX} y2={seg.endY}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%"   stopColor={letterColor(fa, 1, sat)} />
                      <stop offset="100%" stopColor={letterColor(la, 1, sat)} />
                    </linearGradient>
                  );
                })}
              </defs>

              <g transform={svgT}>
                {/* Frame rings */}
                <circle cx={glyph.centerX} cy={glyph.centerY} r={glyph.frameRadius}
                  fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.15" />
                <circle cx={glyph.centerX} cy={glyph.centerY} r={glyph.frameRadius * 0.92}
                  fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.12" strokeDasharray="0.8 1.2" />
                <circle cx={glyph.centerX} cy={glyph.centerY} r={glyph.innerRadius}
                  fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.2" strokeDasharray="0.4 0.4" />
                <circle cx={glyph.centerX} cy={glyph.centerY} r="0.25" fill="rgba(255,255,255,0.35)" />

                {/* Symmetry axis */}
                {glyph.symmetryAxis && (
                  <line
                    x1={glyph.symmetryAxis.cx - Math.cos(glyph.symmetryAxis.angle) * glyph.symmetryAxis.length}
                    y1={glyph.symmetryAxis.cy - Math.sin(glyph.symmetryAxis.angle) * glyph.symmetryAxis.length}
                    x2={glyph.symmetryAxis.cx + Math.cos(glyph.symmetryAxis.angle) * glyph.symmetryAxis.length}
                    y2={glyph.symmetryAxis.cy + Math.sin(glyph.symmetryAxis.angle) * glyph.symmetryAxis.length}
                    stroke={`rgba(255,255,255,${0.1 + glyph.symmetryAxis.strength * 0.25})`}
                    strokeWidth="0.18" strokeDasharray="1.2 0.8"
                  />
                )}

                {/* Closing / word connections */}
                {glyph.closingLine && (
                  <line x1={glyph.closingLine.x1} y1={glyph.closingLine.y1}
                    x2={glyph.closingLine.x2} y2={glyph.closingLine.y2}
                    stroke="rgba(255,255,255,0.25)" strokeWidth="0.2" strokeDasharray="0.6 0.4" />
                )}
                {glyph.wordConnections.map((wc, i) => (
                  <line key={`wc${i}`} x1={wc.x1} y1={wc.y1} x2={wc.x2} y2={wc.y2}
                    stroke="rgba(255,255,255,0.08)" strokeWidth="0.12" strokeDasharray="0.3 0.5" />
                ))}

                {/* Signature arcs */}
                {glyph.signatureArcs.map((arc, i) => {
                  const a0 = arc.angle - arc.arcSpan / 2;
                  const a1 = arc.angle + arc.arcSpan / 2;
                  const x0 = arc.cx + Math.cos(a0) * arc.radius;
                  const y0 = arc.cy + Math.sin(a0) * arc.radius;
                  const x1 = arc.cx + Math.cos(a1) * arc.radius;
                  const y1 = arc.cy + Math.sin(a1) * arc.radius;
                  return (
                    <path key={`sa${i}`}
                      d={`M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${arc.radius.toFixed(2)} ${arc.radius.toFixed(2)} 0 ${arc.arcSpan > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`}
                      fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.18" strokeLinecap="round"
                    />
                  );
                })}

                {/* Aura pass */}
                {glyph.segments.map((seg, si) => (
                  <path key={`au${si}`} d={seg.path} fill="none"
                    stroke={`url(#pg${si})`} strokeWidth={glyph.auraStroke}
                    strokeLinecap="round" strokeLinejoin="round" opacity="0.25" filter="url(#gl-aura)" />
                ))}

                {/* Main paths */}
                {glyph.segments.map((seg, si) => (
                  <path key={`mp${si}`} d={seg.path} fill="none"
                    stroke={`url(#pg${si})`} strokeWidth={glyph.baseStroke}
                    strokeLinecap="round" strokeLinejoin="round" opacity="0.9" filter="url(#gl-glow)" />
                ))}

                {/* Crossings */}
                {glyph.crossings.map((cr, i) => (
                  <circle key={`cr${i}`} cx={cr.x} cy={cr.y} r="0.5" fill="#ffffff" opacity="0.4" filter="url(#gl-glow)" />
                ))}

                {/* Flourishes */}
                {glyph.flourishes.map((fl, i) => fl.type === "arc"
                  ? <circle key={`fa${i}`} cx={fl.cx} cy={fl.cy} r={fl.r} fill="none"
                      stroke={letterColor(fl.simple, 0.7, sat)} strokeWidth="0.15" opacity="0.7" />
                  : <line key={`ft${i}`} x1={fl.x1} y1={fl.y1} x2={fl.x2} y2={fl.y2}
                      stroke={letterColor(fl.simple, 0.6, sat)} strokeWidth="0.2" strokeLinecap="round" opacity="0.7" />
                )}

                {/* Vowel polygon shapes */}
                {glyph.vowelShapes.map((v, i) => {
                  const vp = polygonPoints(v.cx, v.cy, v.radius, v.sides, v.rotation);
                  const ps = vp.map(pt => `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`).join(" ");
                  const vc = letterColor(v.simple, 1, sat);
                  const vf = letterColor(v.simple, 0.1, sat);
                  return (
                    <g key={`vp${i}`}>
                      <polygon points={ps} fill={vf} stroke={vc} strokeWidth="0.22" strokeLinejoin="round" filter="url(#gl-glow)" />
                      {vp.map((vpt, j) => (
                        <line key={`vl${i}${j}`} x1={v.cx} y1={v.cy} x2={vpt.x} y2={vpt.y} stroke={vc} strokeWidth="0.12" opacity="0.4" />
                      ))}
                      <circle cx={v.cx} cy={v.cy} r="0.25" fill={vc} />
                    </g>
                  );
                })}

                {/* Letter dots + hit targets */}
                {glyph.segments.map((seg, si) => (
                  <g key={`lp${si}`}>
                    {seg.points.map((p, i) => {
                      const isSel = selected && selected.segIdx === si && selected.ptIdx === i;
                      if (p.isStart) {
                        const nxt = seg.points[1];
                        const sc  = (nxt && !nxt.isStart) ? letterColor(nxt.simple, 0.9, sat) : "#ffffff";
                        return (
                          <g key={`sp${si}${i}`}>
                            <circle cx={p.x} cy={p.y} r="1.2" fill="none" stroke={sc} strokeWidth="0.3" opacity="0.8" />
                            <circle cx={p.x} cy={p.y} r="0.35" fill={sc} opacity="0.9" />
                          </g>
                        );
                      }
                      const pc  = letterColor(p.simple, 1, sat);
                      const hit = (
                        <circle cx={p.x} cy={p.y} r="2.5" fill="transparent" style={{ cursor: "pointer" }}
                          onClick={e => { e.stopPropagation(); handleLetterTap(si, i, p); }}
                          onTouchEnd={e => { e.stopPropagation(); handleLetterTap(si, i, p); }}
                        />
                      );
                      if (p.isVowel) return (
                        <g key={`vv${si}${i}`}>
                          {isSel && <circle cx={p.x} cy={p.y} r="2.8" fill="none" stroke="#ffffff" strokeWidth="0.25" opacity="0.95" />}
                          {hit}
                        </g>
                      );
                      return (
                        <g key={`cc${si}${i}`}>
                          {p.isPulse && <circle cx={p.x} cy={p.y} r="1.6" fill="none" stroke={pc} strokeWidth="0.15" opacity="0.35" />}
                          {isSel && <circle cx={p.x} cy={p.y} r="2.2" fill="none" stroke="#ffffff" strokeWidth="0.2" opacity="0.9" />}
                          <circle cx={p.x} cy={p.y} r={0.5 + (p.strokeMod ?? 1) * 0.2} fill={pc} opacity={p.opacity ?? 0.85} filter="url(#gl-glow)" />
                          {hit}
                        </g>
                      );
                    })}
                  </g>
                ))}

                {/* Arrowhead at end of each segment */}
                {glyph.segments.map((seg, si) => {
                  const pts = seg.points;
                  if (pts.length < 2) return null;
                  const lp = pts[pts.length - 1], pp = pts[pts.length - 2];
                  const ddx = lp.x - pp.x, ddy = lp.y - pp.y;
                  const ld  = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
                  const ux = ddx / ld, uy = ddy / ld, px = -uy, py = ux;
                  return (
                    <polygon key={`ev${si}`}
                      points={`${lp.x + ux * 1.4},${lp.y + uy * 1.4} ${lp.x + px * 0.45},${lp.y + py * 0.45} ${lp.x - px * 0.45},${lp.y - py * 0.45}`}
                      fill={letterColor(lp.simple, 0.95, sat)} opacity="0.8" filter="url(#gl-glow)"
                    />
                  );
                })}

                {/* Letter labels (short phrases only) */}
                {showLabels && glyph.segments.map((seg, si) => (
                  <g key={`lb${si}`}>
                    {seg.points.map((p, i) => {
                      if (p.isStart || !p.ch) return null;
                      return (
                        <text key={`lt${si}${i}`} x={p.x} y={p.y - 2.3}
                          fontSize="1.7" fontFamily="monospace"
                          fill="rgba(255,255,255,0.6)" fontWeight="700" textAnchor="middle"
                        >
                          {p.ch.toUpperCase()}
                        </text>
                      );
                    })}
                  </g>
                ))}
              </g>
            </svg>

            <button onClick={handleReset} style={{
              position: "absolute", top: 8, right: 8,
              background: "rgba(0,0,0,0.6)", border: `1px solid ${T.border2}`,
              borderRadius: 6, color: T.textMid, cursor: "pointer",
              fontSize: 11, padding: "4px 10px", fontFamily: T.mono, backdropFilter: "blur(4px)",
            }}>reset</button>

            {(scale !== 1 || rot !== 0 || tx !== 0 || ty !== 0) && (
              <div style={{
                position: "absolute", bottom: 8, left: 8,
                background: "rgba(0,0,0,0.6)", border: `1px solid ${T.border}`,
                borderRadius: 6, color: T.textDim, fontSize: 10,
                padding: "3px 8px", fontFamily: T.mono, backdropFilter: "blur(4px)",
              }}>
                {scale.toFixed(2)}x · {Math.round(rot * 180 / Math.PI)}°
              </div>
            )}

            {selPt && selPt.ch && !selPt.isStart && (
              <div style={{
                position: "absolute", bottom: 8, right: 8,
                background: "rgba(0,0,0,0.8)",
                border: `1px solid ${letterColor(selPt.simple, 1, sat)}`,
                borderRadius: T.radius, color: T.text, padding: "8px 12px",
                fontFamily: T.mono, fontSize: 11, backdropFilter: "blur(4px)", minWidth: 110,
              }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: letterColor(selPt.simple, 1, sat), marginBottom: 2 }}>
                  {selPt.ch.toUpperCase()}
                </div>
                <div style={{ color: T.textMid, fontSize: 10, marginBottom: 1 }}>
                  SE <span style={{ color: T.text }}>{selPt.simple}</span> ·
                  PY <span style={{ color: T.text }}>{selPt.pyth}</span>
                </div>
                <div style={{ color: T.textDim, fontSize: 9 }}>
                  word {selPt.wordIdx + 1} · pos {(selPt.letterIdx ?? 0) + 1}
                  {selPt.isVowel && " · vowel"}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 6, fontSize: 10, color: T.textDim, fontFamily: T.mono }}>
            <span>◉ start</span><span>⬠ vowel</span>
            <span>· consonant</span><span>⫽ flourish</span>
            <span>◆ end</span><span>∙ crossing</span>
          </div>
          <div style={{ fontSize: 10, color: T.textDim, fontFamily: T.mono, marginBottom: 10 }}>
            drag · pinch zoom · pinch rotate · tap letter
          </div>

          {values && (
            <div style={{ background: T.bg0, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: T.textDim }}>cipher values</span>
                <CopyBtn
                  text={CIPHER_KEYS.map(c => `${CIPHERS[c].short}:${values[c]}`).join(" ")}
                  id="glyph-vals" copy={copy} copiedId={copiedId}
                />
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CIPHER_KEYS.map(c => (
                  <ValueBadge key={c} cipher={c} cipherDef={CIPHERS[c]} value={values[c]} showRoot />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
});
