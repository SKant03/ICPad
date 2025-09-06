import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as marketplaceIdlFactory } from '../../../declarations/ICPad_marketplace/ICPad_marketplace.did.js';

// Initialize the agent for marketplace
const marketplaceAgent = new HttpAgent({
  host: 'http://localhost:4943',
});

// For local development, we need to fetch the root key
marketplaceAgent.fetchRootKey().catch(console.error);

// Initialize the marketplace actor
let marketplaceActor = null;

export const initializeMarketplaceActor = async () => {
  if (!marketplaceActor) {
    await marketplaceAgent.fetchRootKey().catch(console.error);
    
    // Use the marketplace canister ID
    const canisterId = 'umunu-kh777-77774-qaaca-cai';
    
    marketplaceActor = Actor.createActor(marketplaceIdlFactory, {
      agent: marketplaceAgent,
      canisterId: canisterId,
    });
  }
  return marketplaceActor;
};

// Marketplace functions
export const listTemplates = async () => {
  try {
    const actor = await initializeMarketplaceActor();
    const templates = await actor.list_templates();
    return { success: true, templates };
  } catch (error) {
    console.error('Error listing templates:', error);
    return { success: false, error: error.message };
  }
};

export const createTemplate = async (name, description, category, language, code, author) => {
  try {
    const actor = await initializeMarketplaceActor();
    const templateId = await actor.create_template(name, description, category, language, code, author);
    return { success: true, templateId };
  } catch (error) {
    console.error('Error creating template:', error);
    return { success: false, error: error.message };
  }
};

export const rateTemplate = async (templateId, rating) => {
  try {
    const actor = await initializeMarketplaceActor();
    const success = await actor.rate_template(templateId, rating);
    return { success };
  } catch (error) {
    console.error('Error rating template:', error);
    return { success: false, error: error.message };
  }
};

// Mock functions for features not yet implemented
export const installTemplate = async (templateId) => {
  try {
    // This would typically create a new project from the template
    // For now, we'll return a mock project ID
    const projectId = `proj_${Date.now()}`;
    return { success: true, projectId };
  } catch (error) {
    console.error('Error installing template:', error);
    return { success: false, error: error.message };
  }
};

export const downloadTemplate = async (templateId) => {
  try {
    // This would typically increment download count and return template data
    // For now, we'll just return success
    return { success: true };
  } catch (error) {
    console.error('Error downloading template:', error);
    return { success: false, error: error.message };
  }
};

export const getTemplate = async (templateId) => {
  try {
    const actor = await initializeMarketplaceActor();
    const templates = await actor.list_templates();
    const template = templates.find(t => t.id === templateId);
    if (template) {
      return { success: true, template };
    } else {
      return { success: false, error: 'Template not found' };
    }
  } catch (error) {
    console.error('Error getting template:', error);
    return { success: false, error: error.message };
  }
};
