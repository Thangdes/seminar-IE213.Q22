import { formatPrice } from '../../../constants/menu.js';

const CartSidebar = ({
  cart,
  cartTotal,
  customerName,
  orderNote,
  onClose,
  onPlaceOrder,
  onRemove,
  onUpdateQty,
  setCustomerName,
  setOrderNote,
}) => {
  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside className="cart-sidebar" onClick={(e) => e.stopPropagation()} aria-label="Giỏ hàng">
        <div className="cart-header">
          <div>
            <p className="eyebrow">Đơn hiện tại</p>
            <h2>Giỏ hàng</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Đóng giỏ hàng">
            Đóng
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-state">
            <p>Giỏ hàng đang trống.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">{formatPrice(item.price)}</span>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => onUpdateQty(item._id, -1)} aria-label="Giảm số lượng">
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQty(item._id, 1)} aria-label="Tăng số lượng">
                      +
                    </button>
                    <button className="remove-btn" onClick={() => onRemove(item._id)}>
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <label className="cart-field">
                <span>Tên khách hàng</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="cart-input"
                  placeholder="Nhập tên"
                />
              </label>
              <label className="cart-field">
                <span>Ghi chú</span>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="cart-input"
                  placeholder="Tùy chọn"
                />
              </label>
              <div className="cart-total">
                <span>Tổng cộng</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
              <button id="place-order" className="btn btn-primary btn-full" onClick={onPlaceOrder}>
                Đặt hàng
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartSidebar;
