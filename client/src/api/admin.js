import axios from "./axios";

export const getAdminStatsRequest = async () => 
  axios.get("/admin/stats");

export const getAllAdminsRequest = async () => 
  axios.get("/admin");

export const getAdminByIdRequest = async (id) => 
  axios.get(`/admin/${id}`);

export const createAdminRequest = async (admin) => 
  axios.post("/auth/admin/register", admin);

export const updateAdminRequest = async (id, admin) => 
  axios.put(`/admin/${id}`, admin);

export const deactivateAdminRequest = async (id) => 
  axios.patch(`/admin/${id}/deactivate`);

export const reactivateAdminRequest = async (id) => 
  axios.patch(`/admin/${id}/reactivate`);

export const deleteAdminRequest = async (id) => 
  axios.delete(`/admin/${id}`);