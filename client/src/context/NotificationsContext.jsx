import { createContext, useContext, useState, useEffect } from "react";
import { 
  saveNotificationConfigRequest, 
  getUserNotificationsRequest 
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

  // Obtener todas las configuraciones de notificaciones
  const getNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUserNotificationsRequest();
      setNotifications(res.data);
    } catch (error) {
      console.error("Error getting notifications:", error);
      setError(error.response?.data?.message || "Error al obtener notificaciones");
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
      setError(error.response?.data?.message || "Error al guardar configuración");
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

  // Eliminar configuración localmente (si implementas delete en el backend)
  const removeNotificationConfig = (taskId) => {
    setNotifications(prev => 
      prev.filter(notification => 
        notification.task?._id !== taskId && notification.task !== taskId
      )
    );
  };

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
        saveNotificationConfig,
        getNotificationByTask,
        removeNotificationConfig,
        setError
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}