import React, { memo } from "react";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";

export const CipherSelector = memo(function CipherSelector({ active, onChange }) {
  return (
    <div className="cipher-grid">
      {CIPHER_KEYS.map(k => {
        const c = CIPHERS[k];
        const isActive = active === k;
        return (
          <button
            key={k}
            className={`cipher-btn${isActive ? " active" : ""}`}
            onClick={() => onChange(k)}
            style={isActive ? {
              borderColor: c.color,
              color: c.color,
              boxShadow: `0 0 10px ${c.color}33`,
              background: `${c.color}11`,
            } : undefined}
          >
            {c.short}
            <span style={{ fontSize: 10, opacity: 0.65, marginLeft: 3 }}>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
});
