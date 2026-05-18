import { useEffect, useMemo, useState } from 'react';
import FilterBar from '../components/ui/FilterBar.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import OrderList from '../features/orders/components/OrderList.jsx';
import OrderStats from '../features/orders/components/OrderStats.jsx';
import { buildOrderStats, statusFilters } from '../constants/orders.js';
import { getOrders, reviewOrder } from '../services/api.js';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewSubmittingId, setReviewSubmittingId] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      if (!Array.isArray(res.data?.data)) {
        throw new Error('INVALID_API_RESPONSE');
      }
      setOrders(res.data.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Vui lòng đăng nhập để xem danh sách đơn hàng của bạn.');
        return;
      }
      setError('Không thể tải danh sách đơn hàng');
      setOrders([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(
    () => (statusFilter === 'all' ? orders : orders.filter((order) => order.status === statusFilter)),
    [orders, statusFilter],
  );
  const stats = buildOrderStats(orders);

  const handleSubmitReview = async (orderId, reviewData) => {
    try {
      setReviewSubmittingId(orderId);
      const res = await reviewOrder(orderId, reviewData);
      setOrders((prev) => prev.map((order) => (order._id === orderId ? res.data.data : order)));
      setSuccessMsg('Đã lưu đánh giá đơn hàng.');
      setError('');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lưu đánh giá đơn hàng');
    } finally {
      setReviewSubmittingId('');
    }
  };

  return (
    <main className="page-container">
      <PageHero
        eyebrow="Đơn hàng của tôi"
        title="Theo dõi đơn hàng"
        subtitle="Trạng thái đơn được đồng bộ theo từng bước xử lý của OrderUp."
        compact
      >
        <button className="btn btn-secondary" onClick={fetchOrders}>
          Làm mới
        </button>
      </PageHero>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={() => setError('')} className="alert-close" aria-label="Đóng thông báo">
            Đóng
          </button>
        </div>
      )}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <OrderStats stats={stats} />

      <FilterBar
        items={statusFilters}
        activeValue={statusFilter}
        counts={stats}
        ariaLabel="Lọc trạng thái đơn hàng"
        onChange={setStatusFilter}
      />

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Đang tải đơn hàng...</p>
        </div>
      ) : (
        <OrderList
          orders={filteredOrders}
          onSubmitReview={handleSubmitReview}
          reviewSubmittingId={reviewSubmittingId}
        />
      )}
    </main>
  );
};

export default OrdersPage;
