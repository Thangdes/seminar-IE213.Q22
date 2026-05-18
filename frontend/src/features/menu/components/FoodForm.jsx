import { useEffect, useState } from 'react';

const FoodForm = ({ food, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    image: '',
  });
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(food);

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || '',
        description: food.description || '',
        price: food.price || '',
        category: food.category || 'main',
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
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Tên món ăn là bắt buộc';
    if (!formData.price || Number(formData.price) < 1000) {
      nextErrors.price = 'Giá phải ít nhất 1.000 đ';
    }
    if (!formData.category) nextErrors.category = 'Vui lòng chọn danh mục';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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
          <div>
            <p className="eyebrow">{isEditing ? 'Cập nhật menu' : 'Món mới'}</p>
            <h2>{isEditing ? 'Chỉnh sửa món ăn' : 'Thêm món ăn'}</h2>
          </div>
          <button id="close-food-form" className="close-btn" onClick={onClose} aria-label="Đóng form">
            Đóng
          </button>
        </div>

        <form onSubmit={handleSubmit} className="food-form">
          <div className="form-field">
            <label htmlFor="food-name">Tên món ăn</label>
            <input
              id="food-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: Phở bò Hà Nội"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="food-description">Mô tả</label>
            <textarea
              id="food-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả ngắn gọn về món ăn"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="food-price">Giá</label>
              <input
                id="food-price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="35000"
                min="1000"
                className={errors.price ? 'input-error' : ''}
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="food-category">Danh mục</label>
              <select id="food-category" name="category" value={formData.category} onChange={handleChange}>
                <option value="appetizer">Khai vị</option>
                <option value="main">Món chính</option>
                <option value="dessert">Tráng miệng</option>
                <option value="drink">Đồ uống</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="food-image">URL ảnh</label>
            <input
              id="food-image"
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/food.jpg"
            />
          </div>

          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
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
