import React, { useCallback, memo } from "react";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { T } from "./ui.jsx";

export const CipherSelector = memo(function CipherSelector({ active, onChange }) {
  const handleClick = useCallback(e => onChange(e.currentTarget.dataset.cipher), [onChange]);
  return (
    <div style={{
      display:                 "flex",
      gap:                     6,
      overflowX:               "auto",
      WebkitOverflowScrolling: "touch",
      scrollbarWidth:          "none",
      msOverflowStyle:         "none",
      paddingBottom:           2,
    }}>
      {CIPHER_KEYS.map(k => {
        const { short, color } = CIPHERS[k];
        const on = active === k;
        return (
          <button
            key={k}
            data-cipher={k}
            onClick={handleClick}
            style={{
              padding:      "8px 14px",
              borderRadius: T.radius,
              border:       `1px solid ${on ? color : T.border}`,
              background:   on ? `${color}1a` : T.bg2,
              color:        on ? color : T.textMid,
              cursor:       "pointer",
              fontFamily:   T.mono,
              fontWeight:   700,
              fontSize:     12,
              flexShrink:   0,
              transition:   "border-color 0.12s, color 0.12s, background 0.12s",
            }}
          >
            {short}
          </button>
        );
      })}
    </div>
  );
});
