import React, { createContext, useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client"; // ✅ import auth-client

export const PrincipalContext = createContext();

export const PrincipalProvider = ({ children }) => {
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    const fetchPrincipal = async () => {
      try {
        const client = await AuthClient.create();
        if (await client.isAuthenticated()) {
          setPrincipal(client.getIdentity().getPrincipal().toText()); // ✅ ensure string
        }
      } catch (err) {
        console.error("Failed to fetch principal:", err);
      }
    };
    fetchPrincipal();
  }, []);

  return (
    <PrincipalContext.Provider
      value={{
        principal,
        setPrincipal,
      }}
    >
      {children}
    </PrincipalContext.Provider>
  );
};
