import React, { useCallback, memo } from "react";
import { Card, SectionLabel, Btn, CopyBtn, T } from "./ui.jsx";

export const HistoryPanel = memo(function HistoryPanel({ history, dispatch, copy, copiedId }) {
  const handleClear  = useCallback(() => dispatch({ type: "clear" }), [dispatch]);
  const handleRemove = useCallback(e => {
    e.stopPropagation();
    dispatch({ type: "remove", ts: +e.currentTarget.dataset.ts });
  }, [dispatch]);

  if (!history.length) return null;

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <SectionLabel>History</SectionLabel>
        <Btn onClick={handleClear} style={{ fontSize: 10, padding: "4px 10px" }}>clear</Btn>
      </div>
      <div style={{ maxHeight: 160, overflowY: "auto", display: "grid", gap: 4 }}>
        {history.map(h => (
          <div key={h.ts} style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            padding:        "10px 12px",
            borderRadius:   T.radius,
            background:     T.bg2,
            border:         `1px solid ${T.border}`,
          }}>
            <span style={{ fontSize: 14, color: T.textMid }}>{h.text}</span>
            <div style={{ display: "flex", gap: 2 }}>
              <CopyBtn text={h.text} id={`hist-${h.ts}`} copy={copy} copiedId={copiedId} />
              <button
                data-ts={h.ts}
                onClick={handleRemove}
                style={{
                  background: "transparent",
                  border:     "none",
                  color:      "#ef4444",
                  cursor:     "pointer",
                  fontSize:   13,
                  padding:    "4px 8px",
                  fontFamily: T.mono,
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});
