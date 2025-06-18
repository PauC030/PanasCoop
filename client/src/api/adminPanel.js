import axios from "./axios";

// Servicios para gestión de usuarios
export const getUsersRequest = async (params = {}) => 
  axios.get("/admin-panel/users", { params });

export const getUserDetailsRequest = async (id) => 
  axios.get(`/admin-panel/users/${id}`);

export const updateUserRequest = async (id, userData) => 
  axios.put(`/admin-panel/users/${id}`, userData);

export const toggleUserStatusRequest = async (id, isActive) => 
  axios.patch(`/admin-panel/users/${id}/status`, { isActive });

export const deleteUserRequest = async (id) => 
  axios.delete(`/admin-panel/users/${id}`);

export const getUserStatsRequest = async () => 
  axios.get("/admin-panel/users/stats");

// Servicios para gestión de actividades
export const getActivitiesRequest = async (params = {}) => 
  axios.get("/admin-panel/activities", { params });

export const approveActivityRequest = async (id) => 
  axios.patch(`/admin-panel/activities/${id}/approve`);

export const rejectActivityRequest = async (id, reason) => 
  axios.patch(`/admin-panel/activities/${id}/reject`, { reason });

export const toggleActivityPromotionRequest = async (id, promotion) => 
  axios.patch(`/admin-panel/activities/${id}/promotion`, { promotion });

export const getActivityStatsRequest = async () => 
  axios.get("/admin-panel/activities/stats");

// Servicios para gestión de asistencias
export const getAttendancesRequest = async (params = {}) => 
  axios.get("/admin-panel/attendances", { params });

export const deleteAttendanceRequest = async (id) => 
  axios.delete(`/admin-panel/attendances/${id}`);

export const getAttendanceStatsRequest = async () => 
  axios.get("/admin-panel/attendances/stats");

 