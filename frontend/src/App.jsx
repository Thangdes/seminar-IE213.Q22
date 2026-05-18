import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { getAuthUser } from './utils/auth.js';

const RequireAuth = ({ children }) => {
  return getAuthUser() ? children : <Navigate to="/login" replace />;
};

const RequireAdmin = ({ children }) => {
  const user = getAuthUser();
  if (!user) return <Navigate to="/login" replace />;
  return user.isAdmin ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <OrdersPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
