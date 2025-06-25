import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '../context/NotificationsContext';

export function useNotificationSystem() {
  const [activeNotifications, setActiveNotifications] = useState([]);
  const [permission, setPermission] = useState(Notification.permission);
  const { notifications } = useNotifications();

  // Solicitar permisos para notificaciones del navegador
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }
    return false;
  }, []);

  // Verificar notificaciones pendientes
  const checkPendingNotifications = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingNotifications = notifications.filter(notification => {
      const taskDate = new Date(notification.task.date);
      taskDate.setHours(0, 0, 0, 0);
      
      // Calcular la fecha de notificación
      const notificationDate = new Date(taskDate);
      notificationDate.setDate(notificationDate.getDate() - notification.daysBefore);
      
      return notificationDate.getTime() === today.getTime();
    });

    setActiveNotifications(pendingNotifications);
    return pendingNotifications;
  }, [notifications]);

  // Mostrar notificación del navegador
  const showBrowserNotification = useCallback((notification) => {
    if (permission === 'granted') {
      const browserNotification = new Notification(
        `Recordatorio: ${notification.task.title}`,
        {
          body: `La actividad es en ${notification.daysBefore} días (${new Date(notification.task.date).toLocaleDateString()})`,
          icon: '/favicon.ico', // Ajusta la ruta de tu icono
          tag: notification._id, // Evita duplicados
        }
      );

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };

      // Auto-cerrar después de 10 segundos
      setTimeout(() => browserNotification.close(), 10000);
    }
  }, [permission]);

  // Efecto principal para verificar notificaciones
  useEffect(() => {
    // Verificar inmediatamente al cargar
    const pending = checkPendingNotifications();
    
    // Mostrar notificaciones del navegador
    pending.forEach(showBrowserNotification);

    // Configurar verificación periódica (cada hora)
    const interval = setInterval(() => {
      const newPending = checkPendingNotifications();
      newPending.forEach(showBrowserNotification);
    }, 60 * 60 * 1000); // 1 hora

    return () => clearInterval(interval);
  }, [checkPendingNotifications, showBrowserNotification]);

  return {
    activeNotifications,
    requestPermission,
    permission,
    checkPendingNotifications
  };
}


import { useState, useEffect } from 'react';
import { X, Bell, Calendar, MapPin } from 'lucide-react';

export function NotificationToast({ notification, onClose, onSnooze }) {
  const [isVisible, setIsVisible] = useState(true);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Esperar a que termine la animación
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-white rounded-lg shadow-lg border-l-4 border-[#03673E] p-4 max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="text-[#03673E] w-5 h-5" />
            <h3 className="font-semibold text-gray-800">Recordatorio</h3>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-2">
          <p className="font-medium text-gray-800">{notification.task.title}</p>
          <div className="flex items-center space-x-1 mt-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(notification.task.date)}</span>
          </div>
          {notification.task.location && (
            <div className="flex items-center space-x-1 mt-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{notification.task.location}</span>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Faltan {notification.daysBefore} días
          </p>
        </div>

        <div className="flex space-x-2 mt-3">
          <button
            onClick={() => onSnooze(notification)}
            className="flex-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Recordar más tarde
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-3 py-1 text-xs bg-[#03673E] text-white rounded hover:bg-[#024d2e]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. Componente principal de gestión de notificaciones

import { useState, useEffect } from 'react';
import { useNotificationSystem } from '../hooks/useNotificationSystem';
import { NotificationToast } from './NotificationToast';

export function NotificationManager() {
  const { activeNotifications, requestPermission, permission } = useNotificationSystem();
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [snoozedNotifications, setSnoozedNotifications] = useState(new Set());

  // Sincronizar notificaciones activas con las visibles
  useEffect(() => {
    const newNotifications = activeNotifications.filter(
      notification => !snoozedNotifications.has(notification._id)
    );
    setVisibleNotifications(newNotifications);
  }, [activeNotifications, snoozedNotifications]);

  // Solicitar permisos al montar el componente
  useEffect(() => {
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCloseNotification = (notificationId) => {
    setVisibleNotifications(prev => 
      prev.filter(n => n._id !== notificationId)
    );
  };

  const handleSnoozeNotification = (notification) => {
    // Agregar a snoozed por 1 hora
    setSnoozedNotifications(prev => new Set([...prev, notification._id]));
    
    // Remover del snooze después de 1 hora
    setTimeout(() => {
      setSnoozedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notification._id);
        return newSet;
      });
    }, 60 * 60 * 1000); // 1 hora

    handleCloseNotification(notification._id);
  };

  return (
    <>
      {visibleNotifications.map(notification => (
        <NotificationToast
          key={notification._id}
          notification={notification}
          onClose={() => handleCloseNotification(notification._id)}
          onSnooze={handleSnoozeNotification}
        />
      ))}
    </>
  );
}

// 4. Indicador de notificaciones en el header/navbar

import { Bell, BellRing } from 'lucide-react';
import { useNotificationSystem } from '../hooks/useNotificationSystem';

export function NotificationBadge({ onClick }) {
  const { activeNotifications } = useNotificationSystem();
  const hasNotifications = activeNotifications.length > 0;

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-[#03673E] transition-colors"
    >
      {hasNotifications ? (
        <BellRing className="w-6 h-6 text-[#03673E]" />
      ) : (
        <Bell className="w-6 h-6" />
      )}
      
      {hasNotifications && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {activeNotifications.length}
        </span>
      )}
    </button>
  );
}

// 5. Panel de notificaciones 
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useNotificationSystem } from '../hooks/useNotificationSystem';

export function NotificationPanel({ isOpen, onClose }) {
  const { activeNotifications } = useNotificationSystem();

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800">Notificaciones</h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {activeNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No hay notificaciones pendientes</p>
          </div>
        ) : (
          activeNotifications.map(notification => (
            <div key={notification._id} className="p-4 border-b hover:bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#03673E] rounded-full flex items-center justify-center">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {notification.task.title}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(notification.task.date)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{notification.daysBefore}d antes</span>
                    </div>
                  </div>
                  
                  {notification.task.location && (
                    <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{notification.task.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {activeNotifications.length > 0 && (
        <div className="p-3 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-[#03673E] hover:text-[#024d2e]"
          >
            Cerrar notificaciones
          </button>
        </div>
      )}
    </div>
  );
}

// 6. Integración en el componente principal (App.jsx)
/*
import { NotificationManager } from './components/NotificationManager';

function App() {
  return (
    <div className="app">
      // Tu contenido existente
      
      // Agregar el manager de notificaciones
      <NotificationManager />
    </div>
  );
}
*/

// 7. Integración en el Navbar
/*
import { useState } from 'react';
import { NotificationBadge } from './components/NotificationBadge';
import { NotificationPanel } from './components/NotificationPanel';

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="navbar">
      // Otros elementos del navbar
      
      <div className="relative">
        <NotificationBadge 
          onClick={() => setShowNotifications(!showNotifications)} 
        />
        
        <NotificationPanel 
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>
    </nav>
  );
}
*/