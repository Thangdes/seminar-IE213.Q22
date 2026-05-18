import User from '../models/User.js';
import { verifyJwt } from '../utils/authUtils.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization') || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Access token không hợp lệ' });
    }

    const payload = verifyJwt(token);
    if (payload.type !== 'access' || !payload.sub) {
      return res.status(401).json({ message: 'Access token không hợp lệ' });
    }

    if (payload.role === 'admin' && payload.email === 'adminfood@gmail.com') {
      req.user = {
        _id: 'fixed-admin',
        email: payload.email,
        role: 'admin',
      };
      return next();
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Access token không hợp lệ' });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Access token không hợp lệ' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Chi admin moi co quyen thuc hien thao tac nay' });
  }

  return next();
};
