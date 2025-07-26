import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/ICPad_backend/ICPad_backend.did.js';

// Initialize the agent
const agent = new HttpAgent({
  host: 'http://localhost:4943', // Always use localhost for local development
});

// For local development, we need to fetch the root key
agent.fetchRootKey().catch(console.error);

// Initialize the actor
let actor = null;

export const initializeActor = async () => {
  if (!actor) {
    // For local development, we need to fetch the root key
    await agent.fetchRootKey().catch(console.error);
    
    actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: 'ufxgi-4p777-77774-qaadq-cai', // Local backend canister ID
    });
  }
  return actor;
};

// Project management functions
export const createProject = async (name, language, initialCode) => {
  try {
    const actor = await initializeActor();
    const projectId = await actor.create_project(name, language, initialCode);
    return { success: true, projectId };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error.message };
  }
};

export const getProject = async (projectId) => {
  try {
    const actor = await initializeActor();
    const project = await actor.get_project(projectId);
    return { success: true, project };
  } catch (error) {
    console.error('Error getting project:', error);
    return { success: false, error: error.message };
  }
};

export const listProjects = async () => {
  try {
    const actor = await initializeActor();
    const projects = await actor.list_projects();
    return { success: true, projects };
  } catch (error) {
    console.error('Error listing projects:', error);
    return { success: false, error: error.message };
  }
};

export const updateProjectCode = async (projectId, code) => {
  try {
    const actor = await initializeActor();
    const success = await actor.update_project_code(projectId, code);
    return { success };
  } catch (error) {
    console.error('Error updating project code:', error);
    return { success: false, error: error.message };
  }
};

export const compileProject = async (projectId) => {
  try {
    const actor = await initializeActor();
    const result = await actor.compile_project(projectId);
    return { success: true, result };
  } catch (error) {
    console.error('Error compiling project:', error);
    return { success: false, error: error.message };
  }
};

export const deployProject = async (projectId) => {
  try {
    const actor = await initializeActor();
    const result = await actor.deploy_project(projectId);
    return { success: true, result };
  } catch (error) {
    console.error('Error deploying project:', error);
    return { success: false, error: error.message };
  }
};

export const testProject = async (projectId, testInput) => {
  try {
    const actor = await initializeActor();
    const result = await actor.test_project(projectId, testInput);
    return { success: true, result };
  } catch (error) {
    console.error('Error testing project:', error);
    return { success: false, error: error.message };
  }
};

// Utility function to check if we're connected to the canister
export const checkCanisterConnection = async () => {
  try {
    const actor = await initializeActor();
    const result = await actor.greet('test');
    return { success: true, connected: result.includes('Hello') };
  } catch (error) {
    console.error('Error checking canister connection:', error);
    return { success: false, connected: false, error: error.message };
  }
}; 