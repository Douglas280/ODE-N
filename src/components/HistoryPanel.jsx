import React, { memo } from "react";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { Card, SectionLabel, ValueBadge, EmptyState } from "./ui.jsx";
import { useCopy } from "../hooks/useCopy.js";

function HistoryItem({ entry, onSelect, onRemove }) {
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
      }}
    >
      <button
        onClick={() => onSelect(entry.raw)}
        aria-label={`Load ${entry.raw}`}
        style={{
          background: "none",
          border: "none",
          color: "#e8e8f0",
          cursor: "pointer",
          flex: 1,
          fontSize: 13,
          overflow: "hidden",
          padding: 0,
          textAlign: "left",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={entry.raw}
      >
        {entry.raw}
      </button>

      <div style={{ display: "flex", gap: 3, flexShrink: 0, flexWrap: "wrap" }}>
        {CIPHER_KEYS.map(k => (
          <ValueBadge key={k} value={entry.values[k]} color={CIPHERS[k].color} />
        ))}
      </div>

      <button
        onClick={() => copy(entry.raw)}
        aria-label={copied ? "Copied" : "Copy phrase"}
        style={{
          background: "none",
          border: "none",
          color: copied ? "#4ade80" : "#6b6b80",
          cursor: "pointer",
          fontSize: 13,
          padding: "2px 4px",
        }}
      >
        {copied ? "✓" : "⧉"}
      </button>

      <button
        onClick={() => onRemove(entry.norm)}
        aria-label="Remove from history"
        style={{
          background: "none",
          border: "none",
          color: "#6b6b80",
          cursor: "pointer",
          fontSize: 13,
          padding: "2px 4px",
        }}
      >
        ×
      </button>
    </div>
  );
}

export const HistoryPanel = memo(function HistoryPanel({ history, onSelect, onRemove, onClear }) {
  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SectionLabel>History ({history.length})</SectionLabel>
          {history.length > 0 && (
            <button
              onClick={onClear}
              aria-label="Clear history"
              style={{
                background: "none",
                border: "none",
                color: "#6b6b80",
                cursor: "pointer",
                fontSize: 11,
                padding: 0,
              }}
            >
              Clear all
            </button>
          )}
        </div>

        {history.length === 0 && (
          <EmptyState message="No history yet — add phrases from the Lookup tab" />
        )}

        {history.map(entry => (
          <HistoryItem
            key={entry.norm}
            entry={entry}
            onSelect={onSelect}
            onRemove={onRemove}
          />
        ))}
      </div>
    </Card>
  );
});
