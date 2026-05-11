import React, { memo } from "react";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { ValueBadge, CopyBtn } from "./ui.jsx";
import { useCopy } from "../hooks/useCopy.js";

export const MatchRow = memo(function MatchRow({ entry, targetValues, onSelect }) {
  const { copied, copy } = useCopy();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 6,
        background: "#18181f",
        border: "1px solid #2a2a35",
        cursor: onSelect ? "pointer" : "default",
      }}
      onClick={() => onSelect?.(entry.raw)}
    >
      <span
        style={{
          flex: 1,
          fontSize: 13,
          color: "#e8e8f0",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={entry.raw}
      >
        {entry.raw}
      </span>
      <span style={{ fontSize: 10, color: "#6b6b80", flexShrink: 0 }}>{entry.cat}</span>
      <div style={{ display: "flex", gap: 3, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {CIPHER_KEYS.map(k => {
          const val = entry.values[k];
          const isMatch = targetValues && val === targetValues[k];
          return (
            <ValueBadge
              key={k}
              value={val}
              color={isMatch ? CIPHERS[k].color : "#6b6b80"}
            />
          );
        })}
      </div>
      <CopyBtn onCopy={(e) => { e?.stopPropagation?.(); copy(entry.raw); }} copied={copied} />
    </div>
  );
});
