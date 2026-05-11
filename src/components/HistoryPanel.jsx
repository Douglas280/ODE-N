import React, { memo } from "react";
import { CIPHERS, CIPHER_KEYS } from "../engine/constants.js";
import { Card, SectionLabel, ValueBadge, EmptyState } from "./ui.jsx";
import { useCopy } from "../hooks/useCopy.js";

function HistoryItem({ entry, onSelect, onRemove }) {
  const { copied, copy } = useCopy();

  return (
    <div className="history-item">
      <button
        className="history-load-btn"
        onClick={() => onSelect(entry.raw)}
        aria-label={`Load "${entry.raw}"`}
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
        className={`copy-btn${copied ? " copied" : ""}`}
      >
        {copied ? "✓" : "⧉"}
      </button>

      <button
        onClick={() => onRemove(entry.norm)}
        aria-label="Remove from history"
        className="btn-icon"
        style={{ fontSize: 16, lineHeight: 1 }}
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
              className="btn-ghost"
            >
              Clear all
            </button>
          )}
        </div>

        {history.length === 0 && (
          <EmptyState
            icon="◷"
            message="No history yet — save phrases from the Lookup tab"
          />
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
