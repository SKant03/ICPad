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

  const textColor = isDarkMode ? "text-white" : "text-gray-900";

  // Fetch user info from canister
  useEffect(() => {
    if (!principal) return;

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

  // Register new user
  const handleRegister = async () => {
    if (!principal) return;
    try {
      setLoading(true);
      const ok = await ICPad_user.register_user(
        Principal.fromText(principal),
        "new_user",   // default username
        null          // bio must be null (Option<String>)
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
    <div className="p-8 flex-grow">
      <h2 className={`text-3xl font-bold mb-6 ${textColor}`}>Settings</h2>

      {/* User Profile */}
      <Card className="mb-6 max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-3">User Profile</h3>
        {!principal ? (
          <p className="text-gray-500">⚠️ Please sign in to view your profile.</p>
        ) : loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : !user ? (
          <>
            <p className="mb-2 text-gray-500">No profile found.</p>
            <Button onClick={handleRegister}>Register User</Button>
          </>
        ) : (
          <>
            <p className="mb-2">
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Bio:</span> {user.bio || "—"}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Principal:</span>{" "}
              <span className="font-mono">{user.id}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Joined:</span>{" "}
              {new Date(Number(user.joined_at) / 1_000_000).toLocaleString()}
            </p>
            <Button variant="secondary" className="mt-4">
              Edit Profile
            </Button>
          </>
        )}
      </Card>

      {/* Theme Settings */}
      <Card className="mb-6 max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-3">Theme Settings</h3>
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
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
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
              dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700
              peer-checked:after:translate-x-full peer-checked:after:border-white
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
              after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
              after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
