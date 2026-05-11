import React, { memo } from "react";
import { RAINBOW } from "../engine/constants.js";

export const RainbowText = memo(function RainbowText({ text, style }) {
  if (!text) return null;
  return (
    <span style={style}>
      {[...text].map((ch, i) => (
        <span key={i} style={{ color: RAINBOW[i % RAINBOW.length] }}>{ch}</span>
      ))}
    </span>
  );
});
