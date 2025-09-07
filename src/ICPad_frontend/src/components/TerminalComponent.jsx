// src/components/TerminalComponent.jsx
import React from "react";

export default function Terminal({ logs = [] }) {
  return (
    <div
      style={{
        height: "200px",
        background: "#1e1e1e",
        color: "#fff",
        padding: "0.5rem",
        fontFamily: "monospace",
        overflowY: "auto",
      }}
    >
      <h4>Terminal</h4>
      <pre>{Array.isArray(logs) ? logs.join("\n") : logs}</pre>
    </div>
  );
}
