// controllers/orderController.js — Xử lý logic CRUD cho đơn hàng
import Order from '../models/Order.js';

// ===== LẤY TẤT CẢ ĐƠN HÀNG =====
// GET /api/orders — Trả về danh sách đơn hàng, populate thông tin món ăn
export const getAllOrders = async (req, res, next) => {
  try {
    // Populate để lấy thông tin chi tiết món ăn từ collection foods
    const orders = await Order.find()
      .populate('items.food', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ===== TẠO ĐƠN HÀNG MỚI =====
// POST /api/orders — Tạo đơn hàng từ giỏ hàng của khách
export const createOrder = async (req, res, next) => {
  try {
    const { customerName, items, totalPrice, note } = req.body;

    const order = await Order.create({
      customerName,
      items,
      totalPrice,
      note,
    });

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ===== CẬP NHẬT ĐƠN HÀNG =====
// PUT /api/orders/:id — Cập nhật trạng thái đơn hàng (pending → confirmed → delivered)
export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật đơn hàng thành công',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ===== XÓA ĐƠN HÀNG =====
// DELETE /api/orders/:id — Xóa đơn hàng theo ID
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa đơn hàng thành công',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
