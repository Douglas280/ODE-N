import React, { memo } from "react";
import { RAINBOW } from "../engine/constants.js";

const RAINBOW_GRADIENT_STOPS = RAINBOW.map((c, i, arr) => ({
  offset: `${Math.round((i / (arr.length - 1)) * 100)}%`,
  color:  c,
}));

const RAINBOW_EYE_ARCS = RAINBOW.map((c, i) => {
  const a1 = (i / RAINBOW.length) * Math.PI * 2;
  const a2 = ((i + 1) / RAINBOW.length) * Math.PI * 2;
  const r  = 18;
  return {
    color: c,
    d: `M ${50 + r * Math.cos(a1)} ${30 + r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${50 + r * Math.cos(a2)} ${30 + r * Math.sin(a2)}`,
  };
});

export const RainbowEye = memo(function RainbowEye({ size = 46 }) {
  const id = "re3";
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 100 60"
      style={{ display: "block", overflow: "visible", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={`${id}g`} x1="0%" y1="0%" x2="100%" y2="0%">
          {RAINBOW_GRADIENT_STOPS.map(({ offset, color: c }, i) => (
            <stop key={i} offset={offset} stopColor={c} />
          ))}
        </linearGradient>
        <radialGradient id={`${id}i`} cx="50%" cy="40%" r="50%">
          <stop offset="0%"   stopColor="#c084fc" stopOpacity="0.9" />
          <stop offset="40%"  stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6" />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <path d="M5 30 Q50 -8 95 30 Q50 68 5 30 Z" />
        </clipPath>
        <filter id={`${id}f`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M5 30 Q50 -8 95 30 Q50 68 5 30 Z"
        fill="none"
        stroke={`url(#${id}g)`}
        strokeWidth="1.5"
        opacity="0.25"
        filter={`url(#${id}f)`}
        style={{ transform: "scale(1.08)", transformOrigin: "50px 30px" }}
      />
      <circle cx="50" cy="30" r="18" fill={`url(#${id}i)`} clipPath={`url(#${id}c)`} opacity="0.85" />
      {RAINBOW_EYE_ARCS.map(({ color: c, d }, i) => (
        <path key={i} d={d} fill="none" stroke={c} strokeWidth="2.5" clipPath={`url(#${id}c)`} opacity="0.9" />
      ))}
      <circle cx="50" cy="30" r="9" fill="#050d1a" clipPath={`url(#${id}c)`} />
      <circle cx="50" cy="30" r="9" fill="none" stroke={`url(#${id}g)`} strokeWidth="1.5" clipPath={`url(#${id}c)`} opacity="0.8" />
      <path d="M5 30 Q50 -8 95 30 Q50 68 5 30 Z" fill="none" stroke={`url(#${id}g)`} strokeWidth="2.5" filter={`url(#${id}f)`} />
      <ellipse cx="42" cy="23" rx="4.5" ry="2.5" fill="white" opacity="0.3" clipPath={`url(#${id}c)`} />
    </svg>
  );
});
