import axios from 'axios';

// FIX 1: Use a relative path so the Vite proxy catches all requests
const API_BASE_URL = '/api'; 

// FIX 2: Export an EMPTY host URL so all media paths are relative
export const API_HOST = ''; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // FIX 3: If we are sending FormData (a file), delete the 'Content-Type' header
    // The browser will automatically set the correct 'multipart/form-data' header
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          // FIX 4: Use a relative path for the refresh token request as well
          const response = await axios.post('/api/auth/token/refresh/', {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;