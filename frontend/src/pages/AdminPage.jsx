import { useEffect, useMemo, useState } from 'react';
import FilterBar from '../components/ui/FilterBar.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import AdminMenuManager from '../features/menu/components/AdminMenuManager.jsx';
import AdminReviewList from '../features/orders/components/AdminReviewList.jsx';
import OrderList from '../features/orders/components/OrderList.jsx';
import OrderStats from '../features/orders/components/OrderStats.jsx';
import { buildOrderStats, statusFilters } from '../constants/orders.js';
import {
  createFood,
  deleteFood,
  deleteOrder,
  getFoods,
  getOrders,
  updateFood,
  updateOrder,
} from '../services/api.js';

const AdminPage = () => {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [foodLoading, setFoodLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchFoods();
    fetchOrders();
  }, []);

  const flashSuccess = (message) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const fetchFoods = async () => {
    try {
      setFoodLoading(true);
      const res = await getFoods();
      setFoods(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải thực đơn');
    } finally {
      setFoodLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrderLoading(true);
      const res = await getOrders();
      setOrders(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải đơn hàng');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleSubmitFood = async (data) => {
    try {
      if (editingFood) {
        await updateFood(editingFood._id, data);
        flashSuccess('Đã cập nhật món ăn.');
      } else {
        await createFood(data);
        flashSuccess('Đã thêm món ăn mới.');
      }
      setEditingFood(null);
      setShowForm(false);
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lưu món ăn');
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa món ăn này?')) return;
    try {
      await deleteFood(id);
      flashSuccess('Đã xóa món ăn.');
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xóa món ăn');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateOrder(id, { status: newStatus });
      flashSuccess('Cập nhật trạng thái thành công.');
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật đơn hàng');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) return;
    try {
      await deleteOrder(id);
      flashSuccess('Đã xóa đơn hàng.');
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi xóa đơn hàng');
    }
  };

  const filteredOrders = useMemo(
    () => (statusFilter === 'all' ? orders : orders.filter((order) => order.status === statusFilter)),
    [orders, statusFilter],
  );
  const stats = buildOrderStats(orders);
  const reviewedOrders = orders.filter((order) => order.review?.rating);
  const averageRating = reviewedOrders.length
    ? (reviewedOrders.reduce((sum, order) => sum + Number(order.review.rating), 0) / reviewedOrders.length).toFixed(1)
    : '0.0';

  return (
    <main className="page-container admin-page">
      <PageHero
        eyebrow="OrderUp Control"
        title="Trung tâm vận hành"
        subtitle="Quản lý thực đơn, xử lý đơn hàng và theo dõi phản hồi khách hàng từ một nơi."
        compact
      >
        <button className="btn btn-secondary" onClick={() => { fetchFoods(); fetchOrders(); }}>
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

      <AdminMenuManager
        foods={foods}
        loading={foodLoading}
        showForm={showForm}
        editingFood={editingFood}
        onAddClick={() => {
          setEditingFood(null);
          setShowForm(true);
        }}
        onCloseForm={() => {
          setShowForm(false);
          setEditingFood(null);
        }}
        onDelete={handleDeleteFood}
        onEdit={(food) => {
          setEditingFood(food);
          setShowForm(true);
        }}
        onSubmit={handleSubmitFood}
      />

      <section className="admin-section">
        <div className="admin-section-header">
          <div>
            <p className="eyebrow">Đơn hàng</p>
            <h2>Duyệt đơn của user</h2>
          </div>
        </div>

        <OrderStats stats={stats} />
        <FilterBar
          items={statusFilters}
          activeValue={statusFilter}
          counts={stats}
          ariaLabel="Lọc trạng thái đơn hàng vận hành"
          onChange={setStatusFilter}
        />

        {orderLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : (
          <OrderList
            orders={filteredOrders}
            canManage
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteOrder}
          />
        )}
      </section>

      <section className="admin-section">
        <div className="admin-section-header">
          <div>
            <p className="eyebrow">Đánh giá</p>
            <h2>Phản hồi từ khách hàng</h2>
          </div>
          <div className="review-admin-metrics">
            <span>{reviewedOrders.length} đánh giá</span>
            <strong>{averageRating}/5</strong>
          </div>
        </div>

        {orderLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải đánh giá...</p>
          </div>
        ) : (
          <AdminReviewList orders={orders} />
        )}
      </section>
    </main>
  );
};

export default AdminPage;
