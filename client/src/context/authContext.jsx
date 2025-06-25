import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest, verifyTokenRequest,logoutRequest } from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Limpiar errores después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const cleanupLocalStorage = (email) => {
    if (email) {
      localStorage.removeItem(`userAttendances_${email}`);
    }
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
  };

  const setupLocalStorage = (userData) => {
    const normalizedEmail = userData.email.trim().toLowerCase();
    localStorage.setItem("userEmail", normalizedEmail);
    localStorage.setItem("userName", userData.name || "");
  };

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      if (res.status === 200) {
        setUser(res.data);
        setIsAuthenticated(true);
        setupLocalStorage(res.data);
      }
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      setupLocalStorage(res.data);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
      // Limpiar localStorage en caso de error
      cleanupLocalStorage(user.email);
    }
  };

const logout = async () => {
  const email = localStorage.getItem("userEmail");
  cleanupLocalStorage(email);

  try {
    await logoutRequest(); 
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
  }

  setUser(null);
  setIsAuthenticated(false);
};


  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);
        if (!res.data) {
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(true);
        setUser(res.data);
        // Sincronizar localStorage al verificar token
        setupLocalStorage(res.data);
        setLoading(false);
      } catch (error) {
        cleanupLocalStorage(localStorage.getItem("userEmail"));
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        signin,
        logout,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;