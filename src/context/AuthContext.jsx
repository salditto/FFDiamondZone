// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import SessionExpiredDialog from "../components/SessionExpiredDialog";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const isTokenExpired = () => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error decodificando token:", error);
      return true;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("userId");
    setIsAuthenticated(false);
    const path = location.pathname;
    if (path !== "/login" && path !== "/register") {
      setShowDialog(true);
    }
  };

  const handleDialogLogin = () => {
    setShowDialog(false);
    navigate("/login");
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const checkAuth = () => {
    const expired = isTokenExpired();
    console.log(isAuthenticated)
    setIsAuthenticated(!expired);
  };
  
  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const handleForceLogout = () => {
    logout();
  };

  window.addEventListener("forceLogout", handleForceLogout);
  return () => window.removeEventListener("forceLogout", handleForceLogout);
}, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, checkAuth }}>
      {children}
      <SessionExpiredDialog
        open={showDialog}
        onClose={handleDialogClose}
        onLogin={handleDialogLogin}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
