// pages/OrdersPage.jsx — Trang quản lý đơn hàng
import { useState, useEffect } from 'react';
import OrderList from '../components/OrderList.jsx';
import { getOrders, updateOrder, deleteOrder } from '../services/api.js';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch đơn hàng khi mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data.data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateOrder(id, { status: newStatus });
      setSuccessMsg('Cập nhật trạng thái thành công!');
      setTimeout(() => setSuccessMsg(''), 2500);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật');
    }
  };

  // Xóa đơn hàng
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) return;
    try {
      await deleteOrder(id);
      setSuccessMsg('Đã xóa đơn hàng!');
      setTimeout(() => setSuccessMsg(''), 2500);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi xóa');
    }
  };

  // Lọc theo trạng thái
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const statusFilters = [
    { value: 'all', label: 'Tất cả', icon: '📋' },
    { value: 'pending', label: 'Chờ xử lý', icon: '⏳' },
    { value: 'confirmed', label: 'Đã xác nhận', icon: '✅' },
    { value: 'delivered', label: 'Đã giao', icon: '🚀' },
  ];

  // Thống kê nhanh
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">📦 Quản lý đơn hàng</h1>
          <p className="page-subtitle">Theo dõi và cập nhật trạng thái đơn hàng</p>
        </div>
        <button className="btn btn-outline" onClick={fetchOrders}>🔄 Làm mới</button>
      </div>

      {/* Thông báo */}
      {error && (
        <div className="alert alert-error">
          ❌ {error}
          <button onClick={() => setError('')} className="alert-close">✕</button>
        </div>
      )}
      {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}

      {/* Thống kê */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Tổng đơn</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">⏳ Chờ xử lý</span>
        </div>
        <div className="stat-card stat-confirmed">
          <span className="stat-number">{stats.confirmed}</span>
          <span className="stat-label">✅ Đã xác nhận</span>
        </div>
        <div className="stat-card stat-delivered">
          <span className="stat-number">{stats.delivered}</span>
          <span className="stat-label">🚀 Đã giao</span>
        </div>
      </div>

      {/* Bộ lọc trạng thái */}
      <div className="filter-bar">
        {statusFilters.map((sf) => (
          <button key={sf.value}
            className={`filter-btn ${statusFilter === sf.value ? 'active' : ''}`}
            onClick={() => setStatusFilter(sf.value)}>
            {sf.icon} {sf.label}
            {sf.value !== 'all' && (
              <span className="filter-count">{stats[sf.value]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải đơn hàng...</p>
        </div>
      ) : (
        <OrderList orders={filteredOrders}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete} />
      )}
    </div>
  );
};

export default OrdersPage;
