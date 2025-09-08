import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Terminal from "../components/Terminal";
import { useIDE } from "../contexts/IDEContext";
import Button from "../components/Button";
import Card from "../components/Card";
import CompilationResults from "../components/CompilationResults";

export default function IDEpage() {
  const {
    compilationResult,
    showCompilationResults,
    closeCompilationResults,
    currentProject,
    projects,
    isConnected,
    isLoading,
    terminalOutput,
    code,
    setCode,
    createNewProject,
    loadProject,
    saveProjectCode,
    compileCurrentProject,
    deployCurrentProject,
    testCurrentProject,
    addTerminalOutput,
    clearTerminal,
    loadProjects
  } = useIDE();

  const [selectedLanguage, setSelectedLanguage] = useState("rust");
  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState("300px");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectLanguage, setNewProjectLanguage] = useState("rust");

  // Language configurations
  const languageConfigs = {
    rust: {
      name: "Rust",
      extension: "rs",
      template: `// Rust Internet Computer Canister
use ic_cdk::update;
use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize)]
struct Message {
    text: String,
}

#[update]
fn greet(name: String) -> String {
    format!("Hello, {}! Welcome to ICPad!", name)
}

#[update]
fn get_message() -> Message {
    Message {
        text: "Hello from ICPad!".to_string(),
    }
}`,
      monacoLanguage: "rust"
    },
    motoko: {
      name: "Motoko",
      extension: "mo",
      template: `// Motoko Internet Computer Canister
import Principal "mo:base/Principal";
import Text "mo:base/Text";

actor Hello {
    public func greet(name : Text) : async Text {
        return "Hello, " # name # "! Welcome to ICPad!";
    };

    public func getMessage() : async Text {
        return "Hello from ICPad!";
    };

    public func whoami() : async Principal {
        return Principal.fromActor(Hello);
    };
}`,
      monacoLanguage: "motoko"
    },
    javascript: {
      name: "JavaScript",
      extension: "js",
      template: `// JavaScript Internet Computer Canister
export function greet(name) {
    return \`Hello, \${name}! Welcome to ICPad!\`;
}

export function getMessage() {
    return "Hello from ICPad!";
}

export function whoami() {
    return "anonymous";
}`,
      monacoLanguage: "javascript"
    }
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    if (currentProject) {
      // Update current project language
      const newCode = languageConfigs[language]?.template || code;
      setCode(newCode);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      addTerminalOutput("❌ Please enter a project name");
      return;
    }

    const config = languageConfigs[newProjectLanguage];
    if (!config) {
      addTerminalOutput("❌ Unsupported language");
      return;
    }

    const projectId = await createNewProject(newProjectName, newProjectLanguage, config.template);
    if (projectId) {
      setNewProjectName("");
      addTerminalOutput(`✅ Created project: ${newProjectName} (${config.name})`);
    }
  };

  const handleSaveCode = async () => {
    if (!currentProject) {
      addTerminalOutput("❌ No project selected");
      return;
    }

    const success = await saveProjectCode(currentProject.id, code);
    if (success) {
      addTerminalOutput("✅ Code saved successfully");
    }
  };

  const handleCompile = async () => {
    if (!currentProject) {
      addTerminalOutput("❌ No project selected");
      return;
    }

    await compileCurrentProject();
  };

  const handleDeploy = async () => {
    if (!currentProject) {
      addTerminalOutput("❌ No project selected");
      return;
    }

    await deployCurrentProject();
  };

  const handleTest = async () => {
    if (!currentProject) {
      addTerminalOutput("❌ No project selected");
      return;
    }

    const testInput = prompt("Enter test input:");
    if (testInput !== null) {
      await testCurrentProject(testInput);
    }
  };

  const getCurrentLanguage = () => {
    if (currentProject) {
      return currentProject.language || "rust";
    }
    return selectedLanguage;
  };

  const getCurrentConfig = () => {
    const lang = getCurrentLanguage();
    return languageConfigs[lang] || languageConfigs.rust;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">ICPad IDE</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Language:</span>
              <select
                value={getCurrentLanguage()}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                disabled={!!currentProject}
              >
                <option value="rust">Rust</option>
                <option value="motoko">Motoko</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            {currentProject && (
              <div className="text-sm text-gray-400">
                Project: <span className="text-white font-medium">{currentProject.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Project Creation */}
          <Card className="m-4 p-4">
            <h3 className="text-lg font-semibold mb-3">New Project</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
              />
              <select
                value={newProjectLanguage}
                onChange={(e) => setNewProjectLanguage(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
              >
                <option value="rust">Rust</option>
                <option value="motoko">Motoko</option>
                <option value="javascript">JavaScript</option>
              </select>
              <Button
                onClick={handleCreateProject}
                disabled={isLoading || !newProjectName.trim()}
                className="w-full"
              >
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </Card>

          {/* Project List */}
          <Card className="m-4 p-4 flex-1">
            <h3 className="text-lg font-semibold mb-3">Projects</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => loadProject(project.id)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    currentProject?.id === project.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium text-sm">{project.name}</div>
                  <div className="text-xs text-gray-400">{project.language}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <Card className="m-4 p-4">
            <h3 className="text-lg font-semibold mb-3">Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={handleSaveCode}
                disabled={!currentProject || isLoading}
                className="w-full"
              >
                Save Code
              </Button>
              <Button
                onClick={handleCompile}
                disabled={!currentProject || isLoading}
                className="w-full"
              >
                Compile
              </Button>
              <Button
                onClick={handleDeploy}
                disabled={!currentProject || isLoading}
                className="w-full"
              >
                Deploy
              </Button>
              <Button
                onClick={handleTest}
                disabled={!currentProject || isLoading}
                className="w-full"
              >
                Test
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={getCurrentConfig().monacoLanguage}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
                folding: true,
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true,
                },
              }}
            />
          </div>

          {/* Terminal Toggle */}
          <div className="bg-gray-800 border-t border-gray-700 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowTerminal(!showTerminal)}
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                >
                  <span>{showTerminal ? '▼' : '▲'}</span>
                  <span>Terminal</span>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Height:</span>
                  <select
                    value={terminalHeight}
                    onChange={(e) => setTerminalHeight(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                  >
                    <option value="200px">Small</option>
                    <option value="300px">Medium</option>
                    <option value="400px">Large</option>
                  </select>
                </div>
              </div>
              <button
                onClick={clearTerminal}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="border-t border-gray-700">
              <Terminal height={terminalHeight} />
            </div>
          )}
        </div>
      </div>
      {/* Compilation Results Modal */}
      {showCompilationResults && (
        <CompilationResults
          result={compilationResult}
          onClose={closeCompilationResults}
        />
      )}
    </div>
  );
}