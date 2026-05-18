export const categories = [
  { value: 'all', label: 'Tất cả' },
  { value: 'appetizer', label: 'Khai vị' },
  { value: 'main', label: 'Món chính' },
  { value: 'dessert', label: 'Tráng miệng' },
  { value: 'drink', label: 'Đồ uống' },
];

export const categoryMap = categories.reduce((acc, item) => {
  acc[item.value] = { label: item.label };
  return acc;
}, {});

export const formatPrice = (price) => `${new Intl.NumberFormat('vi-VN').format(price || 0)} đ`;
