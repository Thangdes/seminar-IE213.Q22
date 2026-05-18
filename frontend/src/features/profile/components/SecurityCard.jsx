import StatusBadge from './StatusBadge.jsx';

const SecurityCard = ({
  passwordData,
  profile,
  setPasswordData,
  showPasswordForm,
  togglePasswordForm,
  onPasswordSubmit,
}) => {
  const isEkycVerified = profile.security.ekycStatus === 'verified';

  return (
    <section className="buyer-card buyer-security-card">
      <div className="buyer-card-header">
        <div>
          <p className="eyebrow">Bảo mật</p>
          <h2>Xác minh và mật khẩu</h2>
        </div>
        <button className="btn btn-secondary" type="button" onClick={togglePasswordForm}>
          {showPasswordForm ? 'Ẩn form mật khẩu' : 'Đổi mật khẩu'}
        </button>
      </div>

      {showPasswordForm && (
        <div className="buyer-password-form">
          <label className="buyer-form-field">
            <span>Mật khẩu hiện tại</span>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
            />
          </label>
          <label className="buyer-form-field">
            <span>Mật khẩu mới</span>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
            />
          </label>
          <label className="buyer-form-field">
            <span>Nhập lại mật khẩu mới</span>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </label>
          <button className="btn btn-primary" type="button" onClick={onPasswordSubmit}>
            Đổi mật khẩu
          </button>
        </div>
      )}

      <div className="buyer-security-list">
        <div className="buyer-security-item">
          <div>
            <strong>Xác minh email</strong>
            <span>{profile.email}</span>
          </div>
          <StatusBadge active={profile.security.emailVerified} activeText="Đã xác minh" inactiveText="Chưa xác minh" />
        </div>
        <div className="buyer-security-item">
          <div>
            <strong>Xác minh số điện thoại</strong>
            <span>{profile.phone || 'Chưa cập nhật'}</span>
          </div>
          <StatusBadge active={profile.security.phoneVerified} activeText="Đã xác minh" inactiveText="Chưa xác minh" />
        </div>
        <div className="buyer-security-item">
          <div>
            <strong>eKYC</strong>
            <span>Xác minh danh tính người dùng</span>
          </div>
          <StatusBadge active={isEkycVerified} activeText="Đã xác minh" inactiveText="Chờ xác minh" />
        </div>
      </div>
    </section>
  );
};

export default SecurityCard;
