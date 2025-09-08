import React, { createContext, useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";

export const PrincipalContext = createContext();

export const PrincipalProvider = ({ children }) => {
  const [principal, setPrincipal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const client = await AuthClient.create();
      const authenticated = await client.isAuthenticated();
      
      if (authenticated) {
        const principalText = client.getIdentity().getPrincipal().toText();
        setPrincipal(principalText);
        setIsAuthenticated(true);
        console.log('User authenticated:', principalText);
      } else {
        setPrincipal(null);
        setIsAuthenticated(false);
        console.log('User not authenticated');
      }
    } catch (err) {
      console.error("Failed to check authentication:", err);
      setPrincipal(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      const client = await AuthClient.create();
      await client.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: () => {
          checkAuth();
        },
      });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logout = async () => {
    try {
      const client = await AuthClient.create();
      await client.logout();
      setPrincipal(null);
      setIsAuthenticated(false);
      console.log('User logged out');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Check authentication status periodically
    const interval = setInterval(checkAuth, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <PrincipalContext.Provider
      value={{
        principal,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </PrincipalContext.Provider>
  );
};
