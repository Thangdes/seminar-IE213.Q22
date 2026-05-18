import { useState } from 'react';
import { formatPrice } from '../../../constants/menu.js';
import { nextStatus, statusMap } from '../../../constants/orders.js';

const formatDate = (date) => new Date(date).toLocaleString('vi-VN');

const OrderList = ({ orders, onUpdateStatus, onDelete, canManage = false }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!orders || orders.length === 0) {
    return (
      <div className="empty-state">
        <p>Chưa có đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="order-list">
      {orders.map((order) => {
        const status = statusMap[order.status] || statusMap.pending;
        const isExpanded = expandedId === order._id;
        const next = nextStatus[order.status];
        const owner = order.user?.fullName || order.user?.displayName || order.user?.email;

        return (
          <article key={order._id} className="order-card">
            <button
              type="button"
              className="order-header"
              onClick={() => setExpandedId(isExpanded ? null : order._id)}
              aria-expanded={isExpanded}
            >
              <div className="order-info">
                <h3 className="order-customer">{order.customerName}</h3>
                {canManage && owner && <span className="order-owner">{owner}</span>}
                <span className="order-date">{formatDate(order.createdAt)}</span>
              </div>
              <div className="order-meta">
                <span className={`status-badge ${status.className}`}>{status.label}</span>
                <span className="order-total">{formatPrice(order.totalPrice)}</span>
              </div>
            </button>

            {isExpanded && (
              <div className="order-details">
                <div className="order-items">
                  <h4>Chi tiết đơn hàng</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>
                        {item.foodName} x {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                {order.note && <p className="order-note">Ghi chú: {order.note}</p>}
                {canManage ? (
                  <div className="order-actions">
                    {next && (
                      <button className="btn btn-primary" onClick={() => onUpdateStatus(order._id, next)}>
                        Chuyển sang {statusMap[next].label}
                      </button>
                    )}
                    <button className="btn btn-danger-outline" onClick={() => onDelete(order._id)}>
                      Xóa đơn
                    </button>
                  </div>
                ) : (
                  <p className="order-note">Trạng thái đơn sẽ tự cập nhật khi admin duyệt.</p>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default OrderList;
