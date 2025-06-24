import axios from "./axios";

export const registerRequest = async (user) => 
  axios.post(`/auth/register`, user);

export const loginRequest = async (user) => 
  axios.post(`/auth/login`, user);

export const verifyTokenRequest = async () => 
  axios.get(`/auth/verify`);

// CORREGIDO: Ruta correcta para verificar email
export const verifyEmailRequest = (token) => 
  axios.post(`/auth/verify-email`, { token });

// NUEVA: Función para reenviar email de verificación
export const resendVerificationEmailRequest = (email) => 
  axios.post(`/auth/resend-verification`, { email });

export const logoutRequest = async () => 
  axios.post(`/auth/logout`);