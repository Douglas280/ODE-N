import React, { memo } from "react";
import { RAINBOW } from "../engine/constants.js";

const CHARS = "Ode-N".split("").map((ch, i, arr) => ({
  ch,
  color: RAINBOW[Math.round((i / Math.max(arr.length - 1, 1)) * (RAINBOW.length - 1))],
}));

export const RainbowText = memo(function RainbowText({ size = 30 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", letterSpacing: "-0.5px" }}>
      {CHARS.map(({ ch, color }, i) => (
        <span key={i} style={{
          color,
          fontSize:   size,
          fontWeight: 900,
          fontFamily: "'Courier New', Courier, monospace",
          textShadow: `0 0 16px ${color}88`,
          lineHeight: 1,
        }}>
          {ch}
        </span>
      ))}
    </span>
  );
});
