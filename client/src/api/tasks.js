import axios from "./axios";

export const getTasksRequest = async () => axios.get("/tasks");

export const createTaskRequest = async (task) => {
  if (task instanceof FormData) {
    return axios.post("/tasks", task); // <-- Sin headers
  }
  return axios.post("/tasks", task);
};

export const updateTaskRequest = async (id, task) => {
  if (task instanceof FormData) {
    return axios.put(`/tasks/${id}`, task); // <-- Sin headers
  }
  return axios.put(`/tasks/${id}`, task);
};

export const deleteTaskRequest = async (id) => axios.delete(`/tasks/${id}`);

export const getTaskRequest = async (id) => axios.get(`/tasks/${id}`);

export const getOthersTasksRequest = () => axios.get("/tasks/others");

export const searchTasksRequest = async (params) => {
  return await axios.get('/tasks/search', { params });
};

export const togglePromotionRequest = async (id, data) => axios.patch(`/tasks/${id}/promotion`, data);

export const getPromotedTasksRequest = async () => axios.get("/tasks/promoted");

