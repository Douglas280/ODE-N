import React, { memo } from "react";
import { RAINBOW } from "../engine/constants.js";

// Animated eye icon with rainbow iris rings
export const RainbowEye = memo(function RainbowEye({ size = 32 }) {
  const cx = size / 2, cy = size / 2;
  const rings = RAINBOW.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="ODE-N logo"
      role="img"
    >
      <ellipse cx={cx} cy={cy} rx={cx - 1} ry={cy * 0.6} fill="#18181f" stroke="#2a2a35" strokeWidth={1} />
      {RAINBOW.map((color, i) => {
        const r = (cx * 0.55) * (1 - i / (rings + 1));
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1.2} opacity={0.8 - i * 0.07} />;
      })}
      <circle cx={cx} cy={cy} r={cx * 0.12} fill="#e8e8f0" />
    </svg>
  );
});
