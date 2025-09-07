import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import FileExplorer from "../components/FileExplorer";
import Terminal from "../components/TerminalComponent";

// Import backend microservice (you already created this)
import { ICPad_backend } from "../../ICPad_backend";

// IDE Page Component
export default function IDEPage() {
  const editorRef = useRef(null);

  const [currentFile, setCurrentFile] = useState(null);
  const [files, setFiles] = useState({
    src: {
      "main.mo": "// Motoko main file\nactor Main {}",
    },
    "dfx.json": '{\n  "canisters": {}\n}',
  });

  const [isConnected, setIsConnected] = useState(false);
  const [containerId, setContainerId] = useState(null);
  const [editorUrl, setEditorUrl] = useState(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  function handleFileSelect(filePath, content) {
    setCurrentFile({ path: filePath, content });
  }

  function handleEditorChange(value) {
    if (currentFile) {
      setFiles((prev) => {
        const updated = { ...prev };
        const pathParts = currentFile.path.split("/");
        let node = updated;
        for (let i = 0; i < pathParts.length - 1; i++) {
          node = node[pathParts[i]];
        }
        node[pathParts[pathParts.length - 1]] = value;
        return updated;
      });
      setCurrentFile((prev) => ({ ...prev, content: value }));
    }
  }

  // Connect / Disconnect button handler
  async function handleConnect() {
    if (!isConnected) {
      try {
        // Call backend canister to start Docker session
        const result = await ICPad_backend.start_docker_session("user_123");
        console.log(result);

        if ("Err" in result) {
          throw new Error(result.Err);
        }

        const url = result.Ok;
        setEditorUrl(url);

        // open IDE in new tab (could also embed in iframe)
        window.open(url, "_blank");

        // For disconnect, we also need the containerId
        // If your backend returns it, parse and set it here
        setContainerId("temp-id"); // Replace once backend returns containerId
        setIsConnected(true);
      } catch (err) {
        console.error("❌ Could not connect:", err);
        alert("Failed to connect: " + err.message);
      }
    } else {
      try {
        if (containerId) {
          const result = await ICPad_backend.stop_docker_session(containerId);
          if ("Err" in result) {
            throw new Error(result.Err);
          }
        }
        setIsConnected(false);
        setContainerId(null);
        setEditorUrl(null);
      } catch (err) {
        console.error("❌ Could not disconnect:", err);
        alert("Failed to disconnect: " + err.message);
      }
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation */}
      <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2">
        <h1 className="text-lg font-bold">ICPad IDE</h1>
        <button
          onClick={handleConnect}
          className={`px-4 py-1 rounded ${
            isConnected ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-40 bg-gray-100 border-r p-2 text-sm">
          <ul className="space-y-2">
            <li>📄 Code editor</li>
            <li>💻 Terminal</li>
            <li>🌐 Preview</li>
            <li>🔤 Candid UI</li>
            <li>🧩 Extensions</li>
            <li>🔗 GitHub</li>
          </ul>
        </div>

        {/* File Explorer */}
        <div className="w-64 bg-gray-50 border-r p-2">
          <div className="flex justify-between mb-2 text-sm font-semibold">
            <span>Files</span>
            <div className="space-x-1">
              <button className="px-1 border rounded">+</button>
              <button className="px-1 border rounded">📂</button>
            </div>
          </div>
          <FileExplorer files={files} onFileSelect={handleFileSelect} />
        </div>

        {/* Code Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={currentFile?.content || "// Select a file to start editing"}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
          />
        </div>
      </div>

      {/* Bottom Terminal */}
      <div className="h-40 border-t bg-black text-white text-sm">
        <Terminal />
      </div>
    </div>
  );
}
