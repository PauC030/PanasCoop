import axios from './axios.js';

// Guardar o actualizar configuración de notificación
export const saveNotificationConfigRequest = (data) => 
  axios.post('/notifications', data);

// Obtener todas las configuraciones de notificaciones del usuario
export const getUserNotificationsRequest = () => 
  axios.get('/notifications');