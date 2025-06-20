// context/notificationsContext.js
import { createContext, useContext, useState, useEffect } from "react";
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener notificaciones desde la API
  const fetchNotifications = async () => {
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

  // Limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Cargar notificaciones al inicializar
  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
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
        setError
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}