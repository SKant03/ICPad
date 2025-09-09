// src/components/Navbar.jsx
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { PrincipalContext } from "../contexts/PrincipalContext";
import { LayoutDashboard, Code, Store, Rocket } from "../utils/Icons.jsx";
import { User, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { principal, isAuthenticated, login, logout } = useContext(PrincipalContext);

  const [isOpen, setIsOpen] = useState(false);

  const bgColor = isDarkMode ? "bg-[#3A2E39]" : "bg-[#F4D8CD]";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "IDE", path: "/ide", icon: Code },
    { name: "Marketplace", path: "/marketplace", icon: Store },
    { name: "Deploy", path: "/deploy", icon: Rocket },
  ];

  const handleSignIn = async () => {
    await login();
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <nav className={`${bgColor} shadow-lg transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IC</span>
              </div>
              <span className={`font-bold text-xl ${textColor}`}>ICPad</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${textColor} hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Theme toggle and User menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`${textColor} hover:bg-white hover:bg-opacity-10 p-2 rounded-md transition-all duration-200`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${textColor} hover:bg-white hover:bg-opacity-10 p-2 rounded-md transition-all duration-200 flex items-center space-x-2`}
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block">
                  {isAuthenticated ? "Account" : "Sign In"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-medium">Connected</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {principal}
                        </div>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleSignIn}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${textColor} hover:bg-white hover:bg-opacity-10 p-2 rounded-md`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${textColor} hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center space-x-2`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
