// services/api.js — Cấu hình Axios và các hàm gọi API
import axios from 'axios';

// ===== TẠO AXIOS INSTANCE =====
// baseURL lấy từ biến môi trường, fallback về chuỗi rỗng (dùng proxy trong dev)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== API CHO MÓN ĂN (FOODS) =====

// Lấy tất cả món ăn
export const getFoods = () => api.get('/api/foods');

// Thêm món ăn mới
export const createFood = (foodData) => api.post('/api/foods', foodData);

// Cập nhật món ăn theo ID
export const updateFood = (id, foodData) => api.put(`/api/foods/${id}`, foodData);

// Xóa món ăn theo ID
export const deleteFood = (id) => api.delete(`/api/foods/${id}`);

// ===== API CHO ĐƠN HÀNG (ORDERS) =====

// Lấy tất cả đơn hàng
export const getOrders = () => api.get('/api/orders');

// Tạo đơn hàng mới
export const createOrder = (orderData) => api.post('/api/orders', orderData);

// Cập nhật đơn hàng (trạng thái) theo ID
export const updateOrder = (id, orderData) => api.put(`/api/orders/${id}`, orderData);

// Xóa đơn hàng theo ID
export const deleteOrder = (id) => api.delete(`/api/orders/${id}`);

export default api;
