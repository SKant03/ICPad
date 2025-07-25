// src/pages/SettingsPage.jsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="p-8 flex-grow">
      <h2 className={`text-3xl font-bold mb-6 ${textColor}`}>Settings</h2>

      <Card className="mb-6 max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-3">User Profile</h3>
        <p className="mb-2"><span className="font-semibold">Username:</span> icpad_dev</p>
        <p className="mb-2"><span className="font-semibold">Email:</span> dev@icpad.com</p>
        <p className="mb-2"><span className="font-semibold">Member Since:</span> January 2023</p>
        <Button variant="secondary" className="mt-4">Edit Profile</Button>
      </Card>

      <Card className="mb-6 max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-3">Theme Settings</h3>
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <label htmlFor="theme-toggle" className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="theme-toggle"
              className="sr-only peer"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </Card>

      <Card className="max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-3">Wallet Information</h3>
        <p className="mb-2"><span className="font-semibold">Connected Wallet:</span> Plug Wallet</p>
        <p className="mb-2"><span className="font-semibold">Principal ID:</span> <span className="font-mono text-blue-400">aaaaa-aa...cai</span></p>
        <p className="mb-2"><span className="font-semibold">Wallet Balance:</span> 10.5 ICP</p>
        <Button variant="secondary" className="mt-4">Disconnect Wallet</Button>
      </Card>
    </div>
  );
};

export default SettingsPage;
