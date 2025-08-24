import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Simulate login/logout from localStorage or API
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("swasthamann-user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const login = (userData) => {
    localStorage.setItem("swasthamann-user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("swasthamann-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
