// components/Navbar.jsx — Thanh điều hướng chính
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  // Lấy đường dẫn hiện tại để highlight link active
  const location = useLocation();

  // State cho mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);

  // Kiểm tra link có đang active không
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* ===== LOGO ===== */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🍔</span>
          <span style={styles.logoText}>FoodOrder</span>
        </Link>

        {/* ===== HAMBURGER BUTTON (mobile) ===== */}
        <button
          id="nav-toggle"
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{
            ...styles.hamburgerLine,
            ...(menuOpen ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}),
          }} />
          <span style={{
            ...styles.hamburgerLine,
            ...(menuOpen ? { opacity: 0 } : {}),
          }} />
          <span style={{
            ...styles.hamburgerLine,
            ...(menuOpen ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}),
          }} />
        </button>

        {/* ===== NAVIGATION LINKS ===== */}
        <div style={{
          ...styles.links,
          ...(menuOpen ? styles.linksOpen : {}),
        }}>
          <Link
            to="/"
            id="nav-menu"
            style={{
              ...styles.link,
              ...(isActive('/') ? styles.linkActive : {}),
            }}
            onClick={() => setMenuOpen(false)}
          >
            🍽️ Menu
          </Link>
          <Link
            to="/orders"
            id="nav-orders"
            style={{
              ...styles.link,
              ...(isActive('/orders') ? styles.linkActive : {}),
            }}
            onClick={() => setMenuOpen(false)}
          >
            📦 Đơn hàng
          </Link>
        </div>
      </div>
    </nav>
  );
};

// ===== STYLES =====
const styles = {
  nav: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #E63946 100%)',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 20px rgba(255, 107, 53, 0.3)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    position: 'relative',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#fff',
  },
  logoIcon: {
    fontSize: '28px',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  hamburgerLine: {
    display: 'block',
    width: '24px',
    height: '2.5px',
    backgroundColor: '#fff',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  linksOpen: {},
  link: {
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.85)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '15px',
    transition: 'all 0.25s ease',
  },
  linkActive: {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    fontWeight: 600,
  },
};

export default Navbar;
