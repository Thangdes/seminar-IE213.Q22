// routes/orders.js — Định nghĩa các route cho đơn hàng
import express from 'express';
import {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';

const router = express.Router();

// GET  /api/orders     → Lấy tất cả đơn hàng
// POST /api/orders     → Tạo đơn hàng mới
router.route('/').get(getAllOrders).post(createOrder);

// PUT    /api/orders/:id → Cập nhật trạng thái đơn hàng
// DELETE /api/orders/:id → Xóa đơn hàng
router.route('/:id').put(updateOrder).delete(deleteOrder);

export default router;
