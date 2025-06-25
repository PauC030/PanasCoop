import axios from "./axios";


export const confirmAttendanceRequest = (data) => 
  axios.post('/attendances/confirm', data);


export const cancelAttendanceRequest = ({ taskId, email }) =>
  axios.delete(`/attendances/cancel/${taskId}`, { data: { email } });


export const checkAttendanceRequest = (taskId, email) => {
  const params = email ? { email } : {};
  return axios.get(`/attendances/check/${taskId}`, { params }); // ✅ Corregido
};


export const getAttendanceRequest = (taskId) =>
  axios.get(`/attendances/${taskId}`);

export const updateAttendanceRequest = (id, data) =>
  axios.put(`/attendances/${id}`, data);

export const deleteAttendanceRequest = (id) =>
  axios.delete(`/attendances/${id}`);


export const exportAttendanceRequest = (taskId) =>
  axios.get(`/attendances/export/${taskId}`, { responseType: 'blob' });


export const getUserAttendancesRequest = () =>
  axios.get('/attendances/mis-asistencias');


export default {
  confirmAttendanceRequest,
  cancelAttendanceRequest,
  checkAttendanceRequest, 
  getAttendanceRequest,
  updateAttendanceRequest,
  deleteAttendanceRequest,
  exportAttendanceRequest,
  getUserAttendancesRequest
};