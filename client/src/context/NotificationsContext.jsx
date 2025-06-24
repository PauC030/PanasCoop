// context/notificationsContext.js - CORREGIDO
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
  
  // Estado para notificaciones en tiempo real (frontend)
  const [realtimeNotifications, setRealtimeNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Solicitar permisos para notificaciones del navegador
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Función para obtener notificaciones desde la API
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
      
      // Actualizar el estado local removiendo la notificación
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

  // Funciones para notificaciones en tiempo real
  const addRealtimeNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date(),
      read: false
    };
    
    setRealtimeNotifications(prev => [newNotification, ...prev]);
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
        
        // Notificaciones en tiempo real (frontend)
        realtimeNotifications,
        hasNewNotifications,
        addRealtimeNotification,
        markAsRead,
        clearNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}