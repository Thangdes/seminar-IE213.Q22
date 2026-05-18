export const statusFilters = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'delivered', label: 'Đã giao' },
];

export const statusMap = {
  pending: { label: 'Chờ xử lý', className: 'pending' },
  confirmed: { label: 'Đã xác nhận', className: 'confirmed' },
  delivered: { label: 'Đã giao', className: 'delivered' },
};

export const nextStatus = { pending: 'confirmed', confirmed: 'delivered' };

export const buildOrderStats = (orders) => ({
  total: orders.length,
  pending: orders.filter((order) => order.status === 'pending').length,
  confirmed: orders.filter((order) => order.status === 'confirmed').length,
  delivered: orders.filter((order) => order.status === 'delivered').length,
});
