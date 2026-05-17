import React from "react";
import { digitalRoot } from "../engine/normalize.js";

export const T = {
  bg0:      "#000000",
  bg1:      "#0d0d0d",
  bg2:      "#151515",
  border:   "#1e1e1e",
  border2:  "#2a2a2a",
  text:     "#e8e8e8",
  textDim:  "#444444",
  textMid:  "#888888",
  mono:     "'Courier New', Courier, monospace",
  radius:   10,
  radiusLg: 14,
};

export const baseInputStyle = {
  width:            "100%",
  padding:          "12px 14px",
  borderRadius:     T.radius,
  border:           `1px solid ${T.border}`,
  background:       T.bg0,
  color:            T.text,
  fontSize:         15,
  fontFamily:       T.mono,
  boxSizing:        "border-box",
  outline:          "none",
  WebkitAppearance: "none",
};

export function Card({ children, style }) {
  return (
    <div style={{
      background:   T.bg1,
      border:       `1px solid ${T.border}`,
      borderRadius: T.radiusLg,
      padding:      "16px",
      marginBottom: 12,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize:      11,
      fontWeight:    700,
      color:         T.textDim,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      marginBottom:  12,
    }}>
      {children}
    </div>
  );
}

export function FieldLabel({ children }) {
  return (
    <div style={{
      fontSize:      11,
      color:         T.textMid,
      marginBottom:  5,
      letterSpacing: "0.04em",
    }}>
      {children}
    </div>
  );
}

export function Inp({ value, onChange, placeholder, type = "text", min, max, accentColor, style: ext, onKeyDown }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      onKeyDown={onKeyDown}
      style={{
        ...baseInputStyle,
        borderColor: value ? (accentColor || T.border2) : T.border,
        ...ext,
      }}
    />
  );
}

export function Btn({ onClick, children, active, color, style: ext, title, ...rest }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        padding:      "9px 14px",
        borderRadius: T.radius,
        border:       `1px solid ${active ? (color || T.border2) : T.border}`,
        background:   active ? `${color || "#38bdf8"}1a` : "transparent",
        color:        active ? (color || "#38bdf8") : T.textMid,
        cursor:       "pointer",
        fontSize:     12,
        fontFamily:   T.mono,
        whiteSpace:   "nowrap",
        ...ext,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export function CopyBtn({ text, id, copy, copiedId, style: ext }) {
  const done = copiedId === id;
  return (
    <button
      onClick={e => { e.stopPropagation(); copy(text, id); }}
      title="Copy to clipboard"
      style={{
        background:     "transparent",
        border:         "none",
        color:          done ? "#4ade80" : T.textDim,
        cursor:         "pointer",
        fontSize:       13,
        padding:        "4px 6px",
        fontFamily:     T.mono,
        flexShrink:     0,
        minWidth:       28,
        minHeight:      28,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        ...ext,
      }}
    >
      {done ? "✓" : "⎘"}
    </button>
  );
}

export function ValueBadge({ cipher, value, cipherDef, showRoot = false }) {
  const { short, color } = cipherDef;
  const root = digitalRoot(value);
  return (
    <span style={{
      display:      "inline-flex",
      alignItems:   "center",
      gap:          4,
      padding:      "4px 10px",
      borderRadius: 6,
      border:       `1px solid ${color}33`,
      fontSize:     12,
      fontFamily:   T.mono,
      fontWeight:   700,
      color,
      flexShrink:   0,
      whiteSpace:   "nowrap",
    }}>
      <span style={{ color: `${color}55`, fontWeight: 400, fontSize: 10 }}>{short}</span>
      {value}
      {showRoot && <span style={{ color: `${color}44`, fontSize: 9 }}>/{root}</span>}
    </span>
  );
}

export function EmptyState({ text }) {
  return (
    <div style={{ color: T.textDim, fontSize: 13, padding: "20px 0", textAlign: "center" }}>
      {text}
    </div>
  );
}

export function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 12px" }}>
      <div style={{ flex: 1, height: 1, background: T.border }} />
      <span style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}
