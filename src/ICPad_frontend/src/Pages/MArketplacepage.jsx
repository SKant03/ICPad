// src/pages/MarketplacePage.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Search, Filter, Plus, Star, Download } from '../utils/Icons.jsx';
import { 
  listTemplates, 
  createTemplate, 
  installTemplate, 
  rateTemplate, 
  downloadTemplate 
} from '../utils/marketplaceService';

const MarketplacePage = () => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-zinc-700' : 'bg-white';
  const inputBorder = isDarkMode ? 'border-zinc-600' : 'border-gray-300';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'Smart Contract',
    language: 'Rust',
    code: '',
    author: 'Anonymous'
  });

  // Load templates from canister
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading templates...');
      const result = await listTemplates();
      console.log('Templates result:', result);
      if (result.success) {
        setTemplates(result.templates || []);
        console.log(`Loaded ${result.templates?.length || 0} templates`);
      } else {
        setError('Failed to load templates: ' + result.error);
        console.error('Failed to load templates:', result.error);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setError('Error loading templates: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    
    try {
      console.log('Creating template:', newTemplate);
      const result = await createTemplate(
        newTemplate.name,
        newTemplate.description,
        newTemplate.category,
        newTemplate.language,
        newTemplate.code,
        newTemplate.author
      );
      
      console.log('Create template result:', result);
      
      if (result.success) {
        console.log('Template created successfully with ID:', result.templateId);
        alert(`Template created successfully! ID: ${result.templateId}`);
        
        // Reset form
        setNewTemplate({
          name: '',
          description: '',
          category: 'Smart Contract',
          language: 'Rust',
          code: '',
          author: 'Anonymous'
        });
        
        // Close form
        setShowCreateForm(false);
        
        // Reload templates
        await loadTemplates();
      } else {
        const errorMsg = 'Failed to create template: ' + result.error;
        console.error(errorMsg);
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'Error creating template: ' + error.message;
      console.error(errorMsg, error);
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  const handleUseTemplate = async (templateId, templateName) => {
    try {
      console.log('Using template:', templateId);
      
      // First, download the template (increment download count)
      const downloadResult = await downloadTemplate(templateId);
      if (!downloadResult.success) {
        console.warn('Failed to update download count:', downloadResult.error);
      }
      
      // Then, install it as a new project
      const installResult = await installTemplate(templateId);
      if (installResult.success) {
        alert(`Template "${templateName}" installed successfully! New project ID: ${installResult.projectId}`);
        await loadTemplates(); // Refresh to update download count
      } else {
        alert('Failed to install template: ' + installResult.error);
      }
    } catch (error) {
      console.error('Error using template:', error);
      alert('Error using template: ' + error.message);
    }
  };

  const handleRateTemplate = async (templateId, rating) => {
    try {
      console.log('Rating template:', templateId, 'with rating:', rating);
      const result = await rateTemplate(templateId, rating);
      if (result.success) {
        alert('Rating submitted successfully!');
        await loadTemplates();
      } else {
        alert('Failed to submit rating: ' + result.error);
      }
    } catch (error) {
      console.error('Error rating template:', error);
      alert('Error submitting rating: ' + error.message);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || template.category === filterType;
    return matchesSearch && matchesType;
  });

  const categories = ['All', 'Smart Contract', 'Frontend', 'Backend', 'Utility', 'Game', 'NFT'];

  return (
    <div className="p-8 flex-grow">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${textColor}`}>Canister & Template Marketplace</h2>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2"
          disabled={creating}
        >
          <Plus className="w-4 h-4" />
          {showCreateForm ? 'Cancel' : 'Create Template'}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Create Template Form */}
      {showCreateForm && (
        <Card className="mb-6 p-6">
          <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>Create New Template</h3>
          <form onSubmit={handleCreateTemplate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>Template Name</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor}`}
                  required
                  disabled={creating}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>Author</label>
                <input
                  type="text"
                  value={newTemplate.author}
                  onChange={(e) => setNewTemplate({...newTemplate, author: e.target.value})}
                  className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor}`}
                  required
                  disabled={creating}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Description</label>
              <textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor}`}
                rows="3"
                required
                disabled={creating}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                  className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor}`}
                  disabled={creating}
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>Language</label>
                <select
                  value={newTemplate.language}
                  onChange={(e) => setNewTemplate({...newTemplate, language: e.target.value})}
                  className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor}`}
                  disabled={creating}
                >
                  <option value="Rust">Rust</option>
                  <option value="Motoko">Motoko</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                </select>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Code</label>
              <textarea
                value={newTemplate.code}
                onChange={(e) => setNewTemplate({...newTemplate, code: e.target.value})}
                className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} font-mono`}
                rows="8"
                placeholder="Paste your template code here..."
                required
                disabled={creating}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                variant="primary"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Template'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setShowCreateForm(false);
                  setError(null);
                }}
                disabled={creating}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search canisters and templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-3 pl-10 rounded-md border ${inputBorder} ${inputBg} ${textColor} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`appearance-none w-full p-3 pl-10 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className={`${textColor} text-center py-10`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading templates...
        </div>
      ) : error ? (
        <div className={`${textColor} text-center py-10`}>
          <p className="text-red-400 mb-4">{error}</p>
          <Button variant="primary" onClick={loadTemplates}>Retry</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map(template => (
              <Card key={template.id} className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm opacity-80 mb-2">
                    Category: <span className="font-medium text-blue-400">{template.category}</span> | 
                    Language: <span className="font-medium text-green-400">{template.language}</span>
                  </p>
                  <p className="text-sm opacity-70 mb-3">{template.description}</p>
                  <p className="text-xs opacity-60">
                    Author: {template.author} | Downloads: {template.downloads} | Rating: {template.rating.toFixed(1)} ★
                  </p>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button 
                    variant="primary" 
                    className="flex items-center gap-2 w-full justify-center"
                    onClick={() => handleUseTemplate(template.id, template.name)}
                  >
                    <Download className="w-4 h-4" />
                    Use Template
                  </Button>
                </div>
                <div className="mt-2 flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleRateTemplate(template.id, star)}
                      className="text-yellow-400 hover:text-yellow-300 text-sm"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <div className={`${textColor} opacity-70 text-center col-span-full py-10`}>
              <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No templates found</p>
              <p className="mb-4">Try adjusting your search or create the first template!</p>
              <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                Create First Template
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
