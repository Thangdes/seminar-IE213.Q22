// models/Order.js — Mongoose schema cho đơn hàng
import mongoose from 'mongoose';

// Schema cho từng item trong đơn hàng
const orderItemSchema = new mongoose.Schema(
  {
    // Tham chiếu đến món ăn trong collection foods
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: [true, 'Món ăn là bắt buộc'],
    },

    // Tên món ăn — lưu lại để hiển thị ngay cả khi food bị xóa
    foodName: {
      type: String,
      required: [true, 'Tên món ăn là bắt buộc'],
    },

    // Số lượng — ít nhất 1
    quantity: {
      type: Number,
      required: [true, 'Số lượng là bắt buộc'],
      min: [1, 'Số lượng phải ít nhất 1'],
    },

    // Giá tại thời điểm đặt hàng (snapshot, không thay đổi theo menu)
    price: {
      type: Number,
      required: [true, 'Giá là bắt buộc'],
      min: [0, 'Giá không được âm'],
    },
  },
  { _id: false } // Không tạo _id riêng cho sub-document
);

// Schema chính cho đơn hàng
const orderSchema = new mongoose.Schema(
  {
    // Tên khách hàng — bắt buộc
    customerName: {
      type: String,
      required: [true, 'Tên khách hàng là bắt buộc'],
      trim: true,
      maxlength: [100, 'Tên không được quá 100 ký tự'],
    },

    // Danh sách các món trong đơn — ít nhất 1 item
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: 'Đơn hàng phải có ít nhất 1 món',
      },
    },

    // Tổng tiền — tính từ items
    totalPrice: {
      type: Number,
      required: [true, 'Tổng tiền là bắt buộc'],
      min: [0, 'Tổng tiền không được âm'],
    },

    // Trạng thái đơn hàng — mặc định "pending"
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'delivered'],
        message: 'Trạng thái phải là: pending, confirmed, hoặc delivered',
      },
      default: 'pending',
    },

    // Ghi chú — tùy chọn
    note: {
      type: String,
      trim: true,
      maxlength: [300, 'Ghi chú không được quá 300 ký tự'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
