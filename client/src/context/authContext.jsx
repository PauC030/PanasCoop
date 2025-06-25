import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { loginRequest,registerRequest,verifyTokenRequest,logoutRequest ,verifyEmailRequest,resendVerificationEmailRequest } from "../api/auth";
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
  const [successMessage, setSuccessMessage] = useState("");

  // Limpiar errores después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Limpiar mensajes de éxito después de 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
    localStorage.setItem("userName", userData.username || userData.name || "");
  };

  const signup = async (user) => {
    try {
      setLoading(true);
      const res = await registerRequest(user);
      
      // El registro NO autentica automáticamente
      setSuccessMessage(res.data.message || "Usuario registrado. Revisa tu correo para verificar la cuenta.");
      setErrors([]);
      
    } catch (error) {
      console.error("Error en signup:", error);
      setErrors(error.response?.data?.message || ["Error al registrar usuario"]);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const signin = async (user) => {
    try {
      setLoading(true);
      const res = await loginRequest(user);
      
      setUser(res.data);
      setIsAuthenticated(true);
      setupLocalStorage(res.data);
      setErrors([]);
      setSuccessMessage("");
      
    } catch (error) {
      console.error("Error en signin:", error);
      setErrors(error.response?.data?.message || ["Error al iniciar sesión"]);
      setSuccessMessage("");
      cleanupLocalStorage(user.email);
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar email
  const verifyEmail = async (token) => {
    try {
      console.log('Verificando email con token:', token);
      
      const res = await verifyEmailRequest(token);
      console.log('Respuesta de verificación:', res.data);
      
      if (res.data.success) {
        // Actualizar el estado del usuario después de la verificación exitosa
        setUser(res.data.user);
        setIsAuthenticated(true);
        setupLocalStorage(res.data.user);
        
        return {
          success: true,
          message: res.data.message,
          user: res.data.user
        };
      } else {
        return {
          success: false,
          message: res.data.message || 'Error al verificar email'
        };
      }
      
    } catch (error) {
      console.error('Error en verifyEmail:', error);
      
      let errorMessage = 'Error de conexión al verificar email';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  // NUEVA: Función para reenviar email de verificación
  const resendVerificationEmail = async (email) => {
    try {
      setLoading(true);
      const res = await resendVerificationEmailRequest(email);
      
      setSuccessMessage(res.data.message || "Email de verificación reenviado");
      setErrors([]);
      
      return {
        success: true,
        message: res.data.message
      };
      
    } catch (error) {
      console.error("Error al reenviar email:", error);
      const errorMessage = error.response?.data?.message || "Error al reenviar email";
      setErrors([errorMessage]);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
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
        console.log("Token verification response:", res);
        
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        setIsAuthenticated(true);
        setUser(res.data);
        setupLocalStorage(res.data);
        
      } catch (error) {
        console.error("Error verifying token:", error);
        cleanupLocalStorage(localStorage.getItem("userEmail"));
        setIsAuthenticated(false);
        Cookies.remove("token");
      } finally {
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
        verifyEmail,
        resendVerificationEmail, // NUEVA función
        isAuthenticated,
        errors,
        successMessage,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};