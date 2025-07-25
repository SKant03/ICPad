// src/pages/MarketplacePage.jsx
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Search, Filter } from '../utils/Icons.jsx';
import { mockCanisters } from '../utils/mockData';

const MarketplacePage = () => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-zinc-700' : 'bg-white';
  const inputBorder = isDarkMode ? 'border-zinc-600' : 'border-gray-300';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredCanisters = mockCanisters.filter(canister => {
    const matchesSearch = canister.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          canister.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || canister.type === filterType;
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCanisters.length > 0 ? (
          filteredCanisters.map(canister => (
            <Card key={canister.id} className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{canister.name}</h3>
                <p className="text-sm opacity-80 mb-2">Type: <span className="font-medium text-blue-400">{canister.type}</span></p>
                <p className="text-sm opacity-70 mb-3">{canister.description}</p>
                <p className="text-xs opacity-60">Author: {canister.author} | Downloads: {canister.downloads} | Rating: {canister.rating} ★</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="primary" className="text-sm">Use Template</Button>
                <Button variant="secondary" className="text-sm">View Details</Button>
              </div>
            </Card>
          ))
        ) : (
          <p className={`${textColor} opacity-70 text-center col-span-full py-10`}>No canisters found matching your criteria. Try adjusting your search or filters.</p>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
