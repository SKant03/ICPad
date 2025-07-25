// src/components/Card.jsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Card = ({ children, className = '' }) => {
  const { isDarkMode } = useTheme();
  const bgColor = isDarkMode ? 'bg-zinc-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className={`${bgColor} ${textColor} rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
