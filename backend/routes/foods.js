// routes/foods.js — Định nghĩa các route cho món ăn
import express from 'express';
import {
  getAllFoods,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/foodController.js';

const router = express.Router();

// GET  /api/foods     → Lấy tất cả món ăn
// POST /api/foods     → Thêm món ăn mới
router.route('/').get(getAllFoods).post(createFood);

// PUT    /api/foods/:id → Cập nhật món ăn
// DELETE /api/foods/:id → Xóa món ăn
router.route('/:id').put(updateFood).delete(deleteFood);

export default router;
