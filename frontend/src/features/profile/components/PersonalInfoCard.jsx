const PersonalInfoCard = ({ profile, updateField }) => {
  return (
    <section className="buyer-card buyer-personal-card">
      <div className="buyer-card-header">
        <div>
          <p className="eyebrow">Thông tin cá nhân</p>
          <h2>Hồ sơ cơ bản</h2>
        </div>
      </div>

      <div className="buyer-form-grid">
        <label className="buyer-form-field">
          <span>Họ tên đầy đủ</span>
          <input value={profile.fullName} onChange={(e) => updateField('fullName', e.target.value)} />
        </label>
        <label className="buyer-form-field">
          <span>Ngày sinh</span>
          <input type="date" value={profile.birthDate} onChange={(e) => updateField('birthDate', e.target.value)} />
        </label>
        <label className="buyer-form-field">
          <span>Giới tính</span>
          <select value={profile.gender} onChange={(e) => updateField('gender', e.target.value)}>
            <option value="">Chưa chọn</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </label>
        <label className="buyer-form-field">
          <span>Avatar URL</span>
          <input
            value={profile.avatarUrl}
            onChange={(e) => updateField('avatarUrl', e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />
        </label>
      </div>
    </section>
  );
};

export default PersonalInfoCard;
