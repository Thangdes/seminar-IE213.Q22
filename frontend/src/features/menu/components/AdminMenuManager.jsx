import FoodCard from './FoodCard.jsx';
import FoodForm from './FoodForm.jsx';

const AdminMenuManager = ({
  foods,
  loading,
  showForm,
  editingFood,
  onAddClick,
  onCloseForm,
  onDelete,
  onEdit,
  onSubmit,
}) => {
  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <p className="eyebrow">Thực đơn</p>
          <h2>Thực đơn OrderUp</h2>
        </div>
        <button className="btn btn-primary" onClick={onAddClick}>
          Thêm món
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Đang tải thực đơn...</p>
        </div>
      ) : foods.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có món ăn nào. Hãy thêm món đầu tiên cho khách hàng.</p>
        </div>
      ) : (
        <div className="food-grid">
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              canManage
              canOrder={false}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {showForm && <FoodForm food={editingFood} onSubmit={onSubmit} onClose={onCloseForm} />}
    </section>
  );
};

export default AdminMenuManager;
