import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("dinebook_session");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("dinebook_session", JSON.stringify(userData));
    localStorage.setItem("dinebook_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dinebook_session");
    localStorage.removeItem("dinebook_token");
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("dinebook_session", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
