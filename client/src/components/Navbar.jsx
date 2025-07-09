import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useNotifications } from "../context/NotificationsContext";
import { ButtonLink } from "./ui/ButtonLink";
import { useState, useRef, useEffect } from "react";
import useSocket from "../hooks/useSocket";
import panaLogo from "../assets/coop.png";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const {
    realtimeNotifications = [],
    markAsRead,
    clearNotification,
    clearAllNotifications,
    hasNewNotifications = false,
  } = useNotifications() || {};

  const socketData = useSocket() || {};
  const { isConnected = false, testNotification } = socketData;

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [bellAnimation, setBellAnimation] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleNotifications = () => {
    if (!isNotificationOpen && realtimeNotifications.length > 0) {
      realtimeNotifications
        .filter((n) => !n.read)
        .forEach((n) => markAsRead && markAsRead(n.id));
    }
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setIsNotificationOpen(false);
    }
  };

  // Función para manejar el click en notificación individual
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead?.(notification.id);
    }
  };

  // Función para manejar el borrado de notificación
  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation(); 
    clearNotification?.(notificationId);
  };

  useEffect(() => {
    if (hasNewNotifications) {
      setBellAnimation(true);
      const timer = setTimeout(() => setBellAnimation(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasNewNotifications]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = realtimeNotifications.filter((n) => !n.read).length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#002326] text-white shadow-md h-16">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to={isAuthenticated ? "/tasks" : "/"}
              className="hover:opacity-80 transition-opacity flex items-center"
            >
              <img src={panaLogo} alt="PanascOOP" className="h-[40px] sm:h-[45px] w-auto" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {isAuthenticated ? (
              <>
                 <Link
                  to="/tasks"
                   className="group relative px-4 py-2.5 text-sm font-medium text-white/90 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                  >
                  <span className="relative z-10 flex items-center gap-2">
                       <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                   </svg>
                      Mis actividades
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  
                <Link
                 to="/add-task"
                  className="group relative px-4 py-2.5 text-sm font-medium text-white/90 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                 >
               <span className="relative z-10 flex items-center gap-2">
               <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
               Crear Actividad
              </span>
             <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>


                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={toggleNotifications}
                    className={`relative p-2.5 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      bellAnimation ? "animate-bounce" : ""
                    } ${
                      hasNewNotifications 
                        ? "bg-gradient-to-r from-amber-400 to-orange-200 shadow-lg shadow-amber-500/30" 
                        : "bg-[#003d40] hover:bg-[#004a50]"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 xl:w-6 xl:h-6 transition-all duration-300 ${
                        bellAnimation ? "animate-pulse" : ""
                      } ${
                        hasNewNotifications 
                          ? "text-white drop-shadow-sm" 
                          : "text-gray-300"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>  

                    {unreadCount > 0 && (
                      <span
                        className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] xl:min-w-[22px] h-[20px] xl:h-[22px] flex items-center justify-center font-bold border-2 border-white shadow-lg transition-all duration-300 ${
                          bellAnimation ? "animate-pulse scale-110" : ""
                        }`}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}

                    {hasNewNotifications && (
                      <>
                        <span className="absolute -top-1 -right-1 w-5 h-5 xl:w-6 xl:h-6 bg-red-400 rounded-full animate-ping opacity-60"></span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-20 animate-pulse"></div>
                      </>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden">
                      {/* Header del panel */}
                      <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-[#064349] to-[#03683E]">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                            </svg>
                            <h3 className="font-bold text-white text-sm sm:text-base">Notificaciones</h3>
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          {realtimeNotifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="text-xs text-white/80 hover:text-white transition-colors bg-white/20 px-2 sm:px-3 py-1 rounded-full hover:bg-white/30"
                            >
                              Limpiar
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {realtimeNotifications.length === 0 ? (
                          <div className="p-6 sm:p-8 text-center text-gray-500">
                            <div className="w-8 h-8 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                              </svg>
                            </div>
                            <p className="text-sm font-medium">No hay notificaciones</p>
                            <p className="text-xs text-gray-400 mt-1">Te avisaremos cuando tengas algo nuevo</p>
                          </div>
                        ) : (
                          realtimeNotifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group ${
                                !notification.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div 
                                  className="flex-1 mr-2 sm:mr-3 cursor-pointer"
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-sm text-gray-900">
                                      {notification.title || "Notificación"}
                                    </h4>
                                    {!notification.read && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0"></span>
                                    )}
                                  </div>
                                  {/* Mensaje completo sin truncar */}
                                  <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
                                    {notification.message || "Sin mensaje"}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                      </svg>
                                      {notification.timestamp
                                        ? new Date(notification.timestamp).toLocaleTimeString("es-ES", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            day: "2-digit",
                                            month: "2-digit",
                                          })
                                        : "Ahora"}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => handleDeleteNotification(e, notification.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 flex-shrink-0"
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

                {/* Menú de perfil responsive */}
                 <div className="relative" ref={profileRef}>
                 <button
                onClick={toggleProfile}
               className="group flex items-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 backdrop-blur-sm border border-white/10 hover:border-white/20 px-2.5 py-1.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
               >
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`} />
          </div>
          
          <div className="hidden xl:flex flex-col items-start">
            <span className="text-xs font-medium text-white group-hover:text-emerald-200 transition-colors truncate max-w-20">

              {user?.username || "Usuario"}
            </span>
            <span className={`text-xs flex items-center gap-1 ${
              isConnected ? "text-green-300" : "text-red-300"
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-400" : "bg-red-400"
              }`} />
              {isConnected ? "Conectado" : "Desconectado"}
            </span>
          </div>
          
          <svg
            className={`w-4 h-4 text-white/70 transition-all duration-300 ${
              isProfileOpen ? "rotate-180 text-emerald-300" : "group-hover:text-white"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 z-50 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  logout();
                  setIsProfileOpen(false);
                }}
                className="group w-full flex items-center space-x-3 px-3 py-2.5 text-left text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
              </>
            ) : (
              <>
              </> 
            )}
          </div>

          {/* Botón de menú móvil - SOLO aparece cuando el usuario está autenticado */}
          {isAuthenticated && (
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white hover:text-gray-300 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Menú móvil - SOLO se muestra cuando el usuario está autenticado */}
        {isMobileMenuOpen && isAuthenticated && (
  <div className="lg:hidden absolute top-16 left-0 right-0 bg-gradient-to-br from-[#064349] to-[#03683E] border-t border-green-600 shadow-xl backdrop-blur-sm z-40">
    <div className="px-4 py-4 space-y-4">
      {/* Header del perfil en móvil */}
      <div className="flex items-center justify-between pb-4 border-b border-green-600/30">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center ring-2 ring-white/30">
              <span className="text-white font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user?.username || "Usuario"}</p>
            <p className="text-xs text-green-200 flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
              {isConnected ? "Conectado" : "Desconectado"}
            </p>
          </div>
        </div>
        
        {/* Botón de cerrar menú */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotifications}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                    hasNewNotifications 
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg" 
                      : "bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="text-sm font-medium text-white">Notificaciones</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
                      {unreadCount}
                    </span>
                  )}
                </button>

                 {isNotificationOpen && (
          <div className="mt-3 bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-[#064349] to-[#03683E]">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white text-sm">Notificaciones</h3>
                {realtimeNotifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-white/90 hover:text-white bg-white/20 px-2 py-1 rounded-md hover:bg-white/30 transition-colors"
                  >
                    Limpiar todo
                  </button>
                )}
              </div>
            </div>
            
            <div className="max-h-56 overflow-y-auto">
              {realtimeNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-sm font-medium">No hay notificaciones</p>
                </div>
              ) : (
                realtimeNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div 
                        className="flex-1 mr-2 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {notification.title || "Notificación"}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                          {notification.message || "Sin mensaje"}
                        </p>
                        <span className="text-xs text-gray-400">
                          {notification.timestamp
                            ? new Date(notification.timestamp).toLocaleTimeString("es-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Ahora"}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteNotification(e, notification.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
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

      {/* Navegación principal */}
      <div className="space-y-2">
        <Link
          to="/tasks"
          className="group flex items-center space-x-3 w-full p-3 text-white hover:text-emerald-200 rounded-lg hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/20"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="font-medium">Mis actividades</span>
        </Link>

        <Link
          to="/add-task"
          className="group flex items-center space-x-3 w-full p-3 bg-emerald-600/30 hover:bg-emerald-600/40 text-white rounded-lg transition-all duration-200 border border-emerald-500/50 hover:border-emerald-400/70"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Crear nueva Actividad</span>
        </Link>
      </div>

      {/* Separador */}
      <div className="border-t border-green-600/30 my-4"></div>

      {/* Cerrar sesión */}
      <button
        onClick={() => {
          logout();
          setIsMobileMenuOpen(false);
        }}
        className="group flex items-center space-x-3 w-full p-3 text-red-300 hover:text-red-200 rounded-lg hover:bg-red-500/20 transition-all duration-200 border border-transparent hover:border-red-500/30"
      >
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="font-medium">Cerrar Sesión</span>
      </button>
    </div>
  </div>
)}
      </div>
    </nav>
  );
}