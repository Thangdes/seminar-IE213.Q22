# 🍔 Food Ordering Web App — MERN Stack

> Ứng dụng đặt món ăn trực tuyến xây dựng bằng MERN Stack (MongoDB, Express, React, Node.js).
> Dự án seminar: **"Triển khai GitHub Actions cho FullStack Deployment trong ứng dụng MERN Stack"**

## 📸 Demo

| Menu Page | Orders Page |
|-----------|-------------|
| Grid món ăn + giỏ hàng | Thống kê + quản lý đơn |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + React Router DOM + Axios |
| Backend | Express.js + Mongoose |
| Database | MongoDB Atlas |
| CI/CD | GitHub Actions |
| Deploy | Vercel (frontend) + Render (backend) |

## 📁 Cấu trúc dự án

```
seminar-food/
├── backend/
│   ├── controllers/          # Logic xử lý request
│   │   ├── foodController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── errorHandler.js   # Xử lý lỗi tập trung
│   ├── models/               # Mongoose schemas
│   │   ├── Food.js
│   │   └── Order.js
│   ├── routes/               # API endpoints
│   │   ├── foods.js
│   │   └── orders.js
│   ├── .env.example
│   ├── package.json
│   └── server.js             # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   ├── FoodCard.jsx
│   │   │   ├── FoodForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── OrderList.jsx
│   │   ├── pages/            # Route pages
│   │   │   ├── MenuPage.jsx
│   │   │   └── OrdersPage.jsx
│   │   ├── services/
│   │   │   └── api.js        # Axios API calls
│   │   ├── styles/
│   │   │   └── global.css    # CSS toàn cục
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD pipeline
└── README.md
```

## 🚀 Hướng dẫn chạy

### 1. Clone repo
```bash
git clone <repo-url>
cd seminar-food
```

### 2. Cấu hình Backend
```bash
cd backend
cp .env.example .env
# Sửa file .env: thêm MongoDB Atlas connection string
npm install
npm run dev
```

### 3. Cấu hình Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 4. Truy cập
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📋 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/foods` | Lấy tất cả món ăn |
| POST | `/api/foods` | Thêm món ăn mới |
| PUT | `/api/foods/:id` | Cập nhật món ăn |
| DELETE | `/api/foods/:id` | Xóa món ăn |
| GET | `/api/orders` | Lấy tất cả đơn hàng |
| POST | `/api/orders` | Tạo đơn hàng mới |
| PUT | `/api/orders/:id` | Cập nhật trạng thái |
| DELETE | `/api/orders/:id` | Xóa đơn hàng |

## 🔄 CI/CD Pipeline

GitHub Actions workflow tự động chạy khi push lên `main`:
1. **Build Frontend**: Install → Build → Verify dist/
2. **Verify Backend**: Install → Syntax check tất cả files

## 👨‍💻 Tác giả

Nguyen Van Quyen— Đại học Công nghệ Thông tin (UIT)
