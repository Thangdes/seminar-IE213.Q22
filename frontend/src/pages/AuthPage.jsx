import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api.js';
import { getAuthUser, saveAuthSession } from '../utils/auth.js';

const AuthPage = ({ mode }) => {
  const navigate = useNavigate();
  const isRegister = mode === 'register';
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isRegister) {
        await registerUser(formData);
        setSuccess('Đăng ký thành công. Bạn có thể đăng nhập ngay.');
        setFormData((prev) => ({ ...prev, password: '' }));
      } else {
        const res = await loginUser(formData);
        saveAuthSession(res.data);
        window.dispatchEvent(new Event('auth-change'));
        const user = getAuthUser();
        navigate(user?.isAdmin ? '/admin' : '/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xử lý yêu cầu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <p className="eyebrow">Tài khoản</p>
          <h1>{isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</h1>
          <p>
            {isRegister
              ? 'Đăng ký để quản lý hồ sơ và sử dụng các tính năng dành cho người dùng.'
              : 'Đăng nhập để đặt món, theo dõi đơn hàng hoặc vào bảng điều khiển admin.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>

          <p className="auth-switch">
            {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
            <Link to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Đăng nhập' : 'Đăng ký'}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default AuthPage;
