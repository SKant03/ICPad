// src/pages/SettingsPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { PrincipalContext } from "../contexts/PrincipalContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { ICPad_user } from "../../../../token_backend/ICPad_user_importer";
import { Principal } from "@dfinity/principal";

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { principal } = useContext(PrincipalContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const textColor = isDarkMode ? "text-gray-200" : "text-gray-800";

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
    document.body.removeChild(textArea);
  };

  // Fetch user info
  useEffect(() => {
    if (!principal) {
      setUser(null);
      return;
    }
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await ICPad_user.get_user(Principal.fromText(principal));
        setUser(userData ?? null);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [principal]);

  // Register user
  const handleRegister = async () => {
    if (!principal) return;
    try {
      setLoading(true);
      const ok = await ICPad_user.register_user(
        Principal.fromText(principal),
        "new_user",
        null
      );
      if (ok) {
        const newUser = await ICPad_user.get_user(Principal.fromText(principal));
        setUser(newUser);
      }
    } catch (err) {
      console.error("Error registering user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 sm:p-8 flex-grow ${textColor}`}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Manage your profile and application preferences.
        </p>
      </header>

      <div className="space-y-8">
        {/* User Profile */}
        <Card>
          <h3 className="text-2xl font-semibold mb-5 border-b border-gray-200 dark:border-gray-700 pb-3">
            User Profile
          </h3>

          {!principal ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              ⚠️ Please sign in to view your profile.
            </div>
          ) : loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          ) : !user ? (
            <div className="text-center py-8">
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                No Profile Found
              </h3>
              <p className="mt-1 mb-4 text-gray-500 dark:text-gray-400">
                Create a profile to get started.
              </p>
              <Button onClick={handleRegister} disabled={loading}>
                {loading ? "Registering..." : "Register User"}
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user.username}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Joined{" "}
                    {new Date(Number(user.joined_at) / 1_000_000).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="font-semibold w-32 shrink-0 text-gray-600 dark:text-gray-300">
                    Bio
                  </span>
                  <p className="text-gray-800 dark:text-gray-200">
                    {user.bio || "No bio provided."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="font-semibold w-32 shrink-0 text-gray-600 dark:text-gray-300">
                    Principal ID
                  </span>
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-lg">
                    <span className="font-mono text-sm break-all text-gray-600 dark:text-gray-400">
                      {user.id.toString()}
                    </span>
                    <button
                      onClick={() => copyToClipboard(user.id.toString())}
                      className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition"
                    >
                      {copied ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
                <Button variant="secondary">Edit Profile</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Theme Settings */}
        <Card>
          <h3 className="text-2xl font-semibold mb-3">Appearance</h3>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                Dark Mode
              </span>
            </div>
            <label
              htmlFor="theme-toggle"
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id="theme-toggle"
                className="sr-only peer"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <div
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                  peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700
                  peer-checked:after:translate-x-full peer-checked:after:border-white
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                  after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                  after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
