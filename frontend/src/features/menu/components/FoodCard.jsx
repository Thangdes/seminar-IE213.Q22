import { categoryMap, formatPrice } from '../../../constants/menu.js';

const fallbackImage =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80';

const FoodCard = ({ food, onEdit, onDelete, onAddToCart, canManage = false, canOrder = true }) => {
  const category = categoryMap[food.category] || { label: food.category };

  return (
    <article className="food-card">
      <div className="food-image-wrap">
        <img
          src={food.image || fallbackImage}
          alt={food.name}
          className="food-image"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        <span className="food-badge">{category.label}</span>
      </div>

      <div className="food-content">
        <div>
          <h3 className="food-name">{food.name}</h3>
          {food.description && <p className="food-description">{food.description}</p>}
        </div>
        <p className="food-price">{formatPrice(food.price)}</p>
      </div>

      <div className={`food-actions ${canManage ? 'manage-only' : 'user-only'}`}>
        {canOrder && (
          <button
            id={`add-cart-${food._id}`}
            className="btn btn-primary btn-card-main"
            onClick={() => onAddToCart(food)}
          >
            Thêm vào giỏ
          </button>
        )}
        {canManage && (
          <>
            <button
              id={`edit-food-${food._id}`}
              className="icon-btn"
              onClick={() => onEdit(food)}
              aria-label={`Sửa ${food.name}`}
              title="Sửa món"
            >
              Sửa
            </button>
            <button
              id={`delete-food-${food._id}`}
              className="icon-btn danger"
              onClick={() => onDelete(food._id)}
              aria-label={`Xóa ${food.name}`}
              title="Xóa món"
            >
              Xóa
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default FoodCard;
