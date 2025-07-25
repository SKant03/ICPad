// src/pages/Dashboard.jsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { mockDeployedDApps } from '../utils/mockData'; // Import mock data

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="p-8 flex-grow">
      <h2 className={`text-3xl font-bold mb-6 ${textColor}`}>Your Deployed dApps</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDeployedDApps.map(dApp => (
          <Card key={dApp.id} className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">{dApp.name}</h3>
              <p className="text-sm opacity-80 mb-2">Status: <span className={dApp.status === 'Deployed' ? 'text-green-400 font-medium' : 'text-yellow-400 font-medium'}>{dApp.status}</span></p>
              <p className="text-sm opacity-70 mb-3">{dApp.description}</p>
              {dApp.url !== 'N/A' && (
                <p className="text-sm opacity-80 mb-2">URL: <a href={dApp.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{dApp.url}</a></p>
              )}
              <p className="text-xs opacity-60">Last Updated: {dApp.lastUpdated}</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button variant="secondary" className="text-sm">Manage</Button>
              {dApp.status === 'Deployed' && <Button variant="outline" className="text-sm">View Live</Button>}
            </div>
          </Card>
        ))}
      </div>
      <h2 className={`text-3xl font-bold mt-10 mb-6 ${textColor}`}>User Information</h2>
      <Card className="max-w-md">
        <p className="mb-2 text-lg"><span className="font-semibold">Wallet Address:</span> <span className="font-mono text-blue-400">0x123abc...def789</span></p>
        <p className="mb-2"><span className="font-semibold">Joined:</span> January 15, 2023</p>
        <p className="mb-2"><span className="font-semibold">Total dApps Deployed:</span> {mockDeployedDApps.length}</p>
        <p className="mb-2"><span className="font-semibold">Cycles Balance:</span> 1,234,567,890,123</p>
        <Button variant="secondary" className="mt-4">View Full Profile</Button>
      </Card>
    </div>
  );
};

export default Dashboard;
