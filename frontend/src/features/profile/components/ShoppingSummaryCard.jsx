const ShoppingSummaryCard = ({ shopping }) => {
  return (
    <section className="buyer-card buyer-shopping-card">
      <div className="buyer-card-header">
        <div>
          <p className="eyebrow">Hoạt động mua sắm</p>
          <h2>Tổng quan đơn hàng</h2>
        </div>
      </div>

      <div className="buyer-stats-row">
        <div className="buyer-stat">
          <strong>{shopping.totalOrders}</strong>
          <span>Đơn đã đặt</span>
        </div>
        <div className="buyer-stat">
          <strong>{shopping.processingOrders}</strong>
          <span>Đang xử lý</span>
        </div>
        <div className="buyer-stat">
          <strong>{shopping.reviewsWritten}</strong>
          <span>Đánh giá đã viết</span>
        </div>
      </div>
    </section>
  );
};

export default ShoppingSummaryCard;
