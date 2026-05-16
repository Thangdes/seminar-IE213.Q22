// controllers/foodController.js — Xử lý logic CRUD cho món ăn
import Food from '../models/Food.js';

// ===== LẤY TẤT CẢ MÓN ĂN =====
// GET /api/foods — Trả về danh sách tất cả món ăn, sắp xếp mới nhất trước
export const getAllFoods = async (req, res, next) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    next(error); // Chuyển lỗi sang middleware xử lý
  }
};

// ===== THÊM MÓN ĂN MỚI =====
// POST /api/foods — Tạo một món ăn mới từ dữ liệu body
export const createFood = async (req, res, next) => {
  try {
    const { name, description, price, category, image } = req.body;

    const food = await Food.create({
      name,
      description,
      price,
      category,
      image,
    });

    res.status(201).json({
      success: true,
      message: 'Thêm món ăn thành công',
      data: food,
    });
  } catch (error) {
    next(error);
  }
};

// ===== CẬP NHẬT MÓN ĂN =====
// PUT /api/foods/:id — Cập nhật thông tin món ăn theo ID
export const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm và cập nhật, trả về document mới, chạy validation
    const food = await Food.findByIdAndUpdate(id, req.body, {
      new: true,           // Trả về document sau khi update
      runValidators: true, // Chạy lại validation khi update
    });

    // Không tìm thấy món ăn
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy món ăn',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật món ăn thành công',
      data: food,
    });
  } catch (error) {
    next(error);
  }
};

// ===== XÓA MÓN ĂN =====
// DELETE /api/foods/:id — Xóa món ăn theo ID
export const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;

    const food = await Food.findByIdAndDelete(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy món ăn',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa món ăn thành công',
      data: food,
    });
  } catch (error) {
    next(error);
  }
};
