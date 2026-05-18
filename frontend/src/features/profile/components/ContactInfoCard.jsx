const ContactInfoCard = ({ profile, updateAddress, updateField }) => {
  return (
    <section className="buyer-card buyer-contact-card">
      <div className="buyer-card-header">
        <div>
          <p className="eyebrow">Liên hệ</p>
          <h2>Email, số điện thoại và địa chỉ</h2>
        </div>
      </div>

      <div className="buyer-contact-row">
        <label className="buyer-form-field">
          <span>Email</span>
          <input value={profile.email} disabled />
        </label>
        <label className="buyer-form-field">
          <span>Số điện thoại</span>
          <input value={profile.phone} onChange={(e) => updateField('phone', e.target.value)} />
        </label>
      </div>

      <div className="buyer-address-list">
        {profile.addresses.map((item, index) => (
          <article className="buyer-address-card editable" key={`address-${index}`}>
            <div className="buyer-address-title">
              <strong>{item.label || `Địa chỉ giao hàng ${index + 1}`}</strong>
              {item.isDefault && <span>Mặc định</span>}
            </div>
            <div className="buyer-form-grid">
              <label className="buyer-form-field">
                <span>Tên địa chỉ</span>
                <input value={item.label} onChange={(e) => updateAddress(index, 'label', e.target.value)} />
              </label>
              <label className="buyer-form-field">
                <span>Người nhận</span>
                <input value={item.recipient} onChange={(e) => updateAddress(index, 'recipient', e.target.value)} />
              </label>
              <label className="buyer-form-field">
                <span>SĐT nhận hàng</span>
                <input value={item.phone} onChange={(e) => updateAddress(index, 'phone', e.target.value)} />
              </label>
              <label className="buyer-form-field wide">
                <span>Địa chỉ giao hàng</span>
                <input value={item.address} onChange={(e) => updateAddress(index, 'address', e.target.value)} />
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ContactInfoCard;
