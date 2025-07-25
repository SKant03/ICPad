import React, { useState } from 'react';
// Removed 'HashRouter as Router' from import.
// We only need Routes and Route, as the Router is provided externally.
import { Routes, Route } from 'react-router-dom';

// Import Contexts
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Import Components
import Navbar from './components/Navbar'; // Navbar is rendered globally by App.jsx

// Import ALL Pages
import LandingPage from './Pages/Landingpage';
import Dashboard from './Pages/Dashboard';
import IDEPage from './Pages/IDEpage';
import MarketplacePage from './Pages/MArketplacepage';
import DeployPage from './Pages/Deploypage';
import SettingsPage from './Pages/Settingpage';

// Main App Component
const App = () => {
  const { isDarkMode } = useTheme();

  const mainContentBg = isDarkMode ? 'bg-slate-900' : 'bg-gray-50';

  return (
    // Removed <Router> and </Router> tags here.
    // The external environment provides the Router.
    <div className={`flex flex-col min-h-screen font-sans ${isDarkMode ? 'dark' : ''}`}>
      {/* Navbar is always at the top, wrapping all content */}
      <Navbar />

      {/* Main content area now takes full width as sidebar is removed */}
      <main className={`flex-1 ${mainContentBg} overflow-y-auto transition-all duration-300 ease-in-out`}>
        <Routes>
          {/* All application routes are defined here */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ide" element={<IDEPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/deploy" element={<DeployPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

// Root component wrapped with ThemeProvider to provide theme context to all children
export default function ICPadApp() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
