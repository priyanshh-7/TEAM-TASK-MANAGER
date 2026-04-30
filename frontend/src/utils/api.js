import axios from 'axios';

const API_URL = import.meta.env.PROD 
  ? 'https://your-backend-url.up.railway.app/api' // We will replace this with your actual Railway URL
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to attach the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
