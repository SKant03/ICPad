// src/pages/DeployPage.jsx
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';

const DeployPage = () => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-zinc-700' : 'bg-white';
  const inputBorder = isDarkMode ? 'border-zinc-600' : 'border-gray-300';

  const [dAppName, setDAppName] = useState('');
  const [network, setNetwork] = useState('mainnet');
  const [config, setConfig] = useState('');
  const [deploymentMessage, setDeploymentMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setDeploymentMessage('Initiating deployment...');
    // Simulate API call
    setTimeout(() => {
      if (dAppName && network) {
        setDeploymentMessage(`dApp "${dAppName}" is being deployed to ${network} network. This is a mock action.`);
        setDAppName('');
        setNetwork('mainnet');
        setConfig('');
      } else {
        setDeploymentMessage('Please fill in all required fields.');
      }
    }, 1500);
  };

  return (
    <div className="p-8 flex-grow">
      <h2 className={`text-3xl font-bold mb-6 ${textColor}`}>Deploy Your dApp</h2>
      <Card className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="dAppName" className="block text-sm font-medium mb-1">dApp Name</label>
            <input
              type="text"
              id="dAppName"
              value={dAppName}
              onChange={(e) => setDAppName(e.target.value)}
              placeholder="e.g., My Awesome DApp"
              required
              className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div>
            <label htmlFor="network" className="block text-sm font-medium mb-1">Network</label>
            <select
              id="network"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="mainnet">Mainnet (Production)</option>
              <option value="testnet">Testnet (Staging)</option>
              <option value="local">Local (Development)</option>
            </select>
          </div>
          <div>
            <label htmlFor="config" className="block text-sm font-medium mb-1">Deployment Config (JSON)</label>
            <textarea
              id="config"
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              rows="6"
              placeholder={`{\n  "memory": "2GB",\n  "cycles": 1000000000000,\n  "env_vars": {"API_KEY": "your_key"}\n}`}
              className={`w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500`}
            ></textarea>
          </div>
          <Button type="submit" className="w-full">Initiate Deployment</Button>
        </form>
        {deploymentMessage && (
          <p className={`mt-4 p-3 rounded-md ${deploymentMessage.includes('Error') ? 'bg-red-800' : 'bg-blue-800'} text-white text-sm`}>
            {deploymentMessage}
          </p>
        )}
      </Card>
    </div>
  );
};

export default DeployPage;
