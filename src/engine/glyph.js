import { CIPHER_VOWELS, PYTH_MAP, PRIME_MAP } from "./constants.js";
import { calcValues } from "./ciphers.js";

// Vowel → polygon side count
const VOWEL_SIDES = { a: 3, e: 4, i: 5, o: 6, u: 7, y: 8 };

// 9 directions indexed by Pythagorean value 1–9; 9 = spiral (rotate heading)
const GLYPH_DIRS = [
  null,
  { dx:  0, dy: -1 }, // 1 N
  { dx:  1, dy: -1 }, // 2 NE
  { dx:  1, dy:  0 }, // 3 E
  { dx:  1, dy:  1 }, // 4 SE
  { dx:  0, dy:  1 }, // 5 S
  { dx: -1, dy:  1 }, // 6 SW
  { dx: -1, dy:  0 }, // 7 W
  { dx: -1, dy: -1 }, // 8 NW
  { dx:  0, dy:  0 }, // 9 spiral
];

function normDir(dx, dy) {
  const m = Math.sqrt(dx * dx + dy * dy) || 1;
  return { dx: dx / m, dy: dy / m };
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export function polygonPoints(cx, cy, radius, sides, rotation = 0) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const a = rotation + (i / sides) * Math.PI * 2 - Math.PI / 2;
    pts.push({ x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius });
  }
  return pts;
}

/** Line segment intersection — returns point or null. */
export function segmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(d) < 1e-9) return null;
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / d;
  if (t < 0.02 || t > 0.98 || u < 0.02 || u > 0.98) return null;
  return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
}

/** Letter colour — hue derived from ordinal + prime, saturation from PR cipher. */
export function letterColor(simple, alpha = 1, saturation = 78) {
  const prime = PRIME_MAP[simple - 1] || 2;
  const hue   = ((simple - 1) * 14 + prime * 9) % 360;
  return `hsla(${hue}, ${saturation}%, 62%, ${alpha})`;
}

/**
 * Build walk-as-glyph geometry from a normalised phrase string.
 * Returns null on empty input or internal error (never throws).
 *
 * Fixes applied vs. original:
 *  • VOWELS → CIPHER_VOWELS (correct import)
 *  • O(n²) self-intersection capped at ≤40 points per segment
 *  • Errors logged only in dev; returns null instead of crashing
 */
