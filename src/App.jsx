import React, { useState, useCallback, useReducer, memo } from "react";
import { useIndexes } from "./hooks/useIndexes.js";
import { useDebounce } from "./hooks/useDebounce.js";
import { normalize } from "./engine/normalize.js";
import { calcValues } from "./engine/ciphers.js";
import { RainbowEye } from "./components/RainbowEye.jsx";
import { RainbowText } from "./components/RainbowText.jsx";
import { LookupPanel } from "./components/LookupPanel.jsx";
import { CalcPanel } from "./components/CalcPanel.jsx";
import { NamePanel } from "./components/NamePanel.jsx";
import { GlyphPanel } from "./components/GlyphPanel.jsx";
import { HistoryPanel } from "./components/HistoryPanel.jsx";

// ── History reducer ────────────────────────────────────────────────────────────

function historyReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { norm } = action.entry;
      if (state.some(e => e.norm === norm)) return state;
      return [action.entry, ...state].slice(0, 100);
    }
    case "REMOVE":
      return state.filter(e => e.norm !== action.norm);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

// ── Tab bar ────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "lookup",  label: "Lookup"  },
  { key: "calc",    label: "Calc"    },
  { key: "name",    label: "Name"    },
  { key: "glyph",   label: "Glyph"  },
  { key: "history", label: "History" },
];

const TabBar = memo(function TabBar({ active, onChange }) {
  return (
    <nav
      style={{ display: "flex", gap: 4, borderBottom: "1px solid #2a2a35", paddingBottom: 2 }}
      aria-label="Main navigation"
    >
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          aria-current={active === t.key ? "page" : undefined}
          style={{
            background: active === t.key ? "#2a2a35" : "none",
            border: "none",
            borderRadius: "6px 6px 0 0",
            color: active === t.key ? "#e8e8f0" : "#6b6b80",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: active === t.key ? 600 : 400,
            padding: "7px 14px",
            transition: "color 0.15s",
          }}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
});

// ── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("lookup");
  const [lookupText, setLookupText] = useState("");
  const [history, dispatchHistory] = useReducer(historyReducer, []);
  const { entries, indexes, ready } = useIndexes();

  const debouncedText = useDebounce(lookupText, 250);

  const handleHistoryAdd = useCallback((entry) => {
    dispatchHistory({ type: "ADD", entry });
  }, []);

  // Fix: this was a no-op in the original code
  const handleHistorySelect = useCallback((text) => {
    setLookupText(text);
    setTab("lookup");
  }, []);

  const handleHistoryRemove = useCallback((norm) => {
    dispatchHistory({ type: "REMOVE", norm });
  }, []);

  const handleHistoryClear = useCallback(() => {
    dispatchHistory({ type: "CLEAR" });
  }, []);

  return (
    <div
      style={{
        background: "#0f0f13",
        color: "#e8e8f0",
        fontFamily: "'Inter', system-ui, sans-serif",
        minHeight: "100vh",
        padding: "0 16px 40px",
      }}
    >
      <header
        style={{
          alignItems: "center",
          display: "flex",
          gap: 10,
          padding: "20px 0 16px",
        }}
      >
        <RainbowEye size={36} />
        <RainbowText
          text="ODE-N"
          style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.06em" }}
        />
        {!ready && (
          <span style={{ color: "#6b6b80", fontSize: 11, marginLeft: 8 }}>
            indexing…
          </span>
        )}
      </header>

      <TabBar active={tab} onChange={setTab} />

      <main style={{ maxWidth: 780, margin: "20px auto 0", paddingTop: 4 }}>
        {tab === "lookup" && (
          <LookupPanel
            value={lookupText}
            onChange={setLookupText}
            indexes={indexes}
            ready={ready}
            onHistoryAdd={handleHistoryAdd}
          />
        )}
        {tab === "calc" && (
          <CalcPanel indexes={indexes} ready={ready} />
        )}
        {tab === "name" && (
          <NamePanel />
        )}
        {tab === "glyph" && (
          <GlyphPanel />
        )}
        {tab === "history" && (
          <HistoryPanel
            history={history}
            onSelect={handleHistorySelect}
            onRemove={handleHistoryRemove}
            onClear={handleHistoryClear}
          />
        )}
      </main>
    </div>
  );
}
