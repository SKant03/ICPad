// src/components/Sidebar.jsx
import React from 'react'; // Removed useState as it's no longer toggleable
// Removed Link and useLocation as navigation is disabled in this preview
import { useTheme } from '../contexts/ThemeContext';
import { LayoutDashboard, Code, Store, Rocket, Settings } from '../utils/Icons.jsx'; // Removed Menu, X as toggle button is gone

const Sidebar = () => { // Removed isSidebarOpen, toggleSidebar props
  const { isDarkMode } = useTheme();
  // Changed bgColor to bg-zinc-700 for a lighter sidebar
  const bgColor = isDarkMode ? 'bg-zinc-700' : 'bg-gray-100';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'IDE', icon: Code },
    { name: 'Marketplace', icon: Store },
    { name: 'Deploy', icon: Rocket },
    { name: 'Settings', icon: Settings },
  ];

  return (
    // Sidebar is now permanently open (w-64) and no toggle button
    <div className={`${bgColor} ${textColor} w-64 h-screen flex flex-col transition-all duration-300 ease-in-out shadow-lg relative z-0 border-r border-zinc-700`}>
      {/* Removed the toggle button completely */}
      <div className="p-4 mt-8 flex flex-col gap-2">
        {navItems.map((item) => (
          <div // Changed Link to div as navigation is disabled in this preview
            key={item.name}
            className={`flex items-center rounded-md p-2 transition-colors duration-200 hover:bg-zinc-600 cursor-pointer`}
          >
            <item.icon className="w-6 h-6 mr-3" />
            <span className="whitespace-nowrap">{item.name}</span> {/* Always show text */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
