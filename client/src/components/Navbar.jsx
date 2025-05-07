import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ButtonLink } from "./ui/ButtonLink";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#002326] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link 
            to={isAuthenticated ? "/tasks" : "/"} 
            className="hover:text-gray-300 transition-colors"
          >
            PanascOOP
          </Link>
        </h1>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Botón "Crear nueva Actividad" siempre visible */}
              <ButtonLink 
                to="/add-task" 
                className="bg-[#03683E] hover:bg-[#028a4b] transition-colors px-4 py-2 rounded-md font-medium"
              >
                Crear nueva Actividad
              </ButtonLink>

              {/* Menú desplegable del perfil - Versión mejorada */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={toggleProfile}
                  className="flex items-center gap-2 hover:bg-[#003d40] transition-colors px-4 py-2 rounded-md group"
                >
                  <span className="font-medium">Perfil</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#003d40] rounded-lg shadow-xl py-2 z-50 border border-gray-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-700 bg-[#002a2d]">
                      <p className="font-medium text-white">Bienvenido</p>
                      <p className="text-sm text-gray-300 truncate">{user.username}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm hover:bg-red-900/30 transition-colors text-red-400 font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-md hover:bg-[#003d40] transition-colors font-medium"
              >
                Iniciar sesión
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 rounded-md bg-[#03683E] hover:bg-[#028a4b] transition-colors font-medium"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}