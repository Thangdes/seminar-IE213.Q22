// routes/foods.js — Định nghĩa các route cho món ăn
import express from 'express';
import {
  getAllFoods,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/foodController.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET  /api/foods     → Lấy tất cả món ăn
// POST /api/foods     → Thêm món ăn mới
router.route('/').get(getAllFoods).post(requireAuth, requireAdmin, createFood);

// PUT    /api/foods/:id → Cập nhật món ăn
// DELETE /api/foods/:id → Xóa món ăn
router.route('/:id').put(requireAuth, requireAdmin, updateFood).delete(requireAuth, requireAdmin, deleteFood);

export default router;
