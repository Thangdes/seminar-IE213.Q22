// models/Food.js — Mongoose schema cho món ăn
import mongoose from 'mongoose';

// Định nghĩa schema cho collection "foods"
const foodSchema = new mongoose.Schema(
  {
    // Tên món ăn — bắt buộc, cắt khoảng trắng thừa
    name: {
      type: String,
      required: [true, 'Tên món ăn là bắt buộc'],
      trim: true,
      maxlength: [100, 'Tên món ăn không được quá 100 ký tự'],
    },

    // Mô tả món ăn — tùy chọn
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Mô tả không được quá 500 ký tự'],
      default: '',
    },

    // Giá tiền — bắt buộc, phải lớn hơn 0
    price: {
      type: Number,
      required: [true, 'Giá món ăn là bắt buộc'],
      min: [1000, 'Giá phải ít nhất 1,000 VNĐ'],
    },

    // Danh mục — bắt buộc, chỉ nhận các giá trị cố định
    category: {
      type: String,
      required: [true, 'Danh mục là bắt buộc'],
      enum: {
        values: ['appetizer', 'main', 'dessert', 'drink'],
        message: 'Danh mục phải là: appetizer, main, dessert, hoặc drink',
      },
    },

    // URL ảnh — mặc định dùng ảnh placeholder
    image: {
      type: String,
      default: 'https://placehold.co/400x300/FF6B35/white?text=Food+Image',
    },
  },
  {
    // Tự động thêm createdAt và updatedAt
    timestamps: true,
  }
);

// Tạo và export model từ schema
const Food = mongoose.model('Food', foodSchema);
export default Food;
