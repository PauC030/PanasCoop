import axios from "./axios";


// Confirmar asistencia (body: { taskId, name?, email? })
export const confirmAttendanceRequest = (data) =>
  axios.post('/attendances/confirm', data);

// Cancelar asistencia (body: { taskId, email? })
export const cancelAttendanceRequest = (data) =>
  axios.post('/attendances/cancel', data);

// Obtener lista de asistentes de una tarea
export const getAttendanceRequest = (taskId) =>
  axios.get(`/attendances/${taskId}`);

// Editar un asistente por su ID
export const updateAttendanceRequest = (id, data) =>
  axios.put(`/attendances/${id}`, data);

// Eliminar un asistente por su ID
export const deleteAttendanceRequest = (id) =>
  axios.delete(`/attendances/${id}`);

export default {
  confirmAttendanceRequest,
  cancelAttendanceRequest,
  getAttendanceRequest,
  updateAttendanceRequest,
  deleteAttendanceRequest,
};
