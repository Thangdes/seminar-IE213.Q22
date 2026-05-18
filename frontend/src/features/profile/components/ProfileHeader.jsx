const ProfileHeader = ({ profile, saving, loading, onAvatarFile, onSubmit }) => {
  return (
    <>
      <div className="buyer-cover">
        {profile.coverUrl ? (
          <img className="buyer-cover-image" src={profile.coverUrl} alt="Cover" />
        ) : (
          <div className="buyer-cover-placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="buyer-header">
        <div className="buyer-avatar-area">
          <div className="buyer-avatar">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.fullName || 'Avatar'} />
            ) : (
              <span>{(profile.fullName || profile.email || 'U').charAt(0)}</span>
            )}
          </div>

          <div className="buyer-avatar-actions">
            <label className="avatar-upload-button" htmlFor="avatarFile">
              Thêm avatar
            </label>
            <input id="avatarFile" type="file" accept="image/*" onChange={onAvatarFile} />
          </div>
        </div>

        <div className="buyer-heading">
          <p className="eyebrow">Hồ sơ người mua</p>
          <h1>{profile.fullName || 'Hồ sơ người mua'}</h1>
          <p>Quản lý thông tin cá nhân, địa chỉ giao hàng và bảo mật tài khoản.</p>
        </div>

        <button className="btn btn-primary buyer-edit-button" type="button" disabled={saving || loading} onClick={onSubmit}>
          {saving ? 'Đang lưu...' : 'Lưu hồ sơ'}
        </button>
      </div>
    </>
  );
};

export default ProfileHeader;
