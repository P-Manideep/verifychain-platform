import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getMe: () => api.get('/auth/me'),
};

// Document APIs
export const documentAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  verify: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getMyDocuments: () => api.get('/documents/my-documents'),
  
  getDocument: (id: number) => api.get(`/documents/${id}`),
};

// Blockchain APIs
export const blockchainAPI = {
  getInfo: () => api.get('/blockchain/info'),
  
  getBlocks: (limit = 10, offset = 0) =>
    api.get('/blockchain/blocks', { params: { limit, offset } }),
  
  getBlock: (index: number) => api.get(`/blockchain/block/${index}`),
  
  validate: () => api.get('/blockchain/validate'),
};

export default api;