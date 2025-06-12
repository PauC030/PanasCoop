import axios from "./axios";

// Confirmar asistencia
export const confirmAttendanceRequest = (data) => 
  axios.post('/attendances/confirm', data);

// Cancelar asistencia
export const cancelAttendanceRequest = ({ taskId, email }) =>
  axios.delete(`/attendances/cancel/${taskId}`, { data: { email } });

// Verificar si el usuario está registrado para una actividad específica
export const checkAttendanceRequest = (taskId, email) => {
  const params = email ? { email } : {};
  return axios.get(`/attendances/check/${taskId}`, { params });
};

// Obtener lista de asistentes de una tarea (SOLO si el usuario es dueño)
export const getAttendanceRequest = (taskId) =>
  axios.get(`/attendances/${taskId}`);

// Editar un asistente por su ID (SOLO si el usuario es dueño)
export const updateAttendanceRequest = (id, data) =>
  axios.put(`/attendances/${id}`, data);

// Eliminar un asistente por su ID (SOLO si el usuario es dueño)
export const deleteAttendanceRequest = (id) =>
  axios.delete(`/attendances/${id}`);

// Exportar asistentes (SOLO si el usuario es dueño)
export const exportAttendanceRequest = (taskId) =>
  axios.get(`/attendances/export/${taskId}`, { responseType: 'blob' });

export default {
  confirmAttendanceRequest,
  cancelAttendanceRequest,
  checkAttendanceRequest, // Nueva función
  getAttendanceRequest,
  updateAttendanceRequest,
  deleteAttendanceRequest,
  exportAttendanceRequest,
};