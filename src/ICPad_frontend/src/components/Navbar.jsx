// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation
import { useTheme } from '../contexts/ThemeContext';
// Import all necessary icons
import { LayoutDashboard, Code, Store, Rocket, Settings } from '../utils/Icons.jsx';

const Navbar = () => {
  const { isDarkMode } = useTheme();
  const bgColor = isDarkMode ? 'bg-zinc-700' : 'bg-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'IDE', path: '/ide', icon: Code },
    { name: 'Marketplace', path: '/marketplace', icon: Store },
    { name: 'Deploy', path: '/deploy', icon: Rocket },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className={`${bgColor} ${textColor} p-4 shadow-sm z-10 relative`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Link for the logo */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="mr-2">ICPad</span>
        </Link>
        <div className="space-x-4 flex items-center">
          {navItems.map((item) => (
            <Link // Use Link for actual navigation
              key={item.name}
              to={item.path}
              className="flex items-center hover:text-blue-400 transition-colors duration-200"
            >
              <item.icon className="w-5 h-5 mr-1" />
              <span className="hidden sm:inline">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
