import { useEffect, useMemo, useState } from 'react';
import FilterBar from '../components/ui/FilterBar.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import OrderList from '../features/orders/components/OrderList.jsx';
import OrderStats from '../features/orders/components/OrderStats.jsx';
import { buildOrderStats, statusFilters } from '../constants/orders.js';
import { getOrders } from '../services/api.js';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      if (err.response?.status === 401) {
        setError('Vui lòng đăng nhập để xem danh sách đơn hàng của bạn.');
        return;
      }
      setError('Không thể tải danh sách đơn hàng');
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

  return (
    <main className="page-container">
      <PageHero
        eyebrow="Đơn hàng của tôi"
        title="Theo dõi đơn hàng"
        subtitle="Trạng thái đơn được đồng bộ theo các cập nhật từ admin."
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
        <OrderList orders={filteredOrders} />
      )}
    </main>
  );
};

export default OrdersPage;
