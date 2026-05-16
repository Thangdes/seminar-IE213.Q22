// components/OrderList.jsx — Danh sách đơn hàng với badge trạng thái
import { useState } from 'react';

// Map trạng thái sang tiếng Việt + màu sắc
const statusMap = {
  pending: { label: 'Chờ xử lý', color: '#F9C74F', bg: '#FFF8E1', icon: '⏳' },
  confirmed: { label: 'Đã xác nhận', color: '#4ECDC4', bg: '#E0F7FA', icon: '✅' },
  delivered: { label: 'Đã giao', color: '#2D936C', bg: '#E8F5E9', icon: '🚀' },
};

// Luồng trạng thái tiếp theo
const nextStatus = { pending: 'confirmed', confirmed: 'delivered' };

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
const formatDate = (date) => new Date(date).toLocaleString('vi-VN');

const OrderList = ({ orders, onUpdateStatus, onDelete }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!orders || orders.length === 0) {
    return (
      <div className="empty-state">
        <span style={{ fontSize: '48px' }}>📭</span>
        <p>Chưa có đơn hàng nào</p>
      </div>
    );
  }

  return (
    <div className="order-list">
      {orders.map((order) => {
        const status = statusMap[order.status] || statusMap.pending;
        const isExpanded = expandedId === order._id;
        const next = nextStatus[order.status];

        return (
          <div key={order._id} className="order-card">
            {/* Header */}
            <div className="order-header" onClick={() => setExpandedId(isExpanded ? null : order._id)}>
              <div className="order-info">
                <h3 className="order-customer">👤 {order.customerName}</h3>
                <span className="order-date">{formatDate(order.createdAt)}</span>
              </div>
              <div className="order-meta">
                <span className="status-badge" style={{
                  color: status.color, backgroundColor: status.bg,
                  border: `1px solid ${status.color}20`,
                }}>
                  {status.icon} {status.label}
                </span>
                <span className="order-total">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>

            {/* Chi tiết (mở rộng) */}
            {isExpanded && (
              <div className="order-details">
                <div className="order-items">
                  <h4>📋 Chi tiết đơn hàng:</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>{item.foodName} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                {order.note && (
                  <p className="order-note">📝 Ghi chú: {order.note}</p>
                )}
                <div className="order-actions">
                  {next && (
                    <button className="btn btn-success"
                      onClick={() => onUpdateStatus(order._id, next)}>
                      Chuyển → {statusMap[next].icon} {statusMap[next].label}
                    </button>
                  )}
                  <button className="btn btn-danger-outline"
                    onClick={() => onDelete(order._id)}>
                    🗑️ Xóa đơn
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderList;
