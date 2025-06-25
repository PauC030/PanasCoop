import axios from "./axios";

export const registerRequest = async (user) => 
  axios.post(`/auth/register`, user);

export const loginRequest = async (user) => 
  axios.post(`/auth/login`, user);

export const verifyTokenRequest = async () => 
  axios.get(`/auth/verify`);

// Ruta correcta para verificar email
export const verifyEmailRequest = (token) => 
  axios.post(`/auth/verify-email`, { token });

// Función para reenviar email de verificación
export const resendVerificationEmailRequest = (email) => 
  axios.post(`/auth/resend-verification`, { email });

export const logoutRequest = async () => 
  axios.post(`/auth/logout`);

// Ruta para solicitar reset de contraseña (envía email)
export const sendPasswordResetEmailRequest = (email) => 
  axios.post(`/auth/password-reset`, { email });

// CORRECCIÓN: La función debe recibir un objeto con token y newPassword
export const resetPasswordRequest = (data) => 
  axios.post(`/auth/reset-password`, data);