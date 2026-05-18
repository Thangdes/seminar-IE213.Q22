import StatusBadge from './StatusBadge.jsx';

const SettingsCard = ({ profile, languageCode, updateLanguage, updateNotification }) => {
  return (
    <section className="buyer-card buyer-settings-card">
      <div className="buyer-card-header">
        <div>
          <p className="eyebrow">Cài đặt</p>
          <h2>Trải nghiệm tài khoản</h2>
        </div>
      </div>

      <div className="buyer-settings-grid">
        <label className="buyer-form-field">
          <span>Ngôn ngữ</span>
          <select value={languageCode} onChange={(e) => updateLanguage(e.target.value)}>
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </label>

        <div className="buyer-setting-group">
          <span>Thông báo</span>
          <div className="buyer-toggle-list">
            <label>
              <input
                type="checkbox"
                checked={profile.settings.notifications.orderUpdates}
                onChange={(e) => updateNotification('orderUpdates', e.target.checked)}
              />
              Cập nhật đơn hàng
            </label>
            <label>
              <input
                type="checkbox"
                checked={profile.settings.notifications.promotions}
                onChange={(e) => updateNotification('promotions', e.target.checked)}
              />
              Khuyến mãi
            </label>
            <label>
              <input
                type="checkbox"
                checked={profile.settings.notifications.securityAlerts}
                onChange={(e) => updateNotification('securityAlerts', e.target.checked)}
              />
              Cảnh báo bảo mật
            </label>
          </div>
        </div>

        <div className="buyer-setting-group">
          <span>Liên kết mạng xã hội</span>
          <div className="buyer-social-list">
            {profile.settings.socialAccounts.map((account) => (
              <div className="buyer-social-item" key={account.provider}>
                <strong>{account.provider}</strong>
                <StatusBadge active={account.connected} activeText="Đã liên kết" inactiveText="Chưa liên kết" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsCard;
