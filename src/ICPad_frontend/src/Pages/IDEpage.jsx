import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { ICPad_backend } from "../../ICPad_backend";

export default function EditorPage() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [editorUrl, setEditorUrl] = useState(null);
  const [code, setCode] = useState("// Start coding here");

  async function handleStartSession() {
    try {
      setLoading(true);

      // Call backend canister method
      const result = await ICPad_backend.start_docker_session(userId);

      // result is a Candid variant — handle both Ok and Err
      if ("Ok" in result) {
        setEditorUrl(result.Ok);
      } else if ("Err" in result) {
        alert(`Backend error: ${result.Err}`);
      }
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
      } else if ("Err" in result) {
        alert(`Backend error: ${result.Err}`);
      }
    } catch (err) {
      console.error("Error stopping session:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Panel */}
      <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "1rem" }}>
        <h3>Session Controls</h3>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleStartSession} disabled={loading}>
            {loading ? "Starting..." : "Start Session"}
          </button>
          <button
            onClick={handleStopSession}
            disabled={loading || !editorUrl}
            style={{ marginLeft: "0.5rem" }}
          >
            {loading ? "Stopping..." : "Stop Session"}
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1 }}>
        {editorUrl ? (
          <iframe
            src={editorUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Remote Editor"
          />
        ) : (
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || "")}
          />
        )}
      </div>
    </div>
  );
}
