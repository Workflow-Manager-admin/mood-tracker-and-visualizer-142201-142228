import React, { createContext, useContext, useState, useEffect } from "react";

// PUBLIC_INTERFACE
export const AuthContext = createContext();

/**
 * Authentication provider, exposing user and auth functions.
 * 
 * Provides: user, login, logout (local storage for demo).
 */
// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage for logged in user on mount
    const userJson = localStorage.getItem("moodtracker_user");
    if (userJson) setUser(JSON.parse(userJson));
  }, []);

  // PUBLIC_INTERFACE
  function login({ email, password }) {
    // Simulate auth for demo (in production, call backend)
    // Accept any password if the email is not blank
    if (email?.trim()) {
      const newUser = { email, name: email.split("@")[0] };
      setUser(newUser);
      localStorage.setItem("moodtracker_user", JSON.stringify(newUser));
      return true;
    }
    return false;
  }

  // PUBLIC_INTERFACE
  function logout() {
    setUser(null);
    localStorage.removeItem("moodtracker_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
