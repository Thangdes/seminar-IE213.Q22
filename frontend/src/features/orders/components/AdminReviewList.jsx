import { formatPrice } from '../../../constants/menu.js';

const formatDate = (date) => new Date(date).toLocaleString('vi-VN');

const AdminReviewList = ({ orders }) => {
  const reviewedOrders = orders.filter((order) => order.review?.rating);

  if (reviewedOrders.length === 0) {
    return (
      <div className="empty-state">
        <p>Chưa có đánh giá nào từ khách hàng.</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviewedOrders.map((order) => {
        const owner = order.user?.fullName || order.user?.displayName || order.user?.email || order.customerName;
        const itemNames = order.items.map((item) => `${item.foodName} x ${item.quantity}`).join(', ');

        return (
          <article className="review-card" key={order._id}>
            <div className="review-card-header">
              <div>
                <h3>{owner}</h3>
                <span>{formatDate(order.review.reviewedAt || order.updatedAt)}</span>
              </div>
              <strong>{order.review.rating}/5</strong>
            </div>
            {order.review.comment && <p>{order.review.comment}</p>}
            <div className="review-card-meta">
              <span>{itemNames}</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default AdminReviewList;
