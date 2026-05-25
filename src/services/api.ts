import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const webhooksApi = {
  create: (data: { sourceUrl: string; callbackUrl: string; eventType: string }) =>
    api.post('/webhooks', data),
  list: (eventType?: string) =>
    api.get('/webhooks', { params: eventType ? { eventType } : undefined }),
  get: (id: string) => api.get(`/webhooks/${id}`),
  cancel: (id: string) => api.delete(`/webhooks/${id}`),
};

export const eventsApi = {
  list: (params?: { webhookId?: string; status?: string }) =>
    api.get('/events', { params }),
  retry: (id: string) => api.post(`/events/${id}/retry`),
};

export default api;
