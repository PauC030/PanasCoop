import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from './authContext';
import { 
  saveNotificationConfigRequest, 
  getUserNotificationsRequest,
  deleteNotificationRequest,
  updateNotificationRequest,
} from "../api/notificaciones";

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};

export function NotificationsProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  
  // Estado para configuraciones de notificaciones (correo)
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para notificaciones en tiempo real
  const [realtimeNotifications, setRealtimeNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Clave para localStorage basada en el usuario
  const getStorageKey = () => {
    const userId = user?.id || user?._id || 'anonymous';
    return `notifications_${userId}`;
  };

  // Cargar notificaciones desde localStorage
  const loadNotificationsFromStorage = () => {
    try {
      const storageKey = getStorageKey();
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const parsedData = JSON.parse(stored);
        
        // Filtrar notificaciones que no sean muy antiguas (ejemplo: últimas 24 horas)
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 horas
        const validNotifications = parsedData.notifications.filter(notif => {
          const notifTime = new Date(notif.timestamp).getTime();
          return notifTime > cutoffTime;
        });

        setRealtimeNotifications(validNotifications);
        
        // Verificar si hay notificaciones no leídas
        const unreadCount = validNotifications.filter(n => !n.read).length;
        setHasNewNotifications(unreadCount > 0);

        // Actualizar localStorage con notificaciones filtradas
        if (validNotifications.length !== parsedData.notifications.length) {
          saveNotificationsToStorage(validNotifications);
        }
      }
    } catch (error) {
      console.error("Error loading notifications from storage:", error);
      // Si hay error, limpiar localStorage corrupto
      try {
        localStorage.removeItem(getStorageKey());
      } catch (cleanupError) {
        console.error("Error cleaning up corrupted storage:", cleanupError);
      }
    }
  };

  // Guardar notificaciones en localStorage
  const saveNotificationsToStorage = (notifications) => {
    try {
      const storageKey = getStorageKey();
      const dataToStore = {
        notifications: notifications,
        lastUpdate: Date.now()
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Error saving notifications to storage:", error);
      // Si el localStorage está lleno, limpiar notificaciones antiguas
      try {
        const cutoffTime = Date.now() - (12 * 60 * 60 * 1000); // 12 horas
        const recentNotifications = notifications.filter(notif => {
          const notifTime = new Date(notif.timestamp).getTime();
          return notifTime > cutoffTime;
        });
        
        const dataToStore = {
          notifications: recentNotifications,
          lastUpdate: Date.now()
        };
        localStorage.setItem(getStorageKey(), JSON.stringify(dataToStore));
      } catch (retryError) {
        console.error("Error saving notifications after cleanup:", retryError);
      }
    }
  };

  // Solicitar permisos para notificaciones del navegador
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Cargar notificaciones del storage al inicializar o cambiar usuario
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotificationsFromStorage();
    } else {
      // Si no está autenticado, limpiar las notificaciones
      setRealtimeNotifications([]);
      setHasNewNotifications(false);
    }
  }, [isAuthenticated, user?.id, user?._id]);

  // Guardar en storage cada vez que cambien las notificaciones en tiempo real
  useEffect(() => {
    if (isAuthenticated && realtimeNotifications.length >= 0) {
      saveNotificationsToStorage(realtimeNotifications);
    }
  }, [realtimeNotifications, isAuthenticated]);

  // obtener notificaciones desde la API
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await getUserNotificationsRequest();
      const notificationsData = response.data || [];
      setNotifications(notificationsData);
      return notificationsData;
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      const errorMessage = error.response?.data?.message || "Error al cargar notificaciones";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas las configuraciones de notificaciones
  const getNotifications = async () => {
    if (!isAuthenticated) return [];
    
    try {
      setLoading(true);
      setError(null);
      const res = await getUserNotificationsRequest();
      setNotifications(res.data || []);
      return res.data;
    } catch (error) {
      console.error("Error getting notifications:", error);
      const errorMessage = error.response?.data?.message || "Error al obtener notificaciones";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Guardar o actualizar configuración de notificación
  const saveNotificationConfig = async (taskId, daysBefore) => {
    try {
      setLoading(true);
      setError(null);
      const res = await saveNotificationConfigRequest({
        task: taskId,
        daysBefore: parseInt(daysBefore)
      });
      
      // Actualizar el estado local
      await getNotifications();
      
      return res.data;
    } catch (error) {
      console.error("Error saving notification config:", error);
      const errorMessage = error.response?.data?.message || "Error al guardar configuración";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar configuración de notificación
  const deleteNotificationConfig = async (notificationId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await deleteNotificationRequest(notificationId);
      
     
      setNotifications(prev => 
        prev.filter(notification => notification._id !== notificationId)
      );
      
      return res.data;
    } catch (error) {
      console.error("Error deleting notification config:", error);
      const errorMessage = error.response?.data?.message || "Error al eliminar configuración";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar configuración de notificación
  const updateNotificationConfig = async (notificationId, daysBefore) => {
    try {
      setLoading(true);
      setError(null);
      const res = await updateNotificationRequest(notificationId, {
        daysBefore: parseInt(daysBefore)
      });
      
      // Actualizar el estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, daysBefore: parseInt(daysBefore) }
            : notification
        )
      );
      
      return res.data;
    } catch (error) {
      console.error("Error updating notification config:", error);
      const errorMessage = error.response?.data?.message || "Error al actualizar configuración";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener configuración específica por task ID
  const getNotificationByTask = (taskId) => {
    return notifications.find(notification => 
      notification.task?._id === taskId || notification.task === taskId
    );
  };

  // Verificar si una tarea tiene notificación configurada
  const hasNotificationForTask = (taskId) => {
    return notifications.some(notification => 
      notification.task?._id === taskId || notification.task === taskId
    );
  };

  // Obtener días de anticipación configurados para una tarea
  const getDaysBeforeForTask = (taskId) => {
    const notification = getNotificationByTask(taskId);
    return notification?.daysBefore || 0;
  };

  // Funciones para notificaciones en tiempo real (mejoradas con persistencia)
  const addRealtimeNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date(),
      read: false
    };
    
    setRealtimeNotifications(prev => {
      // Evitar duplicados basándose en taskId y timestamp reciente
      const isDuplicate = prev.some(n => 
        n.taskId === newNotification.taskId && 
        Math.abs(new Date(n.timestamp) - new Date(newNotification.timestamp)) < 5000 // 5 segundos
      );
      
      if (isDuplicate) {
        return prev;
      }
      
      const updated = [newNotification, ...prev];
      
      // Limitar a máximo 50 notificaciones para evitar problemas de rendimiento
      return updated.slice(0, 50);
    });
    
    setHasNewNotifications(true);
    
    // Mostrar notificación del navegador si tiene permisos
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.taskId
      });
    }
  };

  const markAsRead = (id) => {
    setRealtimeNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    
    // Si todas las notificaciones están leídas, quitar el indicador
    setTimeout(() => {
      setRealtimeNotifications(current => {
        const unreadCount = current.filter(n => !n.read).length;
        if (unreadCount === 0) {
          setHasNewNotifications(false);
        }
        return current;
      });
    }, 100);
  };

  // Limpiar notificación específica
  const clearNotification = (id) => {
    setRealtimeNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Limpiar todas las notificaciones
  const clearAllNotifications = () => {
    setRealtimeNotifications([]);
    setHasNewNotifications(false);
    
    // También limpiar del localStorage
    try {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Error clearing notifications from storage:", error);
    }
  };

  // Limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Cargar notificaciones al inicializar
  useEffect(() => {
    if (isAuthenticated) {
      getNotifications();
    }
  }, [isAuthenticated]);

  return (
    <NotificationsContext.Provider
      value={{
        // Configuraciones de notificaciones (correo)
        notifications,
        loading,
        error,
        getNotifications,
        fetchNotifications,
        saveNotificationConfig,
        deleteNotificationConfig,
        updateNotificationConfig,
        getNotificationByTask,
        hasNotificationForTask,
        getDaysBeforeForTask,
        clearError,
        setError,
        
        realtimeNotifications,
        hasNewNotifications,
        addRealtimeNotification,
        markAsRead,
        clearNotification,
        clearAllNotifications,
        
      
        loadNotificationsFromStorage,
        saveNotificationsToStorage
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}