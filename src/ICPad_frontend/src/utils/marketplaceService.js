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
    const canisterId = 'uzt4z-lp777-77774-qaabq-cai';
    
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
    return await actor.list_templates();
  } catch (error) {
    console.error('Error listing templates:', error);
    throw error;
  }
};

export const createTemplate = async (templateData) => {
  try {
    const actor = await initializeMarketplaceActor();
    return await actor.create_template(
      templateData.name,
      templateData.description,
      templateData.category,
      templateData.language,
      templateData.code,
      templateData.author
    );
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

export const rateTemplate = async (templateId, rating) => {
  try {
    const actor = await initializeMarketplaceActor();
    return await actor.rate_template(templateId, rating);
  } catch (error) {
    console.error('Error rating template:', error);
    throw error;
  }
};

export const downloadTemplate = async (templateId) => {
  try {
    const actor = await initializeMarketplaceActor();
    return await actor.download_template(templateId);
  } catch (error) {
    console.error('Error downloading template:', error);
    throw error;
  }
};

export const installTemplate = async (templateId) => {
  try {
    const actor = await initializeMarketplaceActor();
    return await actor.download_template(templateId);
  } catch (error) {
    console.error('Error installing template:', error);
    throw error;
  }
};

export const searchTemplates = async (query, category, language, minRating, sortBy) => {
  try {
    const actor = await initializeMarketplaceActor();
    return await actor.search_templates(query, category, language, minRating, sortBy);
  } catch (error) {
    console.error('Error searching templates:', error);
    throw error;
  }
};

export const getTemplate = async (templateId) => {
  try {
    const actor = await initializeMarketplaceActor();
    return await actor.get_template(templateId);
  } catch (error) {
    console.error('Error getting template:', error);
    throw error;
  }
};

export const updateTemplate = async (templateId, updates) => {
  try {
    const actor = await initializeMarketplaceActor();
    return await actor.update_template(
      templateId,
      updates.name,
      updates.description,
      updates.category,
      updates.language,
      updates.code,
      updates.author
    );
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
};

export const deleteTemplate = async (templateId) => {
  try {
    const actor = await initializeMarketplaceActor();
    return await actor.delete_template(templateId);
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const actor = await initializeMarketplaceActor();
    return await actor.get_categories();
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

export const getLanguages = async () => {
  try {
    const actor = await initializeMarketplaceActor();
    return await actor.get_languages();
  } catch (error) {
    console.error('Error getting languages:', error);
    throw error;
  }
};

export const getTemplateStats = async () => {
  try {
    const actor = await initializeMarketplaceActor();
    return await actor.get_template_stats();
  } catch (error) {
    console.error('Error getting template stats:', error);
    throw error;
  }
};
