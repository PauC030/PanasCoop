import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ButtonLink } from "./ui/ButtonLink";
import { useState, useRef, useEffect } from "react";

import { FaUserCircle, FaTasks } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

import panaLogo from "../assets/coop.png";

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#002326] text-white p-2 shadow-md h-16">
      <div className="w-full flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl p-2 font-bold">
          <Link
            to={isAuthenticated ? "/tasks" : "/"}
            className="hover:opacity-80 transition-opacity flex items-center"
          >
            <img
              src={panaLogo}
              alt="PanascOOP"
              className="h-[45px] w-auto -my-2"
            />
          </Link>
        </h1>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/tasks"
                className="text-white text-sm hover:text-gray-300 transition-colors underline underline-offset-4 decoration-[1px] decoration-gray-300"
              >
                Mis actividades
              </Link>
              <ButtonLink
                to="/add-task"
                className="bg-[#03683E] hover:bg-[#028a4b] transition-colors px-4 py-2 rounded-md font-medium text-sm"
              >
                Crear nueva Actividad
              </ButtonLink>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center gap-2 hover:bg-[#003d40] transition-colors px-4 py-2 rounded-md group"
                >
                  <span className="font-medium">Perfil</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#003d40] rounded-lg shadow-xl py-2 z-50 border border-gray-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-700 bg-[#002a2d]">
                      <p className="font-medium text-white">Bienvenido</p>
                      <p className="text-sm text-gray-300 truncate">
                        {user.username}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm hover:bg-red-900/30 transition-colors text-red-400 font-medium flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
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
                className="text-sm text-white hover:text-gray-300 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm text-white hover:text-gray-300 transition-colors"
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
