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
    hasUnsavedChanges,
    createNewProject,
    loadProject,
    saveCurrentProject,
    compileCurrentProject,
    deployCurrentProject,
    testCurrentProject,
    testGetMessage,
    testGreet,
    testWhoami,
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
pub async fn greet(name: String) -> String {
    format!("Hello, {}! Welcome to ICPad!", name)
}

#[update]
pub async fn get_message() -> String {
    "Hello from ICPad!".to_string()
}

#[update]
pub async fn whoami() -> String {
    "Principal from actor".to_string()
}`,
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
    return "Principal from actor";
}`,
    },
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    const language = newProjectLanguage;
    const template = languageConfigs[language]?.template || "";
    
    const projectId = await createNewProject(newProjectName, language, template);
    if (projectId) {
      setNewProjectName("");
      setNewProjectLanguage("rust");
      await loadProject(projectId);
    }
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    if (currentProject) {
      // Update project language if project is loaded
      // This would require a backend call to update the project
    }
  };

  const handleLoadProject = async (project) => {
    await loadProject(project.id);
    setSelectedLanguage(project.language);
  };

  const handleSaveProject = async () => {
    await saveCurrentProject();
  };

  const handleCompileProject = async () => {
    await compileCurrentProject();
  };

  const handleDeployProject = async () => {
    await deployCurrentProject();
  };

  const handleTestProject = async () => {
    const testInput = prompt("Enter test input:");
    if (testInput !== null) {
      await testCurrentProject(testInput);
    }
  };

  const handleTerminalHeightChange = (height) => {
    setTerminalHeight(height);
  };

  const handleClearTerminal = () => {
    clearTerminal();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">ICPad IDE</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Language:</span>
              <select
                value={selectedLanguage}
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
                {hasUnsavedChanges && (
                  <span className="ml-2 text-yellow-400 text-xs">● Unsaved changes</span>
                )}
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
                Create Project
              </Button>
            </div>
          </Card>

          {/* Projects */}
          <Card className="m-4 p-4 flex-1">
            <h3 className="text-lg font-semibold mb-3">Projects</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleLoadProject(project)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    currentProject?.id === project.id
                      ? 'bg-blue-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-gray-400">
                    {project.language} • {new Date(project.created_at / 1000000).toLocaleDateString()}
                  </div>
                  {project.deployed && (
                    <div className="text-xs text-green-400 mt-1">
                      ✓ Deployed
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <Card className="m-4 p-4">
            <h3 className="text-lg font-semibold mb-3">Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={handleSaveProject}
                disabled={isLoading || !currentProject}
                className={`w-full ${hasUnsavedChanges ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
              >
                {hasUnsavedChanges ? 'Save Code ●' : 'Save Code'}
              </Button>
              <Button
                onClick={handleCompileProject}
                disabled={isLoading || !currentProject}
                className="w-full"
              >
                Compile
              </Button>
              <Button
                onClick={handleDeployProject}
                disabled={isLoading || !currentProject}
                className="w-full"
              >
                Deploy
              </Button>
              <Button
                onClick={handleTestProject}
                disabled={isLoading || !currentProject}
                className="w-full"
              >
                Test
              </Button>
            </div>
          </Card>

          {/* Function Tests - Only show if project is deployed */}
          {currentProject && currentProject.deployed && (
            <Card className="m-4 p-4">
              <h3 className="text-lg font-semibold mb-3">Test Functions</h3>
              <div className="space-y-2">
                <Button
                  onClick={testGetMessage}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Test getMessage()
                </Button>
                <Button
                  onClick={testGreet}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Test greet()
                </Button>
                <Button
                  onClick={testWhoami}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Test whoami()
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={selectedLanguage}
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
              }}
            />
          </div>

          {/* Terminal */}
          <div className="border-t border-gray-700">
            <Terminal
              output={terminalOutput}
              onHeightChange={handleTerminalHeightChange}
              onClear={handleClearTerminal}
            />
          </div>
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
