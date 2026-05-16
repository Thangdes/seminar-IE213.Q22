// pages/MenuPage.jsx — Trang menu + quản lý món ăn + giỏ hàng
import { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard.jsx';
import FoodForm from '../components/FoodForm.jsx';
import { getFoods, createFood, updateFood, deleteFood, createOrder } from '../services/api.js';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' ₫';

const MenuPage = () => {
  // ===== STATE =====
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [filter, setFilter] = useState('all');
  const [customerName, setCustomerName] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  // ===== FETCH FOODS KHI COMPONENT MOUNT =====
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

  // ===== CRUD HANDLERS =====
  const handleAddFood = async (data) => {
    try {
      await createFood(data);
      setShowForm(false);
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi thêm món ăn');
    }
  };

  const handleUpdateFood = async (data) => {
    try {
      await updateFood(editingFood._id, data);
      setEditingFood(null);
      setShowForm(false);
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật');
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa món ăn này?')) return;
    try {
      await deleteFood(id);
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi xóa');
    }
  };

  // ===== GIỎ HÀNG =====
  const handleAddToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === food._id);
      if (existing) {
        return prev.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
    setShowCart(true);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ===== ĐẶT HÀNG =====
  const handlePlaceOrder = async () => {
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
      setOrderSuccess('🎉 Đặt hàng thành công!');
      setTimeout(() => setOrderSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi đặt hàng');
    }
  };

  // ===== LỌC THEO CATEGORY =====
  const filteredFoods = filter === 'all' ? foods : foods.filter((f) => f.category === filter);

  const categories = [
    { value: 'all', label: 'Tất cả', icon: '🍽️' },
    { value: 'appetizer', label: 'Khai vị', icon: '🥗' },
    { value: 'main', label: 'Món chính', icon: '🍖' },
    { value: 'dessert', label: 'Tráng miệng', icon: '🍰' },
    { value: 'drink', label: 'Đồ uống', icon: '🥤' },
  ];

  return (
    <div className="page-container">
      {/* ===== HEADER + ACTIONS ===== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🍽️ Thực đơn</h1>
          <p className="page-subtitle">Khám phá các món ăn ngon tuyệt vời</p>
        </div>
        <div className="header-actions">
          <button id="open-food-form" className="btn btn-primary"
            onClick={() => { setEditingFood(null); setShowForm(true); }}>
            ➕ Thêm món mới
          </button>
          <button id="toggle-cart" className="btn btn-cart"
            onClick={() => setShowCart(!showCart)}>
            🛒 Giỏ hàng ({cart.reduce((s, i) => s + i.quantity, 0)})
          </button>
        </div>
      </div>

      {/* ===== THÔNG BÁO ===== */}
      {error && (
        <div className="alert alert-error">
          ❌ {error}
          <button onClick={() => setError('')} className="alert-close">✕</button>
        </div>
      )}
      {orderSuccess && <div className="alert alert-success">{orderSuccess}</div>}

      {/* ===== BỘ LỌC CATEGORY ===== */}
      <div className="filter-bar">
        {categories.map((cat) => (
          <button key={cat.value}
            className={`filter-btn ${filter === cat.value ? 'active' : ''}`}
            onClick={() => setFilter(cat.value)}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* ===== FOOD GRID ===== */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải thực đơn...</p>
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '48px' }}>🍔</span>
          <p>Chưa có món ăn nào. Hãy thêm món mới!</p>
        </div>
      ) : (
        <div className="food-grid">
          {filteredFoods.map((food) => (
            <FoodCard key={food._id} food={food}
              onEdit={(f) => { setEditingFood(f); setShowForm(true); }}
              onDelete={handleDeleteFood}
              onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}

      {/* ===== GIỎ HÀNG SIDEBAR ===== */}
      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>🛒 Giỏ hàng</h2>
              <button className="close-btn" onClick={() => setShowCart(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-state"><p>Giỏ hàng trống</p></div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item._id} className="cart-item">
                      <div className="cart-item-info">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-price">{formatPrice(item.price)}</span>
                      </div>
                      <div className="cart-item-qty">
                        <button onClick={() => updateCartQty(item._id, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQty(item._id, 1)}>+</button>
                        <button className="remove-btn" onClick={() => removeFromCart(item._id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <input type="text" placeholder="Tên khách hàng *" value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)} className="cart-input" />
                  <input type="text" placeholder="Ghi chú (tùy chọn)" value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)} className="cart-input" />
                  <div className="cart-total">
                    <span>Tổng cộng:</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>
                  <button id="place-order" className="btn btn-primary btn-full"
                    onClick={handlePlaceOrder}>
                    📦 Đặt hàng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== MODAL FORM ===== */}
      {showForm && (
        <FoodForm food={editingFood}
          onSubmit={editingFood ? handleUpdateFood : handleAddFood}
          onClose={() => { setShowForm(false); setEditingFood(null); }} />
      )}
    </div>
  );
};

export default MenuPage;
