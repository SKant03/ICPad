// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for the button
import { useTheme } from '../contexts/ThemeContext';

// Import components used by LandingPage itself
import LandingPageTopBar from '../components/LandingPageTopBar';
import LandingPageContent from '../components/LandingPageContent';

const LandingPage = () => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className={`flex flex-col min-h-screen font-sans ${isDarkMode ? 'dark' : ''}`}>
      {/* Navbar is now handled by App.jsx, not here */}

      {/* Main content area for the Landing Page */}
      <main className={`${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} ${textColor} flex-1 overflow-y-auto transition-all duration-300 ease-in-out flex flex-col items-center justify-center`}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10 pointer-events-none"></div>

        {/* Render the top bar section */}
        <LandingPageTopBar />

        {/* Render the main content section */}
        <LandingPageContent />
      </main>
    </div>
  );
};

export default LandingPage;
