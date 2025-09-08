import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/ICPad_backend/ICPad_backend.did.js";
import MotokoCompiler from "./motokoCompiler";

const agent = new HttpAgent({ 
  host: "http://127.0.0.1:4943",
  verifyQuerySignatures: false 
});

// Fetch root key for certificate validation during development
if (process.env.DFX_NETWORK !== "ic") {
  agent.fetchRootKey().catch((err) => {
    console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
    console.error(err);
  });
}

const motokoCompiler = new MotokoCompiler();

// Get canister ID with fallback
const getCanisterId = () => {
  // Try multiple ways to get the canister ID
  if (typeof process !== 'undefined' && process.env && process.env.CANISTER_ID_ICPAD_BACKEND) {
    return process.env.CANISTER_ID_ICPAD_BACKEND;
  }
  if (typeof window !== 'undefined' && window.location) {
    // Try to get from URL or other sources
    const urlParams = new URLSearchParams(window.location.search);
    const canisterId = urlParams.get('canisterId');
    if (canisterId) return canisterId;
  }
  // Fallback to hardcoded canister ID
  return "uxrrr-q7777-77774-qaaaq-cai";
};

// Initialize the actor
let ICPad_backend_actor = null;

const getActor = () => {
  if (!ICPad_backend_actor) {
    try {
      const canisterId = getCanisterId();
      console.log('Creating actor with canister ID:', canisterId);
      console.log('IDL Factory:', idlFactory);
      
      ICPad_backend_actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: canisterId,
      });
      
      console.log('Actor created successfully');
    } catch (error) {
      console.error('Failed to create actor:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }
  return ICPad_backend_actor;
};

// Project management functions
export const createProject = async (name, language, initialCode) => {
  try {
    console.log('Creating project:', { name, language, initialCode });
    const actor = getActor();
    const result = await actor.create_project(name, language, initialCode);
    console.log('Create project result:', result);
    
    if ('Ok' in result) {
      return { success: true, projectId: result.Ok };
    } else {
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('Create project error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return { success: false, error: error.message };
  }
};

export const getProject = async (projectId) => {
  try {
    console.log('Getting project:', projectId);
    const actor = getActor();
    const result = await actor.get_project(projectId);
    console.log('Get project result:', result);
    
    if ('Ok' in result) {
      return { success: true, project: JSON.parse(result.Ok) };
    } else {
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('Get project error:', error);
    return { success: false, error: error.message };
  }
};

export const listProjects = async () => {
  try {
    console.log('Listing projects...');
    const actor = getActor();
    const result = await actor.list_projects();
    console.log('List projects result:', result);
    
    if ('Ok' in result) {
      return { success: true, projects: JSON.parse(result.Ok) };
    } else {
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('List projects error:', error);
    return { success: false, error: error.message };
  }
};

export const updateProjectCode = async (projectId, newCode) => {
  try {
    const actor = getActor();
    const result = await actor.update_project_code(projectId, newCode);
    if ('Ok' in result) {
      return { success: true };
    } else {
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('Update project error:', error);
    return { success: false, error: error.message };
  }
};

// Development operations
export const compileProject = async (projectId) => {
  try {
    // First get the project to check its language
    const projectResult = await getProject(projectId);
    if (!projectResult.success) {
      return { success: false, error: projectResult.error };
    }
    
    const project = projectResult.project;
    console.log('Compiling project:', project.name, 'Language:', project.language);
    
    // Handle Motoko projects with frontend compiler
    if (project.language === 'motoko') {
      console.log('Using frontend Motoko compiler...');
      const compileResult = await motokoCompiler.compile(project.code);
      console.log('Motoko compilation result:', compileResult);
      return { success: true, result: compileResult };
    }
    
    // For other languages, use backend compilation
    console.log('Using backend compiler for:', project.language);
    const actor = getActor();
    const result = await actor.compile_project(projectId);
    if ('Ok' in result) {
      return { success: true, result: result.Ok };
    } else {
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('Compile project error:', error);
    return { success: false, error: error.message };
  }
};

export const deployProject = async (projectId) => {
  try {
    console.log('Deploying project:', projectId);
    const actor = getActor();
    const result = await actor.deploy_project(projectId);
    console.log('Deploy project result:', result);
    
    if ('Ok' in result) {
      const deployResult = JSON.parse(result.Ok);
      console.log('Parsed deploy result:', deployResult);
      return { success: true, result: deployResult };
    } else {
      console.error('Deploy failed:', result.Err);
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('Deploy project error:', error);
    return { success: false, error: error.message };
  }
};

export const testProject = async (projectId, testCode) => {
  try {
    const actor = getActor();
    const result = await actor.test_project(projectId, testCode);
    if ('Ok' in result) {
      return { success: true, result: result.Ok };
    } else {
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('Test project error:', error);
    return { success: false, error: error.message };
  }
};

// Connection check
export const checkCanisterConnection = async () => {
  try {
    const actor = getActor();
    const result = await actor.check_connection();
    if ('Ok' in result) {
      return { success: true, connected: result.Ok === "true" };
    } else {
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('Check connection error:', error);
    return { success: false, error: error.message };
  }
};

// Terminal commands
export const executeTerminalCommand = async (command, workingDir = null) => {
  try {
    const actor = getActor();
    const result = await actor.execute_terminal_command(command, workingDir);
    if ('Ok' in result) {
      return { success: true, output: result.Ok };
    } else {
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('Execute terminal command error:', error);
    return { success: false, error: error.message };
  }
};

// Docker session management
export const startDockerSession = async (sessionId) => {
  try {
    const actor = getActor();
    const result = await actor.start_docker_session(sessionId);
    if ('Ok' in result) {
      return { success: true, result: result.Ok };
    } else {
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('Start docker session error:', error);
    return { success: false, error: error.message };
  }
};

export const stopDockerSession = async (sessionId) => {
  try {
    const actor = getActor();
    const result = await actor.stop_docker_session(sessionId);
    if ('Ok' in result) {
      return { success: true, result: result.Ok };
    } else {
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('Stop docker session error:', error);
    return { success: false, error: error.message };
  }
};

// Motoko compilation
export const compileMotoko = async (code) => {
  try {
    const result = await motokoCompiler.compile(code);
    return { success: true, result };
  } catch (error) {
    console.error('Compile Motoko error:', error);
    return { success: false, error: error.message };
  }
};
