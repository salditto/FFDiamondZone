// src/context/SnackbarContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState(null);

  const showSnackbar = useCallback((message, type = "info", duration = 3000) => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), duration);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar && (
        <div style={{ ...styles.base, ...styles[snackbar.type] }}>
          {snackbar.message}
        </div>
      )}
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => useContext(SnackbarContext);

// 🎨 Acá adaptás los colores a tu branding
const styles = {
  base: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "8px",
    zIndex: 1000,
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    animation: "fadeInOut 3s ease",
    fontWeight: "500",
    maxWidth: "80%",
    textAlign: "center",
  },
  success: {
    backgroundColor: "#1ED760", 
  },
  error: {
    backgroundColor: "#D62828",
  }
};
