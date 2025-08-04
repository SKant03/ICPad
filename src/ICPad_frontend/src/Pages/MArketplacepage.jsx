// src/pages/MarketplacePage.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Search, Filter } from '../utils/Icons.jsx';
import { listTemplates, installTemplate, rateTemplate, downloadTemplate } from '../utils/canisterService';

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

  // Load templates from canister
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const result = await listTemplates();
      if (result.success) {
        setTemplates(result.templates || []);
      } else {
        setError('Failed to load templates: ' + result.error);
      }
    } catch (error) {
      setError('Error loading templates: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallTemplate = async (templateId) => {
    try {
      const result = await installTemplate(templateId);
      if (result.success) {
        alert(`Template installed successfully! New project ID: ${result.projectId}`);
        // Refresh templates to update download count
        await loadTemplates();
      } else {
        alert('Failed to install template: ' + result.error);
      }
    } catch (error) {
      alert('Error installing template: ' + error.message);
    }
  };

  const handleRateTemplate = async (templateId, rating) => {
    try {
      const result = await rateTemplate(templateId, rating);
      if (result.success) {
        alert('Rating submitted successfully!');
        // Refresh templates to update rating
        await loadTemplates();
      } else {
        alert('Failed to submit rating: ' + result.error);
      }
    } catch (error) {
      alert('Error submitting rating: ' + error.message);
    }
  };

  const handleDownloadTemplate = async (templateId) => {
    try {
      const result = await downloadTemplate(templateId);
      if (result.success) {
        alert('Template downloaded successfully!');
        // Refresh templates to update download count
        await loadTemplates();
      } else {
        alert('Failed to download template: ' + result.error);
      }
    } catch (error) {
      alert('Error downloading template: ' + error.message);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || template.category === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 flex-grow">
      <h2 className={`text-3xl font-bold mb-6 ${textColor}`}>Canister & Template Marketplace</h2>
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
            <option value="All">All Types</option>
            <option value="Canister">Canisters</option>
            <option value="Template">Templates</option>
          </select>
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
        </div>
      </div>

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
                <div className="mt-4 flex space-x-2">
                  <Button 
                    variant="primary" 
                    className="text-sm"
                    onClick={() => handleInstallTemplate(template.id)}
                  >
                    Install Template
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="text-sm"
                    onClick={() => handleDownloadTemplate(template.id)}
                  >
                    Download
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
            <p className={`${textColor} opacity-70 text-center col-span-full py-10`}>
              No templates found matching your criteria. Try adjusting your search or filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
