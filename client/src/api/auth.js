import axios from "./axios";

export const registerRequest = async (user) => 
  axios.post(`/auth/register`, user);

export const loginRequest = async (user) => 
  axios.post(`/auth/login`, user);

export const verifyTokenRequest = async () => 
  axios.get(`/auth/verify`);


export const verifyEmailRequest = (token) => 
  axios.post(`/auth/verify-email`, { token });



export const resendVerificationEmailRequest = (email) => 
  axios.post(`/auth/resend-verification`, { email });


export const sendPasswordResetEmailRequest = (email) => 
  axios.post(`/auth/password-reset`, { email });


export const resetPasswordRequest = (data) => 
  axios.post(`/auth/reset-password`, data);

export const logoutRequest = async () => 
  axios.post(`/auth/logout`);

