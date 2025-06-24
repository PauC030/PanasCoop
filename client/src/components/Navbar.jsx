// Navbar.js - CORREGIDO
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useNotifications } from "../context/NotificationsContext";
import { ButtonLink } from "./ui/ButtonLink";
import { useState, useRef, useEffect } from "react";

import panaLogo from "../assets/coop.png";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { 
    realtimeNotifications, 
    markAsRead, 
    clearNotification,
    clearAllNotifications,
    hasNewNotifications 
  } = useNotifications();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [bellAnimation, setBellAnimation] = useState(false);
  
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    // Marcar como leídas cuando se abre el panel
    if (!isNotificationOpen && realtimeNotifications.length > 0) {
      realtimeNotifications
        .filter(n => !n.read)
        .forEach(n => markAsRead(n.id));
    }
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setIsNotificationOpen(false);
    }
  };

  // Efecto para animar la campana cuando llegan nuevas notificaciones
  useEffect(() => {
    if (hasNewNotifications) {
      setBellAnimation(true);
      const timer = setTimeout(() => setBellAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasNewNotifications]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = realtimeNotifications ? realtimeNotifications.filter(n => !n.read).length : 0;

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

        {/* Right side options */}
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

              {/* Campana de notificaciones */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotifications}
                  className={`relative p-2 hover:bg-[#003d40] rounded-full transition-all duration-300 ${
                    bellAnimation ? 'animate-bounce' : ''
                  } ${hasNewNotifications ? 'bg-[#03683E]' : ''}`}
                >
                  {/* Icono de campana */}
                  <svg
                    className={`w-5 h-5 transition-all duration-300 ${
                      bellAnimation ? 'animate-pulse' : ''
                    } ${hasNewNotifications ? 'text-yellow-300' : 'text-white'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>

                  {/* Contador de notificaciones */}
                  {unreadCount > 0 && (
                    <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium transition-all duration-300 ${
                      bellAnimation ? 'animate-pulse scale-110' : ''
                    }`}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}

                  {/* Efecto de pulso para nuevas notificaciones */}
                  {hasNewNotifications && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full animate-ping"></span>
                  )}
                </button>

                {/* Panel de notificaciones */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#003d40] rounded-lg shadow-xl border border-gray-700 z-50 max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-gray-700 bg-[#002a2d]">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-white">Notificaciones</h3>
                        {realtimeNotifications && realtimeNotifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            Limpiar todo
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {!realtimeNotifications || realtimeNotifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          <svg
                            className="w-12 h-12 mx-auto mb-3 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                          </svg>
                          <p className="text-sm">No hay notificaciones</p>
                        </div>
                      ) : (
                        realtimeNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-700 hover:bg-[#002a2d] transition-colors cursor-pointer ${
                              !notification.read ? 'bg-[#03683E]/20' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 mr-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm text-white line-clamp-1">
                                    {notification.title || 'Notificación'}
                                  </h4>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-[#03683E] rounded-full"></span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-300 mb-2 line-clamp-2">
                                  {notification.message || 'Sin mensaje'}
                                </p>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-400">
                                    {notification.timestamp ? new Date(notification.timestamp).toLocaleTimeString('es-ES', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      day: '2-digit',
                                      month: '2-digit'
                                    }) : 'Ahora'}
                                  </span>
                                  {notification.taskId && (
                                    <Link
                                      to={`/tasks/${notification.taskId}`}
                                      className="text-xs text-[#03683E] hover:text-[#028a4b] font-medium"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Ver actividad
                                    </Link>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(notification.id);
                                }}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Menú del perfil */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 bg-[#03683E] hover:bg-[#028a4b] transition-colors px-3 py-2 rounded-md"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#03683E] font-semibold text-sm">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{user?.username || 'Usuario'}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#003d40] rounded-lg shadow-xl border border-gray-700 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user?.username}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-[#002a2d] transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Mi Perfil
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#002a2d] transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <ButtonLink to="/login" className="bg-[#03683E] hover:bg-[#028a4b] transition-colors">
                Acceder
              </ButtonLink>
              <ButtonLink to="/register" className="bg-transparent border border-[#03683E] hover:bg-[#03683E] transition-colors">
                Registrarse
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}