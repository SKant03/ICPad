import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createProject,
  getProject,
  listProjects,
  updateProjectCode,
  compileProject,
  deployProject,
  testProject,
  checkCanisterConnection
} from '../utils/canisterService';

const IDEContext = createContext();

export const useIDE = () => {
  const context = useContext(IDEContext);
  if (!context) {
    throw new Error('useIDE must be used within an IDEProvider');
  }
  return context;
};

export const IDEProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [code, setCode] = useState('');

  // Check canister connection on mount
  useEffect(() => {
    checkConnection();
    loadProjects();
  }, []);

  const checkConnection = async () => {
    try {
      const result = await checkCanisterConnection();
      setIsConnected(result.connected);
      if (result.connected) {
        addTerminalOutput('✅ Connected to ICPad backend canister');
      } else {
        addTerminalOutput('❌ Failed to connect to canister: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      setIsConnected(false);
      addTerminalOutput('❌ Connection error: ' + error.message);
    }
  };

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      console.log('Loading projects...');
      const result = await listProjects();
      console.log('Projects result:', result);
      if (result.success) {
        setProjects(result.projects || []);
        addTerminalOutput(`📁 Loaded ${result.projects?.length || 0} projects`);
      } else {
        addTerminalOutput('❌ Failed to load projects: ' + result.error);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      addTerminalOutput('❌ Error loading projects: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewProject = async (name, language, initialCode) => {
    setIsLoading(true);
    addTerminalOutput(`🚀 Creating new project: ${name} (${language})`);
    
    try {
      const result = await createProject(name, language, initialCode);
      if (result.success) {
        addTerminalOutput(`✅ Project created successfully! ID: ${result.projectId}`);
        await loadProjects(); // Refresh project list
        return result.projectId;
      } else {
        addTerminalOutput('❌ Failed to create project: ' + result.error);
        return null;
      }
    } catch (error) {
      addTerminalOutput('❌ Error creating project: ' + error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadProject = async (projectId) => {
    setIsLoading(true);
    addTerminalOutput(`📂 Loading project: ${projectId}`);
    
    try {
      console.log('Loading project with ID:', projectId);
      const result = await getProject(projectId);
      console.log('Project load result:', result);
      if (result.success && result.project) {
        // Fix: handle array case
        const projectObj = Array.isArray(result.project) ? result.project[0] : result.project;
        console.log('Setting current project:', projectObj);
        setCurrentProject(projectObj);
        setCode(projectObj.code);
        addTerminalOutput(`✅ Project loaded: ${projectObj.name}`);
      } else {
        addTerminalOutput('❌ Failed to load project: ' + (result.error || 'Project not found'));
      }
    } catch (error) {
      console.error('Error loading project:', error);
      addTerminalOutput('❌ Error loading project: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProjectCode = async (projectId, newCode) => {
    if (!projectId) {
      addTerminalOutput('❌ No project selected for saving');
      return false;
    }

    addTerminalOutput('💾 Saving project code...');
    
    try {
      const result = await updateProjectCode(projectId, newCode);
      if (result.success) {
        setCode(newCode);
        addTerminalOutput('✅ Code saved successfully');
        return true;
      } else {
        addTerminalOutput('❌ Failed to save code: ' + result.error);
        return false;
      }
    } catch (error) {
      addTerminalOutput('❌ Error saving code: ' + error.message);
      return false;
    }
  };

  const compileCurrentProject = async () => {
    if (!currentProject) {
      addTerminalOutput('❌ No project selected for compilation');
      return;
    }

    setIsLoading(true);
    addTerminalOutput('🔨 Compiling project...');
    
    try {
      const result = await compileProject(currentProject.id);
      if (result.success) {
        const compileResult = result.result;
        if (compileResult.success) {
          addTerminalOutput('✅ Compilation successful!');
          addTerminalOutput(compileResult.output);
        } else {
          addTerminalOutput('❌ Compilation failed!');
          compileResult.errors.forEach(error => {
            addTerminalOutput(`  - ${error}`);
          });
        }
      } else {
        addTerminalOutput('❌ Failed to compile: ' + result.error);
      }
    } catch (error) {
      addTerminalOutput('❌ Error during compilation: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deployCurrentProject = async () => {
    if (!currentProject) {
      addTerminalOutput('❌ No project selected for deployment');
      return;
    }

    setIsLoading(true);
    addTerminalOutput('🚀 Deploying project to Internet Computer...');
    
    try {
      const result = await deployProject(currentProject.id);
      if (result.success) {
        const deployResult = result.result;
        if (deployResult.success) {
          addTerminalOutput('✅ Deployment successful!');
          addTerminalOutput(`🌐 Canister ID: ${deployResult.canister_id}`);
          addTerminalOutput(`🔗 URL: ${deployResult.url}`);
          addTerminalOutput(deployResult.output);
          
          // Update current project with deployment info
          await loadProject(currentProject.id);
        } else {
          addTerminalOutput('❌ Deployment failed!');
          addTerminalOutput(deployResult.output);
        }
      } else {
        addTerminalOutput('❌ Failed to deploy: ' + result.error);
      }
    } catch (error) {
      addTerminalOutput('❌ Error during deployment: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testCurrentProject = async (testInput) => {
    if (!currentProject) {
      addTerminalOutput('❌ No project selected for testing');
      return;
    }

    addTerminalOutput(`🧪 Testing project with input: "${testInput}"`);
    
    try {
      const result = await testProject(currentProject.id, testInput);
      if (result.success) {
        addTerminalOutput(`✅ Test result: ${result.result}`);
      } else {
        addTerminalOutput('❌ Test failed: ' + result.error);
      }
    } catch (error) {
      addTerminalOutput('❌ Error during testing: ' + error.message);
    }
  };

  const addTerminalOutput = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalOutput(prev => [...prev, { timestamp, message }]);
  };

  const clearTerminal = () => {
    setTerminalOutput([]);
  };

  const value = {
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
    loadProjects,
    checkConnection
  };

  return (
    <IDEContext.Provider value={value}>
      {children}
    </IDEContext.Provider>
  );
}; 