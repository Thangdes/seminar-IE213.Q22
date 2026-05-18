import User from '../models/User.js';
import Order from '../models/Order.js';
import { hashPassword, sanitizeString, verifyPassword } from '../utils/authUtils.js';

const hasOwn = (source, key) => Object.prototype.hasOwnProperty.call(source, key);

const sanitizeBoolean = (value) => value === true;

const sanitizeAddress = (address) => ({
  label: sanitizeString(address?.label, 60) ?? '',
  recipient: sanitizeString(address?.recipient, 100) ?? '',
  phone: sanitizeString(address?.phone, 30) ?? '',
  address: sanitizeString(address?.address, 300) ?? '',
  isDefault: sanitizeBoolean(address?.isDefault),
});

const sanitizeSocialAccount = (account) => ({
  provider: sanitizeString(account?.provider, 40) ?? '',
  connected: sanitizeBoolean(account?.connected),
});

const buildShoppingStats = async (userId) => {
  const [totalOrders, processingOrders] = await Promise.all([
    Order.countDocuments({ user: userId }),
    Order.countDocuments({ user: userId, status: { $in: ['pending', 'confirmed'] } }),
  ]);

  return {
    totalOrders,
    processingOrders,
    reviewsWritten: 0,
  };
};

export const getMe = async (req, res, next) => {
  try {
    const user = req.user.toObject ? req.user.toObject() : req.user;
    user.shopping = await buildShoppingStats(req.user._id);
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const updates = {};

    for (const key of ['displayName', 'fullName', 'birthDate', 'gender', 'phone', 'bio']) {
      if (hasOwn(req.body, key)) {
        const limits = { displayName: 100, fullName: 100, birthDate: 20, gender: 30, phone: 30, bio: 500 };
        updates[key] = sanitizeString(req.body[key], limits[key]) ?? '';
      }
    }

    if (hasOwn(req.body, 'avatarUrl')) {
      updates.avatarUrl = sanitizeString(req.body.avatarUrl, 5000000) ?? '';
    }

    if (hasOwn(req.body, 'coverUrl')) {
      updates.coverUrl = sanitizeString(req.body.coverUrl, 5000000) ?? '';
    }

    if (Array.isArray(req.body.addresses)) {
      updates.addresses = req.body.addresses.slice(0, 5).map(sanitizeAddress);
    }

    if (req.body.security && typeof req.body.security === 'object') {
      updates.security = {
        emailVerified: sanitizeBoolean(req.body.security.emailVerified),
        phoneVerified: sanitizeBoolean(req.body.security.phoneVerified),
        ekycStatus: req.body.security.ekycStatus === 'verified' ? 'verified' : 'pending',
      };
    }

    if (req.body.settings && typeof req.body.settings === 'object') {
      updates.settings = {
        language: sanitizeString(req.body.settings.language, 40) || 'Tiếng Việt',
        notifications: {
          orderUpdates: sanitizeBoolean(req.body.settings.notifications?.orderUpdates),
          promotions: sanitizeBoolean(req.body.settings.notifications?.promotions),
          securityAlerts: sanitizeBoolean(req.body.settings.notifications?.securityAlerts),
        },
        socialAccounts: Array.isArray(req.body.settings.socialAccounts)
          ? req.body.settings.socialAccounts.slice(0, 5).map(sanitizeSocialAccount)
          : [],
      };
    }

    if (updates.fullName && !updates.displayName) {
      updates.displayName = updates.fullName;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    const responseUser = user.toObject();
    responseUser.shopping = await buildShoppingStats(req.user._id);

    return res.status(200).json(responseUser);
  } catch (error) {
    return next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+passwordHash');
    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.passwordHash = hashPassword(newPassword);
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    return next(error);
  }
};
