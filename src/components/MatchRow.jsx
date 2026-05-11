import React, { memo } from "react";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { ValueBadge, CopyBtn } from "./ui.jsx";
import { useCopy } from "../hooks/useCopy.js";

export const MatchRow = memo(function MatchRow({ entry, targetValues, onSelect }) {
  const { copied, copy } = useCopy();

  return (
    <div
      className={`match-row${onSelect ? " clickable" : ""}`}
      onClick={() => onSelect?.(entry.raw)}
    >
      <span className="match-row-text" title={entry.raw}>
        {entry.raw}
      </span>

      <span className="match-row-cat">{entry.cat}</span>

      <div style={{ display: "flex", gap: 3, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {CIPHER_KEYS.map(k => {
          const val = entry.values[k];
          const isMatch = targetValues && val === targetValues[k];
          return (
            <ValueBadge key={k} value={val} color={isMatch ? CIPHERS[k].color : "#3a3a52"} />
          );
        })}
      </div>

      <CopyBtn
        onCopy={(e) => { e?.stopPropagation?.(); copy(entry.raw); }}
        copied={copied}
      />
    </div>
  );
});
