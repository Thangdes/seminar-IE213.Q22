# Food Ordering Web App - MERN Stack

Ung dung dat mon an truc tuyen xay dung bang MERN Stack: MongoDB, Express, React, Node.js.

Du an seminar: **Trien khai GitHub Actions cho FullStack Deployment trong ung dung MERN Stack**.

## Tinh Nang Chinh

- User dang ky, dang nhap, cap nhat ho so ca nhan.
- User xem thuc don admin da dang, them mon vao gio hang va tao don hang.
- User xem danh sach don cua chinh minh. Trang thai don duoc dong bo theo cap nhat tu admin.
- Admin co giao dien rieng tai `/admin` de them, sua, xoa thuc don va duyet don hang.
- Thong ke trong ho so user lay truc tiep tu collection `orders`, khong con la so lieu nhap tay.

## Tai Khoan Admin

Tai khoan admin la co dinh, khong dang ky va khong doi qua giao dien user:

```text
Email: adminfood@gmail.com
Password: admin12345
```

Khi dang nhap bang tai khoan nay, frontend tu chuyen sang trang `/admin`.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + React Router DOM + Axios |
| Backend | Express.js + Mongoose |
| Database | MongoDB Atlas |
| Auth | Custom JWT |
| CI/CD | GitHub Actions |
| Deploy | Vercel frontend + Render backend |

## Cau Truc Du An

```text
seminar-food/
+-- backend/
|   +-- controllers/
|   |   +-- authController.js
|   |   +-- foodController.js
|   |   +-- orderController.js
|   |   +-- userController.js
|   +-- middleware/
|   |   +-- authMiddleware.js
|   |   +-- errorHandler.js
|   +-- models/
|   |   +-- Food.js
|   |   +-- Order.js
|   |   +-- User.js
|   +-- routes/
|   |   +-- auth.js
|   |   +-- foods.js
|   |   +-- orders.js
|   |   +-- users.js
|   +-- utils/
|   |   +-- authUtils.js
|   +-- .env.example
|   +-- package.json
|   +-- server.js
+-- frontend/
|   +-- src/
|   |   +-- components/
|   |   |   +-- layout/
|   |   |   |   +-- Navbar.jsx
|   |   |   +-- ui/
|   |   |       +-- FilterBar.jsx
|   |   |       +-- PageHero.jsx
|   |   +-- constants/
|   |   |   +-- menu.js
|   |   |   +-- orders.js
|   |   +-- features/
|   |   |   +-- menu/components/
|   |   |   |   +-- AdminMenuManager.jsx
|   |   |   |   +-- CartSidebar.jsx
|   |   |   |   +-- FoodCard.jsx
|   |   |   |   +-- FoodForm.jsx
|   |   |   |   +-- MenuGrid.jsx
|   |   |   +-- orders/components/
|   |   |   |   +-- OrderList.jsx
|   |   |   |   +-- OrderStats.jsx
|   |   |   +-- profile/components/
|   |   |       +-- ContactInfoCard.jsx
|   |   |       +-- PersonalInfoCard.jsx
|   |   |       +-- ProfileHeader.jsx
|   |   |       +-- SecurityCard.jsx
|   |   |       +-- SettingsCard.jsx
|   |   |       +-- ShoppingSummaryCard.jsx
|   |   |       +-- StatusBadge.jsx
|   |   +-- pages/
|   |   |   +-- AdminPage.jsx
|   |   |   +-- AuthPage.jsx
|   |   |   +-- MenuPage.jsx
|   |   |   +-- OrdersPage.jsx
|   |   |   +-- ProfilePage.jsx
|   |   +-- services/
|   |   |   +-- api.js
|   |   +-- styles/
|   |   |   +-- global.css
|   |   +-- utils/
|   |   |   +-- auth.js
|   |   +-- App.jsx
|   |   +-- main.jsx
|   +-- .env.example
|   +-- index.html
|   +-- package.json
|   +-- vite.config.js
+-- README.md
```

## Huong Dan Chay Local

### 1. Clone repo

```bash
git clone <repo-url>
cd seminar-food
```

