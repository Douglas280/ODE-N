import React, { memo } from "react";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { T, CopyBtn } from "./ui.jsx";

export const MatchRow = memo(function MatchRow({ entry, cipher, copy, copiedId, showAllCiphers }) {
  const { color } = CIPHERS[cipher];
  return (
    <div style={{
      display:        "flex",
      justifyContent: "space-between",
      alignItems:     "center",
      padding:        "10px 12px",
      borderRadius:   T.radius,
      background:     T.bg2,
      border:         `1px solid ${T.border}`,
      gap:            8,
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ color: T.text, fontSize: 14, lineHeight: 1.4 }}>{entry.raw}</div>
        {showAllCiphers && (
          <div style={{
            display:                 "flex",
            gap:                     6,
            marginTop:               5,
            overflowX:               "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth:          "none",
          }}>
            {CIPHER_KEYS.map(c => (
              <span key={c} style={{
                fontSize:   10,
                fontFamily: "'Courier New', monospace",
                color:      CIPHERS[c].color,
                flexShrink: 0,
                opacity:    0.85,
              }}>
                {CIPHERS[c].short} {entry.values[c]}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <span style={{ color, fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: 700 }}>
          {entry.values[cipher]}
        </span>
        <CopyBtn text={entry.raw} id={`mr-${entry.id}`} copy={copy} copiedId={copiedId} />
      </div>
    </div>
  );
});
