// src/pages/MarketplacePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { PrincipalContext } from '../contexts/PrincipalContext';
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
  const { principal } = useContext(PrincipalContext);
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
    author: principal || 'Anonymous'
  });

  // Rating popup states (added)
  const [ratingPopupTemplate, setRatingPopupTemplate] = useState(null); // template being rated
  const [selectedRating, setSelectedRating] = useState(0); // user-selected rating

  // Update author when principal changes
  useEffect(() => {
    if (principal) {
      setNewTemplate(prev => ({
        ...prev,
        author: principal
      }));
    }
  }, [principal]);

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
      setTemplates(result || []);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError(`Failed to load templates: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.description || !newTemplate.code) {
      alert('Please fill in all required fields');
      return;
    }

    if (!principal) {
      alert('Please sign in to create templates');
      return;
    }

    setCreating(true);
    try {
      const result = await createTemplate(newTemplate);
      console.log('Template created:', result);
      setShowCreateForm(false);
      setNewTemplate({
        name: '',
        description: '',
        category: 'Smart Contract',
        language: 'Rust',
        code: '',
        author: principal || 'Anonymous'
      });
      await loadTemplates(); // Reload templates
    } catch (err) {
      console.error('Error creating template:', err);
      alert(`Failed to create template: ${err.message || err}`);
    } finally {
      setCreating(false);
    }
  };

  const handleUseTemplate = async (templateId) => {
    try {
      await installTemplate(templateId);
      alert('Template installed successfully!');
    } catch (err) {
      console.error('Error using template:', err);
      alert(`Failed to use template: ${err.message || err}`);
    }
  };

  const handleRateTemplate = async (templateId, rating) => {
    try {
      await rateTemplate(templateId, rating);
      await loadTemplates(); // Reload to get updated ratings
    } catch (err) {
      console.error('Error rating template:', err);
      alert(`Failed to rate template: ${err.message || err}`);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.author || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || template.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', ...new Set(templates.map(t => t.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className={`text-lg ${textColor}`}>Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${textColor}`}>
            Canister & Template Marketplace
          </h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
            disabled={!principal}
          >
            <Plus className="w-5 h-5" />
            <span>{principal ? 'Create Template' : 'Sign In to Create'}</span>
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={loadTemplates}
              className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search canisters, templates, and creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${inputBg} ${inputBorder} border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${textColor}`}
            />
          </div>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-4 py-3 ${inputBg} ${inputBorder} border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${textColor} appearance-none pr-8`}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className={`text-xl font-semibold ${textColor} mb-2`}>
                    {template.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                    {template.description}
                  </p>
                  
                  {/* Creator Information */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-purple-600' : 'bg-purple-100'} flex items-center justify-center`}>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-purple-700'}`}>
                        {template.author ? template.author.charAt(0).toUpperCase() : "?"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${textColor}`}>Created by</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-mono break-all`}>{template.author}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                    {template.category}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                    {template.language}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className={`text-sm ${textColor}`}>{template.rating}</span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({template.downloads} downloads)
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleUseTemplate(template.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Use Template</span>
                  </Button>
                  <Button
                    onClick={() => {
                      setRatingPopupTemplate(template);
                      setSelectedRating(0);
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded-lg"
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className={`text-lg ${textColor} mb-4`}>No templates found</p>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchTerm || filterType !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to create a template!'
              }
            </p>
          </div>
        )}

        {/* Create Template Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <h2 className={`text-2xl font-bold ${textColor} mb-6`}>Create New Template</h2>
              
              {!principal && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                  Please sign in to create templates. Your principal ID will be used as the creator.
                </div>
              )}
              
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    className={`w-full px-3 py-2 ${inputBg} ${inputBorder} border rounded-lg focus:ring-2 focus:ring-purple-500 ${textColor}`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font medium ${textColor} mb-2`}>
                    Description *
                  </label>
                  <textarea
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    rows={3}
                    className={`w-full px-3 py-2 ${inputBg} ${inputBorder} border rounded-lg focus:ring-2 focus:ring-purple-500 ${textColor}`}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-2`}>
                      Category
                    </label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                      className={`w-full px-3 py-2 ${inputBg} ${inputBorder} border rounded-lg focus:ring-2 focus:ring-purple-500 ${textColor}`}
                    >
                      <option value="Smart Contract">Smart Contract</option>
                      <option value="NFT">NFT</option>
                      <option value="DeFi">DeFi</option>
                      <option value="Game">Game</option>
                      <option value="Utility">Utility</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-2`}>
                      Language
                    </label>
                    <select
                      value={newTemplate.language}
                      onChange={(e) => setNewTemplate({...newTemplate, language: e.target.value})}
                      className={`w-full px-3 py-2 ${inputBg} ${inputBorder} border rounded-lg focus:ring-2 focus:ring-purple-500 ${textColor}`}
                    >
                      <option value="Rust">Rust</option>
                      <option value="Motoko">Motoko</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="TypeScript">TypeScript</option>
                    </select>
                  </div>
                </div>

                {/* Creator Information - Read Only */}
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Creator
                  </label>
                  <div className={`w-full px-3 py-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border border-gray-300 rounded-lg ${textColor} font-mono text-sm break-all`}>
                    {principal || 'Not signed in'}
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    Your principal ID will be used as the creator
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Code *
                  </label>
                  <textarea
                    value={newTemplate.code}
                    onChange={(e) => setNewTemplate({...newTemplate, code: e.target.value})}
                    rows={10}
                    className={`w-full px-3 py-2 ${inputBg} ${inputBorder} border rounded-lg focus:ring-2 focus:ring-purple-500 ${textColor} font-mono text-sm`}
                    placeholder="Paste your canister code here..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating || !principal}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create Template'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rating Popup */}
        {ratingPopupTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-80`}>
              <h2 className={`text-lg font-bold ${textColor} mb-4`}>Rate "{ratingPopupTemplate.name}"</h2>
              <div className="flex justify-center space-x-2 mb-4">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      star <= selectedRating ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}
                    type="button"
                  >
                    <Star className="w-5 h-5" />
                  </button>
                ))}
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => setRatingPopupTemplate(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (selectedRating > 0) {
                      await handleRateTemplate(ratingPopupTemplate.id, selectedRating);
                      setRatingPopupTemplate(null);
                    } else {
                      alert('Please select a rating (1-5)');
                    }
                  }}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MarketplacePage;