### 2. Cau hinh va chay Backend

```bash
cd backend
cp .env.example .env
npm install
```

Cap nhat file `backend/.env`:

```env
PORT=5000
MONGODB_URI=<mongodb-atlas-connection-string>
JWT_SECRET=<your-secret>
NODE_ENV=development
```

Chay backend:

```bash
npm run dev
```

Backend API mac dinh chay tai:

```text
http://localhost:5000
```

### 3. Cau hinh va chay Frontend

Mo terminal khac:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Trong development, `VITE_API_URL` co the de trong vi Vite proxy `/api` sang `http://localhost:5000`.

Frontend mac dinh chay tai:

```text
http://localhost:5173
```

### 4. Build Frontend

```bash
cd frontend
npm run build
```

## Frontend Routes

| Route | Quyen | Mo ta |
|-------|-------|------|
| `/` | Public | Trang thuc don user nhin thay |
| `/login` | Public | Dang nhap user/admin |
| `/register` | Public | Dang ky tai khoan user |
| `/orders` | User | User xem don hang cua minh |
| `/profile` | User | User cap nhat ho so va xem tong quan don hang |
| `/admin` | Admin | Admin quan ly thuc don va duyet don |

## API Endpoints

Base URL local: `http://localhost:5000`

Nhung endpoint can dang nhap su dung header:

```http
Authorization: Bearer <accessToken>
```

### Auth

| Method | Endpoint | Body | Mo ta |
|--------|----------|------|-------|
| POST | `/api/auth/register` | `{ "email": string, "password": string }` | Dang ky user moi |
| POST | `/api/auth/login` | `{ "email": string, "password": string }` | Dang nhap user hoac admin |

Ghi chu:

- Email `adminfood@gmail.com` bi khoa dang ky vi la tai khoan admin co dinh.
- Token admin co `role: "admin"`.
- Token user co `role: "user"`.

### Users / Profile

| Method | Endpoint | Auth | Body | Mo ta |
|--------|----------|------|------|-------|
| GET | `/api/users/me` | User | none | Lay profile user va thong ke don hang |
| PATCH | `/api/users/me` | User | profile fields | Cap nhat profile user |
| PATCH | `/api/users/me/password` | User | `{ "currentPassword": string, "newPassword": string }` | Doi mat khau user |

Response user/profile khong bao gio bao gom `passwordHash`.

### Foods

| Method | Endpoint | Auth | Mo ta |
|--------|----------|------|-------|
| GET | `/api/foods` | Public | Lay tat ca mon an admin da dang |
| POST | `/api/foods` | Admin | Them mon an moi |
| PUT | `/api/foods/:id` | Admin | Cap nhat mon an |
| DELETE | `/api/foods/:id` | Admin | Xoa mon an |

### Orders

| Method | Endpoint | Auth | Mo ta |
|--------|----------|------|-------|
| GET | `/api/orders` | User/Admin | User lay don cua minh, admin lay tat ca don |
| POST | `/api/orders` | User | Tao don hang moi cho user dang dang nhap |
| PUT | `/api/orders/:id` | Admin | Admin cap nhat trang thai don |
| DELETE | `/api/orders/:id` | Admin | Admin xoa don |

Trang thai don hang hien co:

```text
pending -> confirmed -> delivered
```

## Luong Su Dung

### User

1. Dang ky tai khoan tai `/register`.
2. Dang nhap tai `/login`.
3. Chon mon tai `/`.
4. Dat hang trong gio hang.
5. Theo doi don tai `/orders`.
6. Xem tong quan mua sam tai `/profile`.

### Admin

1. Dang nhap bang tai khoan admin co dinh.
2. Vao `/admin`.
3. Them, sua, xoa thuc don.
4. Duyet don hang tu `Cho xu ly` sang `Da xac nhan`, roi `Da giao`.

## CI/CD Pipeline

GitHub Actions workflow tu dong chay khi push len `main`:

1. Build Frontend: install, build, verify `dist/`.
2. Verify Backend: install, syntax check.

## Tac Gia

Nguyen Van Quyen - Dai hoc Cong nghe Thong tin (UIT)
