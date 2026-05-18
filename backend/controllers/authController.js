import User from '../models/User.js';
import {
  hashPassword,
  isValidEmail,
  sanitizeEmail,
  signJwt,
  verifyPassword,
} from '../utils/authUtils.js';

const ADMIN_EMAIL = 'adminfood@gmail.com';
const ADMIN_PASSWORD = 'admin12345';

const invalidLoginResponse = (res) => {
  return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
};

export const register = async (req, res, next) => {
  try {
    const email = sanitizeEmail(req.body.email);
    const password = req.body.password;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    if (typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ message: 'Password là bắt buộc' });
    }

    if (email === ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Email admin la tai khoan co dinh va khong the dang ky' });
    }

    const existingUser = await User.findOne({ email }).select('_id');
    if (existingUser) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    const user = await User.create({
      email,
      passwordHash: hashPassword(password),
    });

    return res.status(201).json({
      userId: user._id.toString(),
      email: user.email,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const email = sanitizeEmail(req.body.email);
    const password = req.body.password;

    if (!isValidEmail(email) || typeof password !== 'string') {
      return invalidLoginResponse(res);
    }

    if (email === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return invalidLoginResponse(res);
      }

      return res.status(200).json({
        accessToken: signJwt({ sub: 'fixed-admin', email: ADMIN_EMAIL, role: 'admin', type: 'access' }, '15m'),
        refreshToken: signJwt({ sub: 'fixed-admin', email: ADMIN_EMAIL, role: 'admin', type: 'refresh' }, '7d'),
      });
    }

    const user = await User.findOne({ email }).select('+passwordHash email');
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return invalidLoginResponse(res);
    }

    return res.status(200).json({
      accessToken: signJwt({ sub: user._id.toString(), email: user.email, role: 'user', type: 'access' }, '15m'),
      refreshToken: signJwt({ sub: user._id.toString(), email: user.email, role: 'user', type: 'refresh' }, '7d'),
    });
  } catch (error) {
    return next(error);
  }
};
