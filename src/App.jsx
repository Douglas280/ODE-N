import React, { useState, useCallback, useReducer, memo } from "react";
import { useIndexes } from "./hooks/useIndexes.js";
import { useDebounce } from "./hooks/useDebounce.js";
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
    <nav className="tab-bar" aria-label="Main navigation">
      {TABS.map(t => (
        <button
          key={t.key}
          className="tab-btn"
          onClick={() => onChange(t.key)}
          aria-current={active === t.key ? "page" : undefined}
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
    <div className="app-shell">
      <header className="app-header">
        <RainbowEye size={36} />
        <RainbowText
          text="ODE-N"
          style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.06em" }}
        />
        {!ready && (
          <span className="indexing-badge">
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "currentColor", opacity: 0.7,
              display: "inline-block", flexShrink: 0,
            }} />
            indexing
          </span>
        )}
      </header>

      <TabBar active={tab} onChange={setTab} />

      <main className="main-content">
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