export function buildGlyph(norm) {
  if (!norm || typeof norm !== "string") return null;
  const trimmed = norm.trim();
  if (!trimmed) return null;

  try {
    const words = trimmed.split(" ").filter(Boolean);
    const W = words.length;
    if (W === 0) return null;

    const segments     = [];
    const flourishes   = [];
    const vowelShapes  = [];
    const signatureArcs = [];
    let gMinX = 0, gMinY = 0, gMaxX = 0, gMaxY = 0;

    const values       = calcValues(trimmed);
    const phraseSE     = values.simple   || 1;
    const phraseSH     = values.shadow   || 30;
    const phrasePR     = values.prime    || 2;
    const totalLetters = trimmed.replace(/ /g, "").length || 1;

    let totalVowelWeight = 0;
    for (const ch of trimmed) {
      if (CIPHER_VOWELS.has(ch)) totalVowelWeight += (ch.charCodeAt(0) - 96);
    }
    if (totalVowelWeight === 0) totalVowelWeight = 1;

    const shNorm     = Math.max(0, Math.min(1, (phraseSH - 30) / 350));
    const baseStroke = 0.35 + shNorm * 0.5;
    const auraStroke = 2.2  + shNorm * 1.2;
    const prNorm     = Math.max(0, Math.min(1, Math.log10(Math.max(phrasePR, 1)) / 3.5));
    const saturation = 62 + prNorm * 30;

    let maxWordLen = 1;
    for (const w of words) if (w.length > maxWordLen) maxWordLen = w.length;
    const ringRadius = W > 1 ? Math.max(4, maxWordLen * 0.8) : 0;

    for (let wi = 0; wi < W; wi++) {
      const word = words[wi];
      if (!word) continue;

      const wordAngle = (wi / W) * Math.PI * 2 - Math.PI / 2;
      let x = W > 1 ? Math.cos(wordAngle) * ringRadius : 0;
      let y = W > 1 ? Math.sin(wordAngle) * ringRadius : 0;
      const startX = x, startY = y;

      let lastDx = Math.cos(wordAngle);
      let lastDy = Math.sin(wordAngle);
      let spiralAngle = wordAngle;
      let prevPyth    = 0;
      let prevOrdinal = 0;
      let consecutiveSpirals = 0;

      const points = [{
        x, y, ch: null, simple: 0, pyth: 0, isVowel: false,
        isStart: true, wordIdx: wi, letterIdx: -1,
        strokeMod: 1, opacity: 0.6,
      }];

      const validLetters = [];
      for (let i = 0; i < word.length; i++) {
        const cc = word.charCodeAt(i);
        if (cc >= 97 && cc <= 122) validLetters.push(i);
      }
      const n = validLetters.length;

      for (let vi = 0; vi < n; vi++) {
        const i       = validLetters[vi];
        const ch      = word[i];
        const idx     = ch.charCodeAt(0) - 97;
        const simple  = idx + 1;
        const pyth    = PYTH_MAP[idx];
        const prime   = PRIME_MAP[idx];
        const isVowel = CIPHER_VOWELS.has(ch);

        const posFactor = 1 + 0.4 * sigmoid((vi - n / 2) / Math.max(n, 1));
        const pairMult  = 1 + (prevOrdinal % 3) * 0.05;
        const rawStep   = Math.sqrt(simple) * 1.15 * posFactor * pairMult;
        const stepLen   = isFinite(rawStep) && rawStep > 0 ? rawStep : 1;
        const opacity   = n > 1 ? 0.6 + (vi / (n - 1)) * 0.4 : 1;

        let dx, dy;

        if (pyth === 9) {
          consecutiveSpirals++;
          const spiralDelta = (Math.PI / 4) + (simple % 5) * (Math.PI / 30);
          const cumulative  = consecutiveSpirals > 1 ? (consecutiveSpirals - 1) * Math.PI / 12 : 0;
          spiralAngle += spiralDelta + cumulative;
          dx = Math.cos(spiralAngle);
          dy = Math.sin(spiralAngle);
        } else {
          consecutiveSpirals = 0;
          const dir = GLYPH_DIRS[pyth];
          const nd  = normDir(dir.dx, dir.dy);
          dx = nd.dx; dy = nd.dy;

          if (prevPyth > 0) {
            const dAngle = (pyth - prevPyth) * (Math.PI / 90);
            const cur    = Math.atan2(dy, dx);
            dx = Math.cos(cur + dAngle);
            dy = Math.sin(cur + dAngle);
          }

          if (isVowel) {
            const blend = 0.4 + (prime % 5) * 0.1;
            dx = dx * blend + lastDx * (1 - blend);
            dy = dy * blend + lastDy * (1 - blend);
            const nb = normDir(dx, dy);
            dx = nb.dx; dy = nb.dy;
          }

          spiralAngle = Math.atan2(dy, dx);
        }

        const angleChange = Math.abs(Math.atan2(
          dx * lastDy - dy * lastDx,
          dx * lastDx + dy * lastDy,
        ));
        const hardCorner = angleChange > (70 * Math.PI / 180);
        const strokeMod  = 1 - (angleChange / Math.PI) * 0.2;

        const prevX = x, prevY = y;
        x += dx * stepLen;
        y += dy * stepLen;
        lastDx = dx; lastDy = dy;
        prevPyth    = pyth;
        prevOrdinal = simple;

        points.push({
          x, y, ch, simple, pyth, prime, isVowel, isStart: false,
          wordIdx: wi, letterIdx: vi,
          prevX, prevY,
          hardCorner, strokeMod, opacity,
          isPulse: vi > 0 && vi % 3 === 0,
        });

        if (isVowel) {
          const sides        = VOWEL_SIDES[ch] || 4;
          const weightRatio  = totalVowelWeight > 0 ? simple / totalVowelWeight : 0.5;
          const contextScale = 0.7 + Math.pow(Math.max(weightRatio, 0), 0.6);
          const radius       = Math.max(0.5, (0.8 + Math.sqrt(simple) * 0.25) * contextScale);
          vowelShapes.push({
            cx: x, cy: y, sides, radius, rotation: spiralAngle,
            simple, prime, ch,
            pointIdx: points.length - 1,
            segIdx:   segments.length,
          });
        } else {
          const tickCount  = Math.floor(1 + Math.log2(pyth + 1));
          const tickOffset = ((phraseSH % 3) * 5) * (Math.PI / 180);
          const perpAngle  = Math.atan2(dx, -dy) + tickOffset;
          const perpDx     = Math.cos(perpAngle);
          const perpDy     = Math.sin(perpAngle);
          const tickLen    = 0.6 + Math.sqrt(simple) * 0.08;

          for (let t = 0; t < tickCount; t++) {
            const off  = 0.25 + (t / Math.max(tickCount - 1, 1)) * 0.45;
            const fx   = prevX + dx * stepLen * off;
            const fy   = prevY + dy * stepLen * off;
            const side = t % 2 === 0 ? 1 : -1;
            flourishes.push({
              x1: fx, y1: fy,
              x2: fx + perpDx * tickLen * 0.5 * side,
              y2: fy + perpDy * tickLen * 0.5 * side,
              simple, segIdx: segments.length, opacity,
            });
          }
          if (simple >= 18) {
            flourishes.push({
              type: "arc",
              cx: x - dx * 0.8, cy: y - dy * 0.8,
              r: 0.35, simple, segIdx: segments.length, opacity,
            });
          }
        }

        if (x < gMinX) gMinX = x;
        if (y < gMinY) gMinY = y;
        if (x > gMaxX) gMaxX = x;
        if (y > gMaxY) gMaxY = y;
      }

      segments.push({
        word, points, startX, startY, endX: x, endY: y,
        endDx: lastDx, endDy: lastDy,
      });

      signatureArcs.push({
        cx: startX, cy: startY,
        radius:  Math.max(2, Math.sqrt(phraseSE) * 0.4),
        arcSpan: n * 6 * (Math.PI / 180),
        angle:   wordAngle,
        wordIdx: wi,
      });
    }

    // Word-to-word connections
    const wordConnections = [];
    if (W > 1) {
      for (let i = 0; i < segments.length; i++) {
        const a = segments[i];
        const b = segments[(i + 1) % segments.length];
        wordConnections.push({ x1: a.endX, y1: a.endY, x2: b.startX, y2: b.startY });
      }
    }

    // Closing path
    let closingLine = null;
    if (segments.length > 0) {
      const first = segments[0];
      const last  = segments[segments.length - 1];
      const cdx   = last.endX - first.startX;
      const cdy   = last.endY - first.startY;
      const dist  = Math.sqrt(cdx * cdx + cdy * cdy);
      const diag  = Math.sqrt(Math.pow(gMaxX - gMinX, 2) + Math.pow(gMaxY - gMinY, 2)) || 1;
      const threshold = 0.08 + 1 / Math.sqrt(Math.max(totalLetters, 1));
      if (dist / diag < threshold && dist > 0.5) {
        closingLine = { x1: last.endX, y1: last.endY, x2: first.startX, y2: first.startY };
      }
    }

    for (const v of vowelShapes) {
      gMinX = Math.min(gMinX, v.cx - v.radius);
      gMinY = Math.min(gMinY, v.cy - v.radius);
      gMaxX = Math.max(gMaxX, v.cx + v.radius);
      gMaxY = Math.max(gMaxY, v.cy + v.radius);
    }

    const centerX      = (gMinX + gMaxX) / 2;
    const centerY      = (gMinY + gMaxY) / 2;
    const contentW     = gMaxX - gMinX;
    const contentH     = gMaxY - gMinY;
    const contentRadius = Math.max(
      Math.sqrt(contentW * contentW + contentH * contentH) / 2,
      3,
    );
    const frameRadius  = contentRadius * (1.15 + Math.min(totalLetters / 30, 0.35));
    const innerRadius  = Math.max(0.8, Math.min(contentRadius * 0.15, Math.sqrt(phraseSE) * 0.25));
    const padding      = Math.max(6, frameRadius * 0.15);
    const width        = Math.max(20, (frameRadius + padding) * 2);
    const height       = Math.max(20, (frameRadius + padding) * 2);
    const minX         = centerX - frameRadius - padding;
    const minY         = centerY - frameRadius - padding;

    // Symmetry detection
    let symmetryAxis = null;
    if (totalLetters >= 3) {
      const allPts = [];
      for (const seg of segments) {
        for (const p of seg.points) {
          if (!p.isStart) allPts.push({ x: p.x - centerX, y: p.y - centerY });
        }
      }
      let bestScore = Infinity, bestAngle = 0;
      for (let k = 0; k < 12; k++) {
        const a    = (k / 12) * Math.PI;
        const axNx = -Math.sin(a);
        const axNy =  Math.cos(a);
        let total  = 0;
        for (const p of allPts) {
          const dot = p.x * axNx + p.y * axNy;
          const rx  = p.x - 2 * dot * axNx;
          const ry  = p.y - 2 * dot * axNy;
          let minD  = Infinity;
          for (const q of allPts) {
            const d = (q.x - rx) * (q.x - rx) + (q.y - ry) * (q.y - ry);
            if (d < minD) minD = d;
          }
          total += Math.sqrt(minD);
        }
        if (total < bestScore) { bestScore = total; bestAngle = a; }
      }
      const avgDist   = bestScore / allPts.length;
      const symThresh = contentRadius * (0.08 + 1 / Math.sqrt(Math.max(totalLetters, 1)));
      if (avgDist < symThresh) {
        symmetryAxis = {
          angle:  bestAngle,
          strength: 1 - (avgDist / symThresh),
          cx: centerX, cy: centerY,
          length: frameRadius * 1.1,
        };
      }
    }

    // Build smooth SVG paths
    for (const seg of segments) {
      const pts = seg.points;
      if (pts.length < 2) { seg.path = ""; continue; }
      let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
      for (let i = 1; i < pts.length; i++) {
        const p    = pts[i];
        const prev = pts[i - 1];
        if (i === 1) {
          d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
        } else if (p.hardCorner) {
          d += ` L ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
        } else {
          const mx = (prev.x + p.x) / 2;
          const my = (prev.y + p.y) / 2;
          d += ` Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
        }
      }
      d += ` L ${pts[pts.length - 1].x.toFixed(2)} ${pts[pts.length - 1].y.toFixed(2)}`;
      seg.path = d;
    }

    // Self-intersections — capped at 40 points to keep this O(k) in practice
    const crossings = [];
    for (const seg of segments) {
      const pts = seg.points;
      if (pts.length > 40) continue; // skip expensive check for long phrases
      for (let i = 1; i < pts.length; i++) {
        for (let j = i + 2; j < pts.length; j++) {
          const c = segmentsIntersect(
            pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y,
            pts[j - 1].x, pts[j - 1].y, pts[j].x, pts[j].y,
          );
          if (c) crossings.push(c);
        }
      }
    }

    return {
      segments, flourishes, vowelShapes, crossings, signatureArcs, W,
      minX, minY, width, height, centerX, centerY,
      frameRadius, innerRadius,
      baseStroke, auraStroke, saturation,
      wordConnections, closingLine, symmetryAxis,
      phraseSE, phraseSH, phrasePR, totalLetters,
    };
  } catch (err) {
    if (import.meta.env?.DEV) console.error("buildGlyph:", err);
    return null;
  }
}
