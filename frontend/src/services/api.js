import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const registerUser = (authData) => api.post('/api/auth/register', authData);

export const loginUser = (authData) => api.post('/api/auth/login', authData);

export const getMe = () => api.get('/api/users/me');

export const updateMe = (profileData) => api.patch('/api/users/me', profileData);

export const changePassword = (passwordData) => api.patch('/api/users/me/password', passwordData);

export const getFoods = () => api.get('/api/foods');

export const createFood = (foodData) => api.post('/api/foods', foodData);

export const updateFood = (id, foodData) => api.put(`/api/foods/${id}`, foodData);

export const deleteFood = (id) => api.delete(`/api/foods/${id}`);

export const getOrders = () => api.get('/api/orders');

export const createOrder = (orderData) => api.post('/api/orders', orderData);

export const updateOrder = (id, orderData) => api.put(`/api/orders/${id}`, orderData);

export const reviewOrder = (id, reviewData) => api.put(`/api/orders/${id}/review`, reviewData);

export const deleteOrder = (id) => api.delete(`/api/orders/${id}`);

export default api;
