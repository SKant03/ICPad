// src/components/Navbar.jsx
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { PrincipalContext } from "../contexts/PrincipalContext"; // ✅ import your context
import { LayoutDashboard, Code, Store, Rocket } from "../utils/Icons.jsx";
import { User, Sun, Moon } from "lucide-react"; // ✅ added Sun/Moon
import { AuthClient } from "@dfinity/auth-client";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { principal, setPrincipal } = useContext(PrincipalContext); // ✅ use global principal

  const [isAuthenticated, setIsAuthenticated] = useState(!!principal);
  const [isOpen, setIsOpen] = useState(false);

  const bgColor = isDarkMode ? "bg-[#3A2E39]" : "bg-[#F4D8CD]";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "IDE", path: "/ide", icon: Code },
    { name: "Marketplace", path: "/marketplace", icon: Store },
    { name: "Deploy", path: "/deploy", icon: Rocket },
  ];

  // 🔑 Sign-in
  const signIn = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943",
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principalText = identity.getPrincipal().toText();
          setPrincipal(principalText); // ✅ save globally
          setIsAuthenticated(true);
          setIsOpen(false);
        },
      });
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  // 🚪 Sign-out
  const signOut = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.logout();
      setPrincipal(null); // ✅ clear globally
      setIsAuthenticated(false);
      setIsOpen(false);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <nav className={`${bgColor} ${textColor} p-4 shadow-sm z-10 relative`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          ICPad
        </Link>

        {/* Nav Items */}
        <div className="space-x-4 flex items-center relative">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center hover:text-[#64A6BD] transition-colors duration-200"
            >
              <item.icon className="w-5 h-5 mr-1" />
              <span className="hidden sm:inline">{item.name}</span>
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center hover:text-[#64A6BD]"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center hover:text-[#64A6BD]"
            >
              <User className="w-6 h-6" />
            </button>

            {isOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg py-2 ${
                  isDarkMode ? "bg-[#3A2E39]" : "bg-white"
                }`}
              >
                {!isAuthenticated ? (
                  <button
                    onClick={signIn}
                    className="block w-full text-left px-4 py-2 hover:bg-[#64A6BD] hover:text-white"
                  >
                    Sign In
                  </button>
                ) : (
                  <>
                    <div className="px-4 py-2 text-sm">
                      <p className="font-semibold">IC User</p>
                      <p className="text-xs truncate">{principal}</p>
                    </div>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 hover:bg-[#64A6BD] hover:text-white"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={signOut}
                      className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
