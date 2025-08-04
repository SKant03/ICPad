// src/pages/IDEPage.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useIDE } from '../contexts/IDEContext';
import Button from '../components/Button';

const IDEPage = () => {
  const { isDarkMode } = useTheme();
  const {
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
    clearTerminal
  } = useIDE();

  const bgColor = isDarkMode ? 'bg-slate-900' : 'bg-gray-100';
  const topBarBg = isDarkMode ? 'bg-zinc-800' : 'bg-gray-200';
  const panelBg = isDarkMode ? 'bg-zinc-800' : 'bg-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLanguage, setNewProjectLanguage] = useState('motoko');
  const [testInput, setTestInput] = useState('World');

  // Default code templates
  const defaultCodeTemplates = {
    motoko: `// main.mo - My Motoko DApp
actor {
  stable var counter: Nat = 0;

  public query func getCounter(): Nat {
    counter
  };

  public update func increment(): Nat {
    counter += 1;
    counter
  };

  public query func greet(name: Text): Text {
    "Hello, " # name # "!"
  };
};`,
    rust: `use candid::{CandidType, Deserialize};
use ic_cdk::api;

#[derive(CandidType, Deserialize)]
struct GreetArgs {
    name: String,
}

#[ic_cdk::query]
fn greet(args: GreetArgs) -> String {
    format!("Hello, {}!", args.name)
}

#[ic_cdk::update]
fn increment() -> u64 {
    // Add your logic here
    1
}`
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    const initialCode = defaultCodeTemplates[newProjectLanguage] || '';
    const projectId = await createNewProject(newProjectName, newProjectLanguage, initialCode);
    
    if (projectId) {
      await loadProject(projectId);
      setShowNewProjectModal(false);
      setNewProjectName('');
      setNewProjectLanguage('motoko');
    }
  };

  const handleSaveCode = async () => {
    if (currentProject) {
      await saveProjectCode(currentProject.id, code);
    }
  };

  const handleRunTest = async () => {
    await testCurrentProject(testInput);
  };

  return (
    <div className={`${bgColor} ${textColor} flex flex-col h-screen overflow-hidden`}>
      {/* Top Bar */}
      <div className={`${topBarBg} p-3 flex items-center justify-between shadow-sm z-10`}>
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold pl-4">
            {currentProject ? `Project: ${currentProject.name}` : 'ICPad IDE'}
          </h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm opacity-70">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <div className="flex space-x-3 pr-4">
          <Button 
            variant="secondary" 
            className="text-sm"
            onClick={handleRunTest}
            disabled={!currentProject || isLoading}
          >
            Test
          </Button>
          <Button 
            variant="secondary" 
            className="text-sm"
            onClick={compileCurrentProject}
            disabled={!currentProject || isLoading}
          >
            Compile
          </Button>
          <Button 
            className="text-sm"
            onClick={deployCurrentProject}
            disabled={!currentProject || isLoading}
          >
            Deploy
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: File Explorer & Projects */}
        <div className={`${panelBg} w-64 p-4 border-r border-zinc-700 overflow-y-auto flex-shrink-0`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Projects</h3>
            <Button 
              variant="ghost" 
              className="text-sm p-1"
              onClick={() => setShowNewProjectModal(true)}
            >
              ➕
            </Button>
          </div>
          
          {projects.length === 0 ? (
            <p className="text-sm opacity-70">No projects yet. Create your first project!</p>
          ) : (
          <ul className="space-y-1 text-sm">
              {projects.map(project => (
                <li 
                  key={project.id}
                  className={`flex items-center hover:bg-zinc-700 rounded-sm p-2 cursor-pointer ${
                    currentProject?.id === project.id ? 'bg-zinc-700' : ''
                  }`}
                  onClick={() => loadProject(project.id)}
                >
                  <span className="mr-2">📄</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{project.name}</div>
                    <div className="text-xs opacity-60">{project.language}</div>
                  </div>
                  {project.canister_id && (
                    <span className="text-xs text-green-400">🌐</span>
                  )}
                </li>
              ))}
          </ul>
          )}
        </div>

        {/* Center: Code Editor & Terminal */}
        <div className="flex flex-col flex-1">
          {/* Code Editor */}
          <div className="flex-1 border-b border-zinc-700 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 p-2 bg-zinc-700 text-sm border-b border-zinc-600 flex items-center justify-between">
              <span className="text-blue-300">
                {currentProject ? `${currentProject.name}.${currentProject.language === 'motoko' ? 'mo' : 'rs'}` : 'No file open'}
              </span>
              {currentProject && (
                <Button 
                  variant="ghost" 
                  className="text-xs p-1"
                  onClick={handleSaveCode}
                >
                  💾 Save
                </Button>
              )}
            </div>
            <textarea
              className="h-full w-full bg-zinc-900 text-gray-300 p-4 pt-10 overflow-auto text-sm font-mono resize-none border-none outline-none"
              style={{ paddingTop: 'calc(2.5rem + 8px)' }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Start coding here..."
              disabled={!currentProject}
            />
          </div>
          
          {/* Bottom: Terminal/Console */}
          <div className={`${panelBg} h-48 p-4 overflow-y-auto flex-shrink-0`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Terminal Output</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Test input..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="px-2 py-1 text-sm bg-zinc-700 border border-zinc-600 rounded text-white"
                  disabled={!currentProject}
                />
                <Button 
                  variant="ghost" 
                  className="text-xs p-1"
                  onClick={clearTerminal}
                >
                  🗑️ Clear
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-300 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
              {terminalOutput.length === 0 ? (
                <span className="opacity-50">Terminal output will appear here...</span>
              ) : (
                terminalOutput.map((output, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500">[{output.timestamp}]</span> {output.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Project Info & Quick Actions */}
        <div className={`${panelBg} w-64 p-4 border-l border-zinc-700 overflow-y-auto flex-shrink-0`}>
          <h3 className="font-semibold mb-3 text-lg">Project Info</h3>
          {currentProject ? (
          <div className="space-y-3">
              <div>
                <h4 className="font-medium text-blue-300">Project Details:</h4>
                <p className="text-sm">Name: {currentProject.name}</p>
                <p className="text-sm">Language: {currentProject.language}</p>
                <p className="text-sm">Status: {currentProject.status}</p>
                {currentProject.canister_id && (
                  <p className="text-sm">Canister: {currentProject.canister_id}</p>
                )}
              </div>
              
              <div>
            <h4 className="font-medium text-blue-300">Quick Actions:</h4>
                <div className="space-y-2 mt-2">
                  <Button 
                    variant="ghost" 
                    className="text-sm w-full justify-start"
                    onClick={compileCurrentProject}
                    disabled={isLoading}
                  >
                    🔨 Compile
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-sm w-full justify-start"
                    onClick={deployCurrentProject}
                    disabled={isLoading}
                  >
                    🚀 Deploy
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-sm w-full justify-start"
                    onClick={handleRunTest}
                    disabled={isLoading}
                  >
                    🧪 Test
                  </Button>
                </div>
              </div>
          </div>
          ) : (
            <p className="text-sm opacity-70">
              Select a project to view details and actions.
            </p>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${panelBg} p-6 rounded-lg w-96`}>
            <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  placeholder="My Awesome DApp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={newProjectLanguage}
                  onChange={(e) => setNewProjectLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                >
                  <option value="motoko">Motoko</option>
                  <option value="rust">Rust</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim() || isLoading}
                  className="flex-1"
                >
                  Create
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowNewProjectModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDEPage;
