import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactInfoCard from '../features/profile/components/ContactInfoCard.jsx';
import PersonalInfoCard from '../features/profile/components/PersonalInfoCard.jsx';
import ProfileHeader from '../features/profile/components/ProfileHeader.jsx';
import SecurityCard from '../features/profile/components/SecurityCard.jsx';
import SettingsCard from '../features/profile/components/SettingsCard.jsx';
import ShoppingSummaryCard from '../features/profile/components/ShoppingSummaryCard.jsx';
import { changePassword, getMe, updateMe } from '../services/api.js';
import { getAuthUser, saveStoredProfile } from '../utils/auth.js';

const languageToCode = (language) => (language === 'English' ? 'en' : 'vi');
const codeToLanguage = (code) => (code === 'en' ? 'English' : 'Tiếng Việt');

const defaultProfile = {
  fullName: '',
  birthDate: '',
  gender: '',
  avatarUrl: '',
  coverUrl: '',
  email: '',
  phone: '',
  addresses: [
    { label: 'Nhà riêng', recipient: '', phone: '', address: '', isDefault: true },
    { label: 'Văn phòng', recipient: '', phone: '', address: '', isDefault: false },
  ],
  security: { emailVerified: false, phoneVerified: false, ekycStatus: 'pending' },
  shopping: { totalOrders: 0, processingOrders: 0, reviewsWritten: 0 },
  settings: {
    language: 'Tiếng Việt',
    notifications: { orderUpdates: true, promotions: false, securityAlerts: true },
    socialAccounts: [
      { provider: 'Google', connected: false },
      { provider: 'Facebook', connected: false },
    ],
  },
};

const mergeProfile = (profile) => ({
  ...defaultProfile,
  ...profile,
  fullName: profile.fullName || profile.displayName || '',
  addresses: profile.addresses?.length ? profile.addresses : defaultProfile.addresses,
  security: { ...defaultProfile.security, ...(profile.security || {}) },
  shopping: { ...defaultProfile.shopping, ...(profile.shopping || {}) },
  settings: {
    ...defaultProfile.settings,
    ...(profile.settings || {}),
    notifications: {
      ...defaultProfile.settings.notifications,
      ...(profile.settings?.notifications || {}),
    },
    socialAccounts: profile.settings?.socialAccounts?.length
      ? profile.settings.socialAccounts
      : defaultProfile.settings.socialAccounts,
  },
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(defaultProfile);
  const [languageCode, setLanguageCode] = useState('vi');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!getAuthUser()) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const res = await getMe();
        const nextProfile = mergeProfile(res.data);
        setProfile(nextProfile);
        setLanguageCode(languageToCode(nextProfile.settings.language));
        saveStoredProfile(nextProfile);
        window.dispatchEvent(new Event('auth-change'));
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }
        setError('Không thể tải hồ sơ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    clearMessages();
  };

  const updateAddress = (index, field, value) => {
    setProfile((prev) => ({
      ...prev,
      addresses: prev.addresses.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item,
      ),
    }));
    clearMessages();
  };

  const updateNotification = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        notifications: { ...prev.settings.notifications, [field]: value },
      },
    }));
    clearMessages();
  };

  const updateLanguage = (code) => {
    setLanguageCode(code);
    setProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, language: codeToLanguage(code) },
    }));
    clearMessages();
  };

  const handleAvatarFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh.');
      return;
    }

    if (file.size > 1_500_000) {
      setError('Ảnh quá lớn. Vui lòng chọn ảnh dưới 1.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateField('avatarUrl', reader.result || '');
    reader.onerror = () => setError('Không thể đọc file ảnh.');
    reader.readAsDataURL(file);
  };

  const buildPayload = () => ({
    fullName: profile.fullName,
    displayName: profile.fullName,
    birthDate: profile.birthDate,
    gender: profile.gender,
    phone: profile.phone,
    avatarUrl: profile.avatarUrl,
    coverUrl: profile.coverUrl,
    addresses: profile.addresses,
    security: profile.security,
    settings: profile.settings,
  });

  const handleSubmit = async () => {
    setSaving(true);
    clearMessages();

    try {
      const res = await updateMe(buildPayload());
      const nextProfile = mergeProfile(res.data);
      setProfile(nextProfile);
      setLanguageCode(languageToCode(nextProfile.settings.language));
      saveStoredProfile(nextProfile);
      window.dispatchEvent(new Event('auth-change'));
      setMessage('Hồ sơ đã được lưu vào database.');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lưu hồ sơ.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    clearMessages();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu mới không khớp.');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setMessage('Mật khẩu đã được đổi thành công.');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đổi mật khẩu.');
    }
  };

  return (
    <main className="buyer-profile-page">
      <section className="buyer-profile-shell" aria-label="Hồ sơ người mua">
        <ProfileHeader
          profile={profile}
          saving={saving}
          loading={loading}
          onAvatarFile={handleAvatarFile}
          onSubmit={handleSubmit}
        />

        {(message || error || loading) && (
          <div className="buyer-profile-alerts">
            {loading && <div className="alert">Đang tải hồ sơ...</div>}
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}
          </div>
        )}

        <div className="buyer-profile-grid">
          <PersonalInfoCard profile={profile} updateField={updateField} />
          <ContactInfoCard profile={profile} updateField={updateField} updateAddress={updateAddress} />
          <SecurityCard
            profile={profile}
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            showPasswordForm={showPasswordForm}
            togglePasswordForm={() => setShowPasswordForm((show) => !show)}
            onPasswordSubmit={handlePasswordSubmit}
          />
          <ShoppingSummaryCard shopping={profile.shopping} />
          <SettingsCard
            profile={profile}
            languageCode={languageCode}
            updateLanguage={updateLanguage}
            updateNotification={updateNotification}
          />
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
