import { useState } from 'react';
import { formatPrice } from '../../../constants/menu.js';
import { nextStatus, statusMap } from '../../../constants/orders.js';

const formatDate = (date) => new Date(date).toLocaleString('vi-VN');

const OrderList = ({
  orders,
  onUpdateStatus,
  onDelete,
  onSubmitReview,
  canManage = false,
  reviewSubmittingId = '',
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [reviewDrafts, setReviewDrafts] = useState({});

  const openOrder = (order) => {
    const isExpanded = expandedId === order._id;
    setExpandedId(isExpanded ? null : order._id);

    if (!isExpanded && !reviewDrafts[order._id]) {
      setReviewDrafts((prev) => ({
        ...prev,
        [order._id]: {
          rating: order.review?.rating || 5,
          comment: order.review?.comment || '',
        },
      }));
    }
  };

  const updateReviewDraft = (orderId, field, value) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [orderId]: {
        rating: 5,
        comment: '',
        ...(prev[orderId] || {}),
        [field]: value,
      },
    }));
  };

  const submitReview = (event, order) => {
    event.preventDefault();
    if (!onSubmitReview) return;

    const draft = reviewDrafts[order._id] || {
      rating: order.review?.rating || 5,
      comment: order.review?.comment || '',
    };

    onSubmitReview(order._id, {
      rating: Number(draft.rating),
      comment: draft.comment.trim(),
    });
  };

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
        const draft = reviewDrafts[order._id] || {
          rating: order.review?.rating || 5,
          comment: order.review?.comment || '',
        };

        return (
          <article key={order._id} className="order-card">
            <button
              type="button"
              className="order-header"
              onClick={() => openOrder(order)}
              aria-expanded={isExpanded}
            >
              <div className="order-info">
                <h3 className="order-customer">{order.customerName}</h3>
                {canManage && owner && <span className="order-owner">{owner}</span>}
                <span className="order-date">{formatDate(order.createdAt)}</span>
              </div>
              <div className="order-meta">
                <span className={`status-badge ${status.className}`}>{status.label}</span>
                {order.review?.rating && <span className="review-pill">{order.review.rating}/5</span>}
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

                {order.review?.rating && (
                  <div className="review-summary">
                    <div className="review-summary-heading">
                      <strong>{canManage ? 'Đánh giá của khách hàng' : 'Đánh giá của bạn'}</strong>
                      <span>{order.review.rating}/5 điểm</span>
                    </div>
                    {order.review.comment && <p>{order.review.comment}</p>}
                    {order.review.reviewedAt && <small>Cập nhật lúc {formatDate(order.review.reviewedAt)}</small>}
                  </div>
                )}

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
                ) : order.status === 'delivered' ? (
                  <form className="review-form" onSubmit={(event) => submitReview(event, order)}>
                    <div className="review-form-header">
                      <div>
                        <h4>{order.review?.rating ? 'Cập nhật đánh giá' : 'Đánh giá đơn hàng'}</h4>
                        <p>Chia sẻ trải nghiệm của bạn sau khi nhận món.</p>
                      </div>
                    </div>
                    <label className="form-field">
                      <span>Điểm đánh giá</span>
                      <select
                        value={draft.rating}
                        onChange={(event) => updateReviewDraft(order._id, 'rating', event.target.value)}
                      >
                        <option value="5">5 - Rất hài lòng</option>
                        <option value="4">4 - Hài lòng</option>
                        <option value="3">3 - Tạm ổn</option>
                        <option value="2">2 - Cần cải thiện</option>
                        <option value="1">1 - Không hài lòng</option>
                      </select>
                    </label>
                    <label className="form-field">
                      <span>Nội dung đánh giá</span>
                      <textarea
                        rows="3"
                        maxLength="500"
                        value={draft.comment}
                        onChange={(event) => updateReviewDraft(order._id, 'comment', event.target.value)}
                        placeholder="Ví dụ: Món ngon, giao nhanh, đóng gói cẩn thận..."
                      />
                    </label>
                    <div className="order-actions">
                      <button className="btn btn-primary" type="submit" disabled={reviewSubmittingId === order._id}>
                        {reviewSubmittingId === order._id ? 'Đang lưu...' : 'Lưu đánh giá'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="order-note">Trạng thái đơn sẽ tự cập nhật khi OrderUp xử lý.</p>
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
