# OrderUp - MERN Food Ordering App

OrderUp la ung dung dat mon an truc tuyen xay dung bang MERN Stack: MongoDB, Express, React, Node.js.

Du an mon hoc: **Trien khai GitHub Actions cho FullStack Deployment trong ung dung MERN Stack**.

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

GitHub Actions workflow tu dong chay khi push len `main` hoac chay thu cong bang `workflow_dispatch`:

1. Validate Frontend: install, build, verify `dist/`.
2. Validate Backend: install, syntax check.
3. Deploy Frontend: goi deploy hook cua Vercel.
4. Deploy Backend: goi deploy hook cua Render.

### Secret can cau hinh tren GitHub

| Secret | Mo ta |
|--------|-------|
| `VERCEL_DEPLOY_HOOK_URL` | Deploy hook cua project frontend tren Vercel |
| `RENDER_DEPLOY_HOOK_URL` | Deploy hook cua service backend tren Render |

### File cau hinh deployment

| File | Vai tro |
|------|--------|
| [vercel.json](vercel.json) | Cau hinh SPA rewrite va build output cho frontend |
| [render.yaml](render.yaml) | Khai bao backend service cho Render |

### Luong deploy

1. Push code len `main`.
2. GitHub Actions build va kiem tra ca frontend lan backend.
3. Neu pass, Actions kich hoat deploy hook cho Vercel va Render.
4. Frontend dung `VITE_API_URL` tro den backend da deploy tren Render.

### Cach cau hinh de deploy that

1. Tao frontend project tren Vercel va backend service tren Render.
2. Lay deploy hook URL cho tung service.
3. Vao GitHub repo -> Settings -> Secrets and variables -> Actions.
4. Tao 2 secret: `VERCEL_DEPLOY_HOOK_URL` va `RENDER_DEPLOY_HOOK_URL`.
5. Tren Render, dat `PORT`, `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`.
6. Tren Vercel, dat `VITE_API_URL` tro den URL backend tren Render.
7. Push code len `main` hoac chay workflow thu cong tu tab Actions.

### Checklist demo seminar

Ban co the trinh bay theo luong sau:

1. Code duoc push len GitHub.
2. GitHub Actions chay build frontend va kiem tra backend.
3. Neu hop le, workflow goi deploy hook de cap nhat frontend/backend.
4. Frontend production goi API backend qua `VITE_API_URL`.
5. MongoDB Atlas luu du lieu don hang va user.

## Muc do dap ung seminar

### Ve mat ly thuyet

Du an da dap ung cac y chinh cua de tai:

1. Trinh bay dung mo hinh FullStack gom frontend, backend, database.
2. The hien ro y tuong CI/CD bang GitHub Actions.
3. Co luong deploy cho ca frontend va backend.
4. Co moi truong production tach rieng voi development.
5. Co tai lieu mo ta day du luong chay va cau hinh.

### Ve mat ky thuat

Du an co cac thanh phan can thiet de demo that:

1. Backend Express ket noi MongoDB Atlas.
2. Frontend React goi API backend bang Axios.
3. Bien moi truong `VITE_API_URL` de tach local va production.
4. GitHub Actions build, kiem tra, va kich hoat deploy hook.
5. Vercel phu hop cho frontend SPA, Render phu hop cho backend Node.js.

### Nhung diem co the noi trong bao ve

1. Workflow khong chi build ma con co buoc deploy that.
2. Frontend va backend duoc tach doc lap nhung van lien ket qua API.
3. MongoDB Atlas dong vai tro backend data layer cho toan bo he thong.
4. Co cung cap file cau hinh rieng cho tung nen tang: `vercel.json` va `render.yaml`.

### Gioi han hien tai

1. Workflow deploy dang dung deploy hook thay vi GitHub Actions native integration.
2. Chuong trinh chua co test automation day du cho logic nghiep vu.
3. Khong co quan sat production nhu logging, monitoring, hoac rollback strategy.
4. Chua co IaC day du cho toan bo he thong, moi co blueprint cho Render va cau hinh Vercel.

## Kich ban trinh bay

Ban co the noi ngan gon theo thu tu sau:

1. Gioi thieu de tai va muc tieu: xay dung he thong dat mon FullStack co CI/CD.
2. Mo ta kien truc: React frontend, Express backend, MongoDB Atlas.
3. Trinh bay workflow GitHub Actions: validate frontend, validate backend, deploy Vercel, deploy Render.
4. Demo luong user/admin va cach API ket noi qua `VITE_API_URL`.
5. Ket luan: he thong da dap ung bai toan trien khai FullStack co tu dong hoa deploy.

## Cau tra loi ngan khi hoi ve tinh day du

Neu giang vien hoi "da dap ung day du chua?", ban co the tra loi:

"Ve mat kien truc va quy trinh, du an da dap ung dung de tai FullStack Deployment: co frontend, backend, database, va GitHub Actions tu dong validate va deploy. Neu trien khai tren moi truong that, chi can cau hinh them secrets va deploy hook cho Vercel, Render, va MongoDB Atlas."

## Tac Gia

Nguyen Van Quyen - Dai hoc Cong nghe Thong tin (UIT)
