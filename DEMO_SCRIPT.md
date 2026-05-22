# Demo Script - GitHub Actions FullStack Deployment

## 1. Mo dau
- Gioi thieu de tai: Triển khai GitHub Actions cho FullStack Deployment.
- Noi rang du an khong dung Docker.
- Noi cu the: frontend deploy tren Vercel, backend deploy tren Render, database dung MongoDB Atlas.

## 2. Giai thich cau truc du an
- Repo duoc tach thanh 2 phan: `frontend/` va `backend/`.
- `frontend/` chua app React + Vite.
- `backend/` chua Express API + MongoDB.
- GitHub Actions nam trong `.github/workflows/`.

## 3. Demo CI
### 3.1 Mo workflow CI
- Mo file `.github/workflows/ci.yml`.
- Noi:
  - Workflow chay khi `push` hoac `pull_request` vao `main` va `develop`.
  - Co 2 job rieng: `test-frontend` va `test-backend`.
  - Frontend chay `npm ci`, `npm run lint`, `npm test`, `npm run build`.
  - Backend chay `npm ci`, `npm run lint`, `npm test`, va kiem tra cu phap `node --check`.

### 3.2 Demo tren terminal
Chay:
```powershell
cd "D:\Kỹ thuật web\Seminar\Seminar_food-Order\frontend"
npm run lint
npm test
npm run build

cd "D:\Kỹ thuật web\Seminar\Seminar_food-Order\backend"
npm run lint
npm test
```

Noi ket qua:
- Frontend lint pass.
- Backend lint pass.
- Test backend pass.
- Test frontend pass.
- Build frontend tao thu muc `dist/`.

## 4. Demo CD
### 4.1 Mo workflow CD
- Mo file `.github/workflows/deploy.yml`.
- Noi:
  - Workflow chi chay sau khi CI thanh cong tren `main` hoac chay thu cong bang `workflow_dispatch`.
  - Co 2 job deploy rieng: frontend va backend.
  - Frontend deploy bang deploy hook cua Vercel.
  - Backend deploy bang deploy hook cua Render.
  - Khong dung Docker.

### 4.2 Noi ve secrets
- `VERCEL_DEPLOY_HOOK_URL`: hook de kich hoat deploy frontend.
- `RENDER_DEPLOY_HOOK_URL`: hook de kich hoat deploy backend.

### 4.3 Noi ve cau hinh deploy
- `frontend/vercel.json`: cau hinh Vercel SPA, rewrite ve `index.html`.
- `render.yaml`: cau hinh backend service tren Render.
- `frontend/.env`: `VITE_API_URL` tro ve URL backend Render.

## 5. Demo hang that
### 5.1 Frontend
- Mo URL Vercel.
- Noi: day la ban production cua frontend.
- Dang nhap / dang ky / mo trang menu.
- Kiem tra giao dien load du lieu tu API.

### 5.2 Backend
- Mo URL Render.
- Noi: backend da deploy thanh cong va tra JSON.
- Kiem tra route goc `/` hoac API `/api/foods`.

## 6. Kiem chung ket noi frontend - backend
- Mo DevTools tab Network.
- Thuc hien mot hanh dong tren frontend, vi du load menu hoac dat hang.
- Noi:
  - Request di toi backend Render.
  - Frontend nhan du lieu thong qua `VITE_API_URL`.

## 7. Ket luan
- Du an dap ung seminar vi co:
  - FullStack tach frontend/backend.
  - GitHub Actions cho CI va CD.
  - Lint, test, build.
  - Deploy frontend tren Vercel, backend tren Render.
  - Khong dung Docker.

## 8. Cau noi ngan khi bi hoi
> "Em tach CI va CD thanh 2 workflow rieng. CI chay lint, test va build cho frontend/backend. CD chi deploy khi CI thanh cong. Frontend deploy tren Vercel, backend deploy tren Render, va frontend goi backend qua VITE_API_URL."
