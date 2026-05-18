import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthSession, getAuthUser } from '../../utils/auth.js';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getAuthUser());
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const syncAuth = () => setUser(getAuthUser());
    syncAuth();
    window.addEventListener('auth-change', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('auth-change', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    closeMenu();
    navigate('/login');
  };

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Điều hướng chính">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <img src="/orderup-avatar.png" alt="" />
          </span>
          <span className="brand-text">OrderUp</span>
        </Link>

        <button
          id="nav-toggle"
          className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Mở menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
          {!user?.isAdmin && (
            <>
              <Link
                to="/"
                id="nav-menu"
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Thực đơn
              </Link>
              <Link
                to="/orders"
                id="nav-orders"
                className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Đơn hàng
              </Link>
            </>
          )}

          {user?.isAdmin && (
            <Link
              to="/admin"
              className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Quản trị
            </Link>
          )}

          <span className="nav-divider" />

          {user ? (
            <>
              {!user.isAdmin && (
                <Link
                  to="/profile"
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Hồ sơ
                </Link>
              )}
              <span className="nav-user" title={user.email}>
                {user.isAdmin ? 'OrderUp Team' : user.displayName || user.email}
              </span>
              <button className="nav-action" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className={`nav-action primary ${isActive('/register') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
