// components/FoodForm.jsx — Modal form thêm/sửa món ăn
import { useState, useEffect } from 'react';

const FoodForm = ({ food, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: 'main', image: '',
  });
  const [errors, setErrors] = useState({});
  const isEditing = !!food;

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || '', description: food.description || '',
        price: food.price || '', category: food.category || 'main',
        image: food.image || '',
      });
    }
  }, [food]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Tên món ăn là bắt buộc';
    if (!formData.price || Number(formData.price) < 1000) errs.price = 'Giá phải ít nhất 1,000 ₫';
    if (!formData.category) errs.category = 'Vui lòng chọn danh mục';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, price: Number(formData.price) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? '✏️ Chỉnh sửa món ăn' : '➕ Thêm món ăn mới'}</h2>
          <button id="close-food-form" className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="food-form">
          <div className="form-field">
            <label>Tên món ăn *</label>
            <input id="food-name" type="text" name="name" value={formData.name}
              onChange={handleChange} placeholder="VD: Phở bò Hà Nội"
              className={errors.name ? 'input-error' : ''} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="form-field">
            <label>Mô tả</label>
            <textarea id="food-description" name="description" value={formData.description}
              onChange={handleChange} placeholder="Mô tả ngắn gọn..." rows={3} />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Giá (₫) *</label>
              <input id="food-price" type="number" name="price" value={formData.price}
                onChange={handleChange} placeholder="35000" min="1000"
                className={errors.price ? 'input-error' : ''} />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>
            <div className="form-field">
              <label>Danh mục *</label>
              <select id="food-category" name="category" value={formData.category} onChange={handleChange}>
                <option value="appetizer">🥗 Khai vị</option>
                <option value="main">🍖 Món chính</option>
                <option value="dessert">🍰 Tráng miệng</option>
                <option value="drink">🥤 Đồ uống</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label>URL ảnh</label>
            <input id="food-image" type="text" name="image" value={formData.image}
              onChange={handleChange} placeholder="https://example.com/food.jpg" />
          </div>
          <div className="form-buttons">
            <button type="button" className="btn btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" id="submit-food-form" className="btn btn-primary">
              {isEditing ? 'Cập nhật' : 'Thêm món'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodForm;
