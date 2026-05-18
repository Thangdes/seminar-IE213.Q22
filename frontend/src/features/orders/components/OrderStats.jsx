const labels = {
  total: 'Tổng đơn',
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  delivered: 'Đã giao',
};

const OrderStats = ({ stats }) => {
  return (
    <div className="stats-grid">
      {Object.entries(labels).map(([key, label]) => (
        <div className="stat-card" key={key}>
          <span className="stat-number">{stats[key]}</span>
          <span className="stat-label">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default OrderStats;
