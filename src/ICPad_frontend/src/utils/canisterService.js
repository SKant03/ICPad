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
    
    // Use the current backend canister ID
    const canisterId = 'uxrrr-q7777-77774-qaaaq-cai';
    
    actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: canisterId,
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
    return { connected: true, success: true };
  } catch (error) {
    console.error('Error checking canister connection:', error);
    return { connected: false, success: false, error: error.message };
  }
};

// Marketplace functions
export const listTemplates = async () => {
  try {
    const actor = await initializeActor();
    const templates = await actor.list_templates();
    return { success: true, templates };
  } catch (error) {
    console.error('Error listing templates:', error);
    return { success: false, error: error.message };
  }
};

export const getTemplate = async (templateId) => {
  try {
    const actor = await initializeActor();
    const template = await actor.get_template(templateId);
    return { success: true, template };
  } catch (error) {
    console.error('Error getting template:', error);
    return { success: false, error: error.message };
  }
};

export const createTemplate = async (name, description, category, language, code) => {
  try {
    const actor = await initializeActor();
    const templateId = await actor.create_template(name, description, category, language, code);
    return { success: true, templateId };
  } catch (error) {
    console.error('Error creating template:', error);
    return { success: false, error: error.message };
  }
};

export const installTemplate = async (templateId) => {
  try {
    const actor = await initializeActor();
    const projectId = await actor.install_template(templateId);
    return { success: true, projectId };
  } catch (error) {
    console.error('Error installing template:', error);
    return { success: false, error: error.message };
  }
};

export const rateTemplate = async (templateId, rating) => {
  try {
    const actor = await initializeActor();
    const success = await actor.rate_template(templateId, rating);
    return { success };
  } catch (error) {
    console.error('Error rating template:', error);
    return { success: false, error: error.message };
  }
};

export const downloadTemplate = async (templateId) => {
  try {
    const actor = await initializeActor();
    const success = await actor.download_template(templateId);
    return { success };
  } catch (error) {
    console.error('Error downloading template:', error);
    return { success: false, error: error.message };
  }
}; 