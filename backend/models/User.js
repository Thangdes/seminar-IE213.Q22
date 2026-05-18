import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 60, default: '' },
    recipient: { type: String, trim: true, maxlength: 100, default: '' },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    address: { type: String, trim: true, maxlength: 300, default: '' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false },
);

const socialAccountSchema = new mongoose.Schema(
  {
    provider: { type: String, trim: true, maxlength: 40, default: '' },
    connected: { type: Boolean, default: false },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, 'Email must be at most 254 characters'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [100, 'Display name must be at most 100 characters'],
      default: '',
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: [100, 'Full name must be at most 100 characters'],
      default: '',
    },
    birthDate: {
      type: String,
      trim: true,
      maxlength: [20, 'Birth date is invalid'],
      default: '',
    },
    gender: {
      type: String,
      trim: true,
      maxlength: [30, 'Gender is invalid'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, 'Phone is invalid'],
      default: '',
    },
    avatarUrl: {
      type: String,
      trim: true,
      maxlength: [5000000, 'Avatar image is too large'],
      default: '',
    },
    coverUrl: {
      type: String,
      trim: true,
      maxlength: [5000000, 'Cover image is too large'],
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio must be at most 500 characters'],
      default: '',
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    security: {
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false },
      ekycStatus: {
        type: String,
        enum: ['verified', 'pending'],
        default: 'pending',
      },
    },
    shopping: {
      totalOrders: { type: Number, default: 0 },
      processingOrders: { type: Number, default: 0 },
      reviewsWritten: { type: Number, default: 0 },
    },
    settings: {
      language: { type: String, trim: true, maxlength: 40, default: 'Tiếng Việt' },
      notifications: {
        orderUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        securityAlerts: { type: Boolean, default: true },
      },
      socialAccounts: {
        type: [socialAccountSchema],
        default: [
          { provider: 'Google', connected: false },
          { provider: 'Facebook', connected: false },
        ],
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const User = mongoose.model('User', userSchema);
export default User;
