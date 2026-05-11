import React from "react";

const S = {
  card: {
    background: "#18181f",
    border: "1px solid #2a2a35",
    borderRadius: 10,
    padding: "16px",
  },
  btn: {
    background: "#2a2a35",
    border: "1px solid #3a3a48",
    borderRadius: 6,
    color: "#e8e8f0",
    cursor: "pointer",
    fontSize: 13,
    padding: "6px 12px",
    transition: "background 0.15s",
  },
  btnActive: {
    background: "#7c6af7",
    borderColor: "#7c6af7",
  },
  inp: {
    background: "#0f0f13",
    border: "1px solid #2a2a35",
    borderRadius: 6,
    color: "#e8e8f0",
    fontSize: 14,
    padding: "8px 12px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  badge: {
    borderRadius: 4,
    display: "inline-block",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 6px",
  },
  sectionLabel: {
    color: "#6b6b80",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  fieldLabel: {
    color: "#6b6b80",
    fontSize: 11,
    marginBottom: 4,
  },
  emptyState: {
    color: "#6b6b80",
    fontSize: 13,
    padding: "24px 0",
    textAlign: "center",
  },
};

export function Card({ children, style }) {
  return <div style={{ ...S.card, ...style }}>{children}</div>;
}

export function Btn({ children, active, onClick, style, ...rest }) {
  return (
    <button
      onClick={onClick}
      style={{ ...S.btn, ...(active ? S.btnActive : {}), ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Inp({ style, ...props }) {
  return <input style={{ ...S.inp, ...style }} {...props} />;
}

export function ValueBadge({ value, color }) {
  return (
    <span style={{ ...S.badge, background: color + "22", color }}>
      {value}
    </span>
  );
}

export function CopyBtn({ onCopy, copied }) {
  return (
    <button
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      title={copied ? "Copied!" : "Copy"}
      style={{
        ...S.btn,
        padding: "4px 8px",
        fontSize: 11,
        background: copied ? "#4ade8022" : "#2a2a35",
        color: copied ? "#4ade80" : "#6b6b80",
        borderColor: copied ? "#4ade8055" : "#3a3a48",
      }}
    >
      {copied ? "✓" : "⧉"}
    </button>
  );
}

export function EmptyState({ message }) {
  return <div style={S.emptyState}>{message}</div>;
}

export function SectionLabel({ children }) {
  return <div style={S.sectionLabel}>{children}</div>;
}

export function FieldLabel({ children }) {
  return <div style={S.fieldLabel}>{children}</div>;
}
