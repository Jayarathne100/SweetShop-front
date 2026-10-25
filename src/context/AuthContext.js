import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved authentication
  useEffect(() => {
    const savedUser = localStorage.getItem("sweetspotUser");
    const savedToken = localStorage.getItem("sweetspotToken");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    const data = await loginUser(email, password);

    localStorage.setItem(
      "sweetspotUser",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "sweetspotToken",
      data.token
    );

    setUser(data.user);
    setToken(data.token);

    return data;
  };

  // Register
  const register = async (userData) => {
    const data = await registerUser(userData);

    localStorage.setItem(
      "sweetspotUser",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "sweetspotToken",
      data.token
    );

    setUser(data.user);
    setToken(data.token);

    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("sweetspotUser");
    localStorage.removeItem("sweetspotToken");

    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user && !!token;

  const isAdmin =
    user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};