// components/FoodCard.jsx — Card hiển thị thông tin một món ăn
import { useState } from 'react';

// Map category sang tên tiếng Việt và emoji
const categoryMap = {
  appetizer: { label: 'Khai vị', emoji: '🥗' },
  main: { label: 'Món chính', emoji: '🍖' },
  dessert: { label: 'Tráng miệng', emoji: '🍰' },
  drink: { label: 'Đồ uống', emoji: '🥤' },
};

// Format số tiền VNĐ
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
};

const FoodCard = ({ food, onEdit, onDelete, onAddToCart }) => {
  // State cho hover effect
  const [isHovered, setIsHovered] = useState(false);

  const category = categoryMap[food.category] || { label: food.category, emoji: '🍽️' };

  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ===== ẢNH MÓN ĂN ===== */}
      <div style={styles.imageWrapper}>
        <img
          src={food.image || 'https://placehold.co/400x300/FF6B35/white?text=Food'}
          alt={food.name}
          style={{
            ...styles.image,
            ...(isHovered ? styles.imageHover : {}),
          }}
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x300/FF6B35/white?text=Food';
          }}
        />
        {/* Badge category */}
        <span style={styles.badge}>
          {category.emoji} {category.label}
        </span>
      </div>

      {/* ===== THÔNG TIN ===== */}
      <div style={styles.content}>
        <h3 style={styles.name}>{food.name}</h3>
        {food.description && (
          <p style={styles.description}>{food.description}</p>
        )}
        <p style={styles.price}>{formatPrice(food.price)}</p>
      </div>

      {/* ===== ACTIONS ===== */}
      <div style={styles.actions}>
        <button
          id={`add-cart-${food._id}`}
          style={{ ...styles.btn, ...styles.btnPrimary }}
          onClick={() => onAddToCart(food)}
        >
          🛒 Thêm vào giỏ
        </button>
        <div style={styles.adminActions}>
          <button
            id={`edit-food-${food._id}`}
            style={{ ...styles.btn, ...styles.btnOutline }}
            onClick={() => onEdit(food)}
          >
            ✏️
          </button>
          <button
            id={`delete-food-${food._id}`}
            style={{ ...styles.btn, ...styles.btnDanger }}
            onClick={() => onDelete(food._id)}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== STYLES =====
const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(0,0,0,0.04)',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(255, 107, 53, 0.15)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    height: '200px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  imageHover: {
    transform: 'scale(1.05)',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(8px)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#333',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  content: {
    padding: '16px 20px 8px',
    flex: 1,
  },
  name: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1D1D1D',
    margin: '0 0 6px',
    lineHeight: 1.3,
  },
  description: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 10px',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  price: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#FF6B35',
    margin: 0,
  },
  actions: {
    padding: '12px 20px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  adminActions: {
    display: 'flex',
    gap: '6px',
  },
  btn: {
    border: 'none',
    borderRadius: '10px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  btnPrimary: {
    backgroundColor: '#FF6B35',
    color: '#fff',
    flex: 1,
  },
  btnOutline: {
    backgroundColor: '#f0f0f0',
    color: '#555',
  },
  btnDanger: {
    backgroundColor: '#fee2e2',
    color: '#E63946',
  },
};

export default FoodCard;
