
import axios from './axios.js';


export const saveNotificationConfigRequest = (data) => 
  axios.post('/notifications', data);


export const getUserNotificationsRequest = () => 
  axios.get('/notifications');


export const deleteNotificationRequest = (id) => 
  axios.delete(`/notifications/${id}`);

export const updateNotificationRequest = (id, data) => 
  axios.put(`/notifications/${id}`, data);