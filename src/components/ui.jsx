import React from "react";

export function Card({ children, style, className }) {
  return (
    <div className={`card${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </div>
  );
}

export function Btn({ children, active, onClick, style, className, ...rest }) {
  const cls = ["btn", active ? "active" : "", className].filter(Boolean).join(" ");
  return (
    <button onClick={onClick} className={cls} style={style} {...rest}>
      {children}
    </button>
  );
}

export function Inp({ style, className, ...props }) {
  return <input className={`inp${className ? ` ${className}` : ""}`} style={style} {...props} />;
}

export function ValueBadge({ value, color }) {
  return (
    <span
      className="badge"
      style={{ background: color + "22", color }}
    >
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
      className={`copy-btn${copied ? " copied" : ""}`}
    >
      {copied ? "✓" : "⧉"}
    </button>
  );
}

export function EmptyState({ message, icon }) {
  return (
    <div className="empty-state">
      {icon && <span className="empty-state-icon">{icon}</span>}
      <span>{message}</span>
    </div>
  );
}

export function LoadingState({ message = "Building index…" }) {
  return (
    <div className="loading-state">
      <div className="loading-dots">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
      <span>{message}</span>
    </div>
  );
}

export function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>;
}

export function FieldLabel({ children }) {
  return <div className="field-label">{children}</div>;
}
