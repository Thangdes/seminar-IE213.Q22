# Seminar Demo Guide - GitHub Actions FullStack Deployment

Tài liệu này là bản hướng dẫn demo đầy đủ cho seminar. Mục tiêu là: mở đúng file, gõ đúng lệnh, nhìn đúng chỗ, và nói đúng câu. Nếu bạn làm theo từng bước dưới đây, bạn có thể demo gần như không cần nghĩ thêm.

## 1. Mục Tiêu Demo

- Chứng minh dự án là một hệ thống FullStack thật.
- Chứng minh có frontend, backend, database.
- Chứng minh có CI: lint, test, build.
- Chứng minh có CD: deploy thật lên Vercel và Render.
- Chứng minh frontend production gọi backend production qua `VITE_API_URL`.

## 2. Chuẩn Bị Trước Khi Demo

Mở sẵn các tab sau:

- [README.md](../README.md)
- [backend/server.js](../backend/server.js)
- [frontend/src/services/api.js](../frontend/src/services/api.js)
- [frontend/.env](../frontend/.env)
- [frontend/src/pages/MenuPage.jsx](../frontend/src/pages/MenuPage.jsx)
- [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)
- [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
- GitHub repo tab Actions
- Vercel dashboard
- Render dashboard
- Một cửa sổ PowerShell

## 3. Script Nói Mở Đầu

Bạn có thể đọc nguyên văn:

> Em xin trình bày đề tài triển khai GitHub Actions cho FullStack Deployment. Dự án này dùng MERN Stack, frontend là React + Vite, backend là Express + Mongoose, và database là MongoDB Atlas. Em tách riêng CI và CD để kiểm tra code trước, rồi mới deploy thật lên Vercel và Render.

## 4. Demo Theo Thứ Tự Chuẩn

### Bước 1 - Mở README để giới thiệu tổng quan

**Mở gì**

- [README.md](../README.md)

**Nhìn gì**

- Mô tả dự án
- Tech Stack
- CI/CD Pipeline
- Secrets
- Cấu trúc dự án

**Nói gì**

- Đây là ứng dụng đặt món ăn trực tuyến.
- Em dùng MERN Stack.
- Frontend deploy trên Vercel, backend deploy trên Render.
- Database là MongoDB Atlas.
- Có tài liệu mô tả rõ luồng chạy local và production.

**Ý nghĩa**

- Bạn đang chứng minh đây là một project fullstack có tổ chức, không phải code rời rạc.

### Bước 2 - Mở backend để giải thích kiến trúc

**Mở gì**

- [backend/server.js](../backend/server.js)

**Nhìn gì**

- `dotenv.config()`
- `mongoose.connect(process.env.MONGODB_URI)`
- `app.use('/api/auth', ...)`
- `app.use('/api/users', ...)`
- `app.use('/api/foods', ...)`
- `app.use('/api/orders', ...)`
- route gốc `/`

**Nói gì**

- Backend của em là Express API.
- Backend kết nối MongoDB Atlas bằng biến môi trường.
- Em tách route theo chức năng: auth, users, foods, orders.
- Route gốc trả JSON để kiểm tra server sống.

**Nếu bị hỏi backend làm gì**

- Backend xử lý đăng nhập, quản lý món, tạo đơn, cập nhật đơn và trả dữ liệu cho frontend.

### Bước 3 - Mở frontend API để giải thích cách gọi backend

**Mở gì**

- [frontend/src/services/api.js](../frontend/src/services/api.js)

**Nhìn gì**

- `baseURL: import.meta.env.VITE_API_URL || ''`
- interceptor gắn token
- `getFoods`
- `createOrder`
- `loginUser`
- `getOrders`

**Nói gì**

- Frontend không hard-code backend.
- Frontend lấy địa chỉ backend từ biến môi trường.
- Khi người dùng đăng nhập, token sẽ được gắn vào Authorization header.
- Tất cả API đều đi qua cùng một chỗ để dễ bảo trì.

### Bước 4 - Mở file env production để chốt đường nối frontend-backend

**Mở gì**

- [frontend/.env](../frontend/.env)

**Nhìn gì**

- `VITE_API_URL=https://seminar-ie213-q22-1.onrender.com`

**Nói gì**

- Đây là backend production trên Render.
- Frontend production sẽ gọi thẳng về URL này.
- Vì vậy frontend và backend nối được sau khi deploy.

### Bước 5 - Mở trang Menu để show luồng người dùng

**Mở gì**

- [frontend/src/pages/MenuPage.jsx](../frontend/src/pages/MenuPage.jsx)

**Nhìn gì**

- `useEffect` gọi `fetchFoods()`
- `getFoods()`
- `handleAddToCart`
- `handlePlaceOrder`
- `getAuthUser()`
- `createOrder(...)`

**Nói gì**

- Khi vào trang menu, frontend sẽ gọi API lấy danh sách món.
- Người dùng bấm thêm món, giỏ hàng cập nhật ngay ở frontend.
- Khi đặt hàng, frontend sẽ gửi dữ liệu đơn sang backend.
- Nếu chưa đăng nhập thì hệ thống sẽ yêu cầu đăng nhập.

## 5. Demo CI Bằng Terminal

### Bước 6 - Kiểm tra repo đang sạch

Mở PowerShell ở thư mục gốc project và chạy:

```powershell
cd "D:\Kỹ thuật web\Seminar\Seminar_food-Order"
git status
```

**Nhìn gì**

- `On branch main`
- `nothing to commit, working tree clean`

**Nói gì**

- Đây là nhánh chính.
- Working tree clean nghĩa là không có thay đổi chưa commit.

### Bước 7 - Chạy CI local cho frontend

Chạy:

```powershell
cd "D:\Kỹ thuật web\Seminar\Seminar_food-Order\frontend"
npm run lint
npm test
npm run build
```

**Nhìn gì**

- `lint` pass
- `test` pass
- `build` pass
- có thư mục `dist`

**Nói gì**

- Frontend có kiểm tra cú pháp.
- Frontend có test tự động.
- Frontend build ra `dist` để chuẩn bị deploy.
- Đây là đúng luồng CI.

### Bước 8 - Chạy CI local cho backend

Chạy:

```powershell
cd "D:\Kỹ thuật web\Seminar\Seminar_food-Order\backend"
npm run lint
npm test
```

**Nhìn gì**

- `lint` pass
- `test` pass

**Nói gì**

- Backend cũng được kiểm tra riêng.
- Backend có lint và test để đảm bảo code chạy ổn.
- Như vậy CI không chỉ kiểm frontend mà cả backend.

## 6. Demo Workflow CI

### Bước 9 - Mở workflow CI

**Mở gì**

- [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

**Nhìn gì**

- trigger `push`, `pull_request`
- job `test-frontend`
- job `test-backend`
- `npm run lint`
- `npm test`
- `npm run build`

**Nói gì**

- CI của em chạy tự động khi push hoặc pull request.
- Frontend và backend được test thành hai job riêng.
- Mục tiêu của CI là phát hiện lỗi trước khi deploy.
- Em đã tách riêng để lỗi frontend không che lỗi backend.

## 7. Demo Workflow CD

### Bước 10 - Mở workflow CD

**Mở gì**

- [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)

**Nhìn gì**

- `workflow_run`
- `workflow_dispatch`
- job `Deploy Frontend to Vercel`
- job `Deploy Backend to Render`
- `curl -X POST`
- secret `VERCEL_DEPLOY_HOOK_URL`
- secret `RENDER_DEPLOY_HOOK_URL`

**Nói gì**

- CD chỉ chạy sau khi CI thành công.
- Em dùng deploy hook để kích hoạt deploy thật.
- Frontend deploy qua Vercel hook.
- Backend deploy qua Render hook.
- Workflow còn in HTTP status và response body để dễ debug.

### Bước 11 - Test deploy hook bằng terminal nếu cần

Test Vercel hook:

```powershell
curl.exe -i -X POST "PASTE_VERCEL_HOOK_URL_HERE"
```

Test Render hook:

```powershell
curl.exe -i -X POST "PASTE_RENDER_HOOK_URL_HERE"
```

**Nhìn gì**

- `HTTP/1.1 201 Created` hoặc `200 OK`
- JSON có `job.id`
- status 2xx

**Nói gì**

- Vercel đã nhận request deploy.
- Render đã nhận request deploy.
- Có job id nghĩa là hook đã hoạt động.

## 8. Demo GitHub Actions Success

### Bước 12 - Mở GitHub Actions

**Mở gì**

- GitHub repo tab Actions
- workflow `CD - Food Ordering App`

**Nhìn gì**

- run gần nhất
- job `Deploy Frontend to Vercel`
- job `Deploy Backend to Render`
- dấu xanh ở cả hai job

**Nói gì**

- Đây là bằng chứng pipeline chạy thành công.
- Frontend và backend đều được deploy tự động.
- Em đã tách rõ CI và CD.

## 9. Demo Production Thật

### Bước 13 - Mở Vercel

**Mở gì**

- Vercel dashboard
- project frontend
- Deployments

**Nhìn gì**

- deployment mới
- domain production

**Nói gì**

- Đây là frontend production.
- Mỗi lần CI/CD chạy thành công, Vercel sẽ nhận deployment mới.

### Bước 14 - Mở Render

**Mở gì**

- Render dashboard
- service backend
- Deploys

**Nhìn gì**

- deploy thành công
- logs có kết nối MongoDB Atlas

**Nói gì**

- Đây là backend production.
- Backend kết nối MongoDB Atlas và phục vụ API thật.

### Bước 15 - Demo trên web production

Mở frontend production và làm:

- vào trang menu
- bấm thêm món vào giỏ
- đăng nhập nếu cần
- đặt hàng

**Nói gì**

- Đây là frontend production đang chạy thật.
- Dữ liệu menu được lấy từ backend.
- Khi đặt hàng, frontend gửi dữ liệu sang backend.

Mở backend production và làm:

- mở route gốc `/`
- hoặc `/api/foods`

**Nói gì**

- Backend đang chạy thật trên Render.
- Đây là API production mà frontend sử dụng.

## 10. Demo Network Để Chứng Minh Frontend Gọi Backend

### Bước 16 - Mở DevTools Network

**Làm gì**

1. Mở trang frontend production.
2. Bấm `F12` để mở DevTools.
3. Chuyển sang tab `Network`.
4. Reload trang bằng `Ctrl+R`.
5. Tìm request tên `foods` hoặc `orders`.
6. Bấm vào request đó.

**Nhìn gì**

- `Request URL`
- `Status`
- `Response`

**Nói gì**

- Request URL đang trỏ tới domain Render.
- Status 200 nghĩa là API hoạt động.
- Response có dữ liệu món hoặc đơn hàng.
- Như vậy frontend production đang gọi đúng backend production.

## 11. Script Nói Theo Từng File

### Khi mở backend/server.js

- Đây là điểm khởi đầu của backend.
- Em đọc biến môi trường, kết nối MongoDB, rồi đăng ký các route.

### Khi mở frontend/src/services/api.js

- Đây là nơi tập trung toàn bộ API call.
- Em không hard-code backend mà lấy từ env.

### Khi mở frontend/src/pages/MenuPage.jsx

- Đây là trang chính của người dùng.
- Trang này load dữ liệu, xử lý giỏ hàng và đặt đơn.

### Khi mở workflows

- CI là kiểm tra.
- CD là deploy.
- Em tách thành hai workflow để rõ ràng và dễ bảo trì.

## 12. Bản Nói Ngắn 3-5 Phút

Bạn có thể đọc nguyên văn:

> Em xây dựng một ứng dụng đặt món theo kiến trúc MERN. Frontend là React + Vite, backend là Express + Mongoose, và database là MongoDB Atlas. Em tách riêng CI và CD trong GitHub Actions. CI sẽ chạy lint, test và build cho cả frontend và backend. Sau đó CD mới kích hoạt deploy hook để đưa frontend lên Vercel và backend lên Render. Frontend không hard-code backend mà dùng biến môi trường VITE_API_URL, nên khi lên production chỉ cần đổi env là hệ thống gọi đúng API thật. Em cũng có demo trực tiếp trên giao diện, thêm món, tạo đơn, và kiểm tra request network để chứng minh frontend đang gọi đúng backend production.

## 13. Câu Hỏi Thường Gặp

### Hỏi: CI là gì?

- CI là kiểm tra code tự động bằng lint, test, build.

### Hỏi: CD là gì?

- CD là deploy tự động sau khi CI pass.

### Hỏi: Vì sao không dùng Docker?

- Vì seminar này em tập trung vào GitHub Actions, Vercel và Render để demo ngắn gọn và dễ trình bày.

### Hỏi: Frontend biết backend ở đâu bằng cách nào?

- Bằng biến môi trường `VITE_API_URL`.

### Hỏi: Backend có kết nối database thật không?

- Có, backend kết nối MongoDB Atlas bằng `MONGODB_URI`.

## 14. Kết Bài

Bạn nói:

> Về mặt kiến trúc và quy trình, dự án của em đáp ứng đúng đề tài FullStack Deployment: có frontend, backend, database, CI và CD. Em cũng đã triển khai deploy thật trên Vercel và Render, đồng thời dùng GitHub Actions để tự động hóa quá trình kiểm tra và triển khai.
