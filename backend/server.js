// server.js — Entry point cho Express backend
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import foodRoutes from './routes/foods.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';

// Import middleware xử lý lỗi
import errorHandler from './middleware/errorHandler.js';

// ===== CẤU HÌNH BIẾN MÔI TRƯỜNG =====
// Đọc file .env và gán vào process.env
dotenv.config();

// Sử dụng DNS công cộng nếu DNS local không trả về SRV cho Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Khởi tạo Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
// Cho phép frontend gọi API từ domain khác (Cross-Origin)
app.use(cors());

// Parse JSON body từ request
app.use(express.json({ limit: '5mb' }));

// ===== KẾT NỐI MONGODB =====
// Sử dụng MongoDB Atlas — connection string từ biến môi trường
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Kết nối MongoDB Atlas thành công');
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    console.error('⚠️ Server vẫn chạy nhưng database chưa kết nối');
  });

// ===== ĐĂNG KÝ ROUTES =====
// Tất cả route món ăn: /api/foods/*
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);

// Tất cả route đơn hàng: /api/orders/*
app.use('/api/orders', orderRoutes);

// ===== ROUTE MẶC ĐỊNH =====
// Kiểm tra server hoạt động
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'OrderUp API đang hoạt động!',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      foods: '/api/foods',
      orders: '/api/orders',
    },
  });
});

// ===== MIDDLEWARE XỬ LÝ LỖI =====
// Phải đặt SAU tất cả routes để bắt lỗi từ mọi nơi
app.use(errorHandler);

// ===== KHỞI ĐỘNG SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`OrderUp Foods API: http://localhost:${PORT}/api/foods`);
  console.log(`OrderUp Orders API: http://localhost:${PORT}/api/orders`);
});
