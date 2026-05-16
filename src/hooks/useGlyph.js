import { useState, useMemo } from "react";
import { normalize } from "../engine/normalize.js";
import { buildGlyph } from "../engine/glyph.js";

export function useGlyph(initialPhrase = "") {
  const [raw, setRaw] = useState(initialPhrase);
  const norm  = useMemo(() => (raw ? normalize(raw) : ""), [raw]);
  const glyph = useMemo(() => (norm ? buildGlyph(norm) : null), [norm]);
  return { raw, setRaw, norm, glyph };
}
