import React, { memo } from "react";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { Btn } from "./ui.jsx";

export const CipherSelector = memo(function CipherSelector({ active, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {CIPHER_KEYS.map(k => {
        const c = CIPHERS[k];
        return (
          <Btn
            key={k}
            active={active === k}
            onClick={() => onChange(k)}
            style={{ borderColor: active === k ? c.color : undefined, color: active === k ? c.color : undefined }}
          >
            {c.short} <span style={{ fontSize: 10, opacity: 0.7 }}>{c.label}</span>
          </Btn>
        );
      })}
    </div>
  );
});
