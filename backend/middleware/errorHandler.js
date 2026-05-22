// middleware/errorHandler.js — Middleware xử lý lỗi tập trung
// Mọi error từ controller sẽ được chuyển đến đây qua next(error)

const errorHandler = (err, req, res, _next) => {
  // Log lỗi chi tiết ra console để debug
  console.error('❌ Error:', err.message);

  // Mặc định status 500 (Internal Server Error)
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Lỗi máy chủ nội bộ';

  // ===== XỬ LÝ LỖI MONGOOSE VALIDATION =====
  // Khi dữ liệu không hợp lệ (thiếu required, sai enum, v.v.)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    // Gom tất cả message validation thành một chuỗi
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join('. ');
  }

  // ===== XỬ LÝ LỖI CAST ERROR =====
  // Khi ID không đúng format ObjectId (24 ký tự hex)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `ID không hợp lệ: ${err.value}`;
  }

  // ===== XỬ LÝ LỖI DUPLICATE KEY =====
  // Khi vi phạm unique constraint (nếu có)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue).join(', ');
    message = `Giá trị trùng lặp cho trường: ${field}`;
  }

  // Trả về response JSON chuẩn
  res.status(statusCode).json({
    success: false,
    message,
    // Chỉ hiện stack trace trong môi trường development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
