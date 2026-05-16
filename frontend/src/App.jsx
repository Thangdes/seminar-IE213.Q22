// App.jsx — Component gốc với React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import MenuPage from './pages/MenuPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';

const App = () => {
  return (
    <BrowserRouter>
      {/* Navbar hiển thị trên mọi trang */}
      <Navbar />

      {/* Định nghĩa các route */}
      <Routes>
        {/* Trang chủ — Menu món ăn */}
        <Route path="/" element={<MenuPage />} />

        {/* Trang quản lý đơn hàng */}
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
