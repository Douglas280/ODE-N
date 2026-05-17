import React, { useState, useCallback, useReducer } from "react";
import { useIndexes } from "./hooks/useIndexes.js";
import { useCopy } from "./hooks/useCopy.js";
import { RainbowEye } from "./components/RainbowEye.jsx";
import { RainbowText } from "./components/RainbowText.jsx";
import { CipherSelector } from "./components/CipherSelector.jsx";
import { LookupPanel } from "./components/LookupPanel.jsx";
import { CalcPanel } from "./components/CalcPanel.jsx";
import { NamePanel } from "./components/NamePanel.jsx";
import { GlyphPanel } from "./components/GlyphPanel.jsx";
import { HistoryPanel } from "./components/HistoryPanel.jsx";
import { T, Divider } from "./components/ui.jsx";

function historyReducer(state, action) {
  switch (action.type) {
    case "push": {
      const text = action.text.trim();
      if (!text) return state;
      const deduped = state.filter(h => h.text !== text);
      return [{ text, ts: Date.now() }, ...deduped].slice(0, 40);
    }
    case "remove":
      return state.filter(h => h.ts !== action.ts);
    case "clear":
      return [];
    default:
      return state;
  }
}

export default function App() {
  const [activeCipher, setActiveCipher] = useState("simple");
  const [history, histDispatch] = useReducer(historyReducer, []);
  const { copy, copiedId } = useCopy();
  const { indexes, count, ready } = useIndexes();

  const setCipher = useCallback(v => setActiveCipher(v), []);
  const handleHistoryPush = useCallback(text => histDispatch({ type: "push", text }), []);

  return (
    <div style={{
      minHeight:  "100vh",
      background: T.bg0,
      color:      T.text,
      fontFamily: T.mono,
      fontSize:   15,
    }}>
      <header style={{
        position:        "sticky",
        top:             0,
        zIndex:          100,
        background:      T.bg0,
        borderBottom:    `1px solid ${T.border}`,
        padding:         "10px 16px 8px",
      }}>
        <div style={{
          maxWidth: 560,
          margin:   "0 auto",
        }}>
          <div style={{
            display:     "flex",
            alignItems:  "center",
            gap:         10,
            marginBottom: 8,
          }}>
            <RainbowEye size={32} />
            <RainbowText />
            <span style={{ fontSize: 11, color: T.textDim, marginLeft: 4 }}>
              {ready ? `${count.toLocaleString()} phrases` : "indexing…"}
            </span>
          </div>
          <CipherSelector active={activeCipher} onChange={setCipher} />
        </div>
      </header>

      <main style={{
        maxWidth: 560,
        margin:   "0 auto",
        padding:  "16px 16px 60px",
      }}>
        <LookupPanel
          indexes={indexes}
          activeCipher={activeCipher}
          copy={copy}
          copiedId={copiedId}
          onHistoryPush={handleHistoryPush}
        />

        <HistoryPanel
          history={history}
          dispatch={histDispatch}
          copy={copy}
          copiedId={copiedId}
        />

        <Divider label="calculator" />

        <CalcPanel
          indexes={indexes}
          activeCipher={activeCipher}
          copy={copy}
          copiedId={copiedId}
        />

        <Divider label="name" />

        <NamePanel
          indexes={indexes}
          copy={copy}
          copiedId={copiedId}
        />

        <Divider label="glyph" />

        <GlyphPanel
          copy={copy}
          copiedId={copiedId}
        />
      </main>
    </div>
  );
}
