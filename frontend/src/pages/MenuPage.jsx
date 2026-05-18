import { useEffect, useMemo, useState } from 'react';
import FilterBar from '../components/ui/FilterBar.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import CartSidebar from '../features/menu/components/CartSidebar.jsx';
import MenuGrid from '../features/menu/components/MenuGrid.jsx';
import { categories } from '../constants/menu.js';
import { createOrder, getFoods } from '../services/api.js';
import { getAuthUser } from '../utils/auth.js';

const MenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [filter, setFilter] = useState('all');
  const [customerName, setCustomerName] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await getFoods();
      setFoods(res.data.data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách món ăn. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === food._id);
      if (existing) {
        return prev.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
    setShowCart(true);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );
  };

  const handlePlaceOrder = async () => {
    if (!getAuthUser()) {
      setError('Vui lòng đăng nhập để đặt hàng. Mỗi tài khoản sẽ có danh sách đơn hàng riêng.');
      return;
    }

    if (!customerName.trim()) {
      setError('Vui lòng nhập tên khách hàng');
      return;
    }
    if (cart.length === 0) return;

    try {
      await createOrder({
        customerName: customerName.trim(),
        items: cart.map((item) => ({
          food: item._id,
          foodName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: cartTotal,
        note: orderNote,
      });
      setCart([]);
      setCustomerName('');
      setOrderNote('');
      setShowCart(false);
      setOrderSuccess('Đặt hàng thành công. Admin sẽ duyệt trạng thái đơn của bạn.');
      setTimeout(() => setOrderSuccess(''), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để đặt hàng.');
        return;
      }
      setError(err.response?.data?.message || 'Lỗi khi đặt hàng');
    }
  };

  const filteredFoods = useMemo(
    () => (filter === 'all' ? foods : foods.filter((food) => food.category === filter)),
    [filter, foods],
  );
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="page-container">
      <PageHero
        eyebrow="Menu seminar"
        title="Thực đơn hôm nay"
        subtitle="Chọn món admin đã đăng, thêm vào giỏ và tạo đơn nhanh cho buổi seminar."
      >
        <div className="header-actions">
          <button id="toggle-cart" className="btn btn-primary" onClick={() => setShowCart(true)}>
            Giỏ hàng ({cartCount})
          </button>
        </div>
      </PageHero>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={() => setError('')} className="alert-close" aria-label="Đóng thông báo">
            Đóng
          </button>
        </div>
      )}
      {orderSuccess && <div className="alert alert-success">{orderSuccess}</div>}

      <FilterBar
        items={categories}
        activeValue={filter}
        ariaLabel="Lọc danh mục món ăn"
        onChange={setFilter}
      />

      <MenuGrid foods={filteredFoods} loading={loading} onAddToCart={handleAddToCart} />

      {showCart && (
        <CartSidebar
          cart={cart}
          cartTotal={cartTotal}
          customerName={customerName}
          orderNote={orderNote}
          onClose={() => setShowCart(false)}
          onPlaceOrder={handlePlaceOrder}
          onRemove={(id) => setCart((prev) => prev.filter((item) => item._id !== id))}
          onUpdateQty={updateCartQty}
          setCustomerName={setCustomerName}
          setOrderNote={setOrderNote}
        />
      )}
    </main>
  );
};

export default MenuPage;
