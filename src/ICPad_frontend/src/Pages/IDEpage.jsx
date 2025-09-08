import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { ICPad_backend } from "../../ICPad_backend";
import { useTheme } from "../contexts/ThemeContext";

export default function EditorPage() {
  const { isDarkMode } = useTheme(); // ✅ use your ThemeContext
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [editorUrl, setEditorUrl] = useState(null);
  const [code, setCode] = useState("// Start coding here");

  async function handleStartSession() {
    try {
      setLoading(true);
      const result = await ICPad_backend.start_docker_session(userId);
      if ("Ok" in result) setEditorUrl(result.Ok);
      else if ("Err" in result) alert(`Backend error: ${result.Err}`);
    } catch (err) {
      console.error("Error starting session:", err);
      alert("Failed to start session");
    } finally {
      setLoading(false);
    }
  }

  async function handleStopSession() {
    try {
      setLoading(true);
      const result = await ICPad_backend.stop_docker_session(userId);
      if ("Ok" in result) {
        alert(`Session stopped: ${result.Ok}`);
        setEditorUrl(null);
      } else if ("Err" in result) alert(`Backend error: ${result.Err}`);
    } catch (err) {
      console.error("Error stopping session:", err);
    } finally {
      setLoading(false);
    }
  }

  // Theme palettes from your style
  const darkPalette = {
    containerBg: "#1e1e1e",
    text: "#f5f5f5",
    sidebarBg: "#252526",
    sidebarBorder: "#333",
    inputBg: "#1e1e1e",
    inputBorder: "#555",
    startBg: "#0e639c",
    stopBg: "#d9534f",
  };

  const lightPalette = {
    containerBg: "#ffffff",
    text: "#111827",
    sidebarBg: "#fafafa",
    sidebarBorder: "#e6e6e6",
    inputBg: "#ffffff",
    inputBorder: "#d1d5db",
    startBg: "#0e639c",
    stopBg: "#d9534f",
  };

  const c = isDarkMode ? darkPalette : lightPalette;

  // Inline styles
  const containerStyle = {
    display: "flex",
    height: "100vh",
    backgroundColor: c.containerBg,
    color: c.text,
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  };

  const sidebarStyle = {
    width: "280px",
    borderRight: `1px solid ${c.sidebarBorder}`,
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    backgroundColor: c.sidebarBg,
  };

  const inputStyle = {
    padding: "0.55rem",
    borderRadius: "6px",
    border: `1px solid ${c.inputBorder}`,
    backgroundColor: c.inputBg,
    color: c.text,
    outline: "none",
    marginBottom: "1rem",
  };

  const buttonBase = { padding: "0.6rem", borderRadius: "6px", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600 };
  const startBtnStyle = { ...buttonBase, backgroundColor: loading ? (isDarkMode ? "#666" : "#9bb8cc") : c.startBg, cursor: loading ? "not-allowed" : "pointer" };
  const stopBtnStyle = { ...buttonBase, backgroundColor: loading || !editorUrl ? (isDarkMode ? "#666" : "#caa9a9") : c.stopBg, cursor: loading || !editorUrl ? "not-allowed" : "pointer" };

  const rightPanelStyle = { flex: 1 };

  return (
    <div style={containerStyle}>
      {/* Left Panel */}
      <div style={sidebarStyle}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.15rem", fontWeight: 600, color: c.text }}>Session Controls</h2>
        <input type="text" placeholder="Enter User ID" value={userId} onChange={(e) => setUserId(e.target.value)} style={inputStyle} />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "auto" }}>
          <button onClick={handleStartSession} disabled={loading} style={startBtnStyle}>
            {loading ? "Starting..." : "Start Session"}
          </button>
          <button onClick={handleStopSession} disabled={loading || !editorUrl} style={stopBtnStyle}>
            {loading ? "Stopping..." : "Stop Session"}
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div style={rightPanelStyle}>
        {editorUrl ? (
          <iframe src={editorUrl} style={{ width: "100%", height: "100%", border: "none" }} title="Remote Editor" />
        ) : (
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            theme={isDarkMode ? "vs-dark" : "vs"} // ✅ Monaco follows ThemeContext
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              automaticLayout: true,
              scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
            }}
          />
        )}
      </div>
    </div>
  );
}
