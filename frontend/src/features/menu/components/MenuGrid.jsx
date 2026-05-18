import FoodCard from './FoodCard.jsx';

const MenuGrid = ({ foods, loading, onAddToCart }) => {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Đang tải thực đơn...</p>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="empty-state">
        <p>Chưa có món ăn nào trong danh mục này.</p>
      </div>
    );
  }

  return (
    <div className="food-grid">
      {foods.map((food) => (
        <FoodCard key={food._id} food={food} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default MenuGrid;
