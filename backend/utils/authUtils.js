import crypto from 'crypto';

const EMAIL_REGEX =
  /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\u0001-\u0008\u000b\u000c\u000e-\u001f\u0021\u0023-\u005b\u005d-\u007f]|\\[\u0001-\u0009\u000b\u000c\u000e-\u007f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-zA-Z0-9-]*[a-zA-Z0-9]:.+)\])$/;

const PASSWORD_KEY_LENGTH = 64;

export const isValidEmail = (email) => {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
};

export const sanitizeString = (value, maxLength = 500) => {
  if (typeof value !== 'string') return undefined;

  return value
    .trim()
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[<>]/g, '')
    .slice(0, maxLength);
};

export const sanitizeEmail = (email) => sanitizeString(email, 254)?.toLowerCase();

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('base64url');
  const hash = crypto.scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString('base64url');
  return `scrypt$${salt}$${hash}`;
};

export const verifyPassword = (password, passwordHash) => {
  if (typeof password !== 'string' || typeof passwordHash !== 'string') return false;

  const [algorithm, salt, storedHash] = passwordHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !storedHash) return false;

  const candidateHash = crypto.scryptSync(password, salt, PASSWORD_KEY_LENGTH);
  const storedBuffer = Buffer.from(storedHash, 'base64url');

  return storedBuffer.length === candidateHash.length && crypto.timingSafeEqual(storedBuffer, candidateHash);
};

const base64UrlEncode = (input) => {
  return Buffer.from(JSON.stringify(input)).toString('base64url');
};

const parseDurationSeconds = (duration) => {
  const match = /^(\d+)([mhd])$/.exec(duration);
  if (!match) throw new Error(`Invalid JWT duration: ${duration}`);

  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers = { m: 60, h: 60 * 60, d: 24 * 60 * 60 };

  return amount * multipliers[unit];
};

const getJwtSecret = () => {
  return process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'development-only-change-me';
};

export const signJwt = (payload, expiresIn) => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const body = {
    ...payload,
    iat: now,
    exp: now + parseDurationSeconds(expiresIn),
  };

  const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(body)}`;
  const signature = crypto.createHmac('sha256', getJwtSecret()).update(unsignedToken).digest('base64url');

  return `${unsignedToken}.${signature}`;
};

export const verifyJwt = (token) => {
  if (typeof token !== 'string') throw new Error('Invalid token');

  const [encodedHeader, encodedPayload, signature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !signature) throw new Error('Invalid token');

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto.createHmac('sha256', getJwtSecret()).update(unsignedToken).digest('base64url');
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new Error('Invalid token');
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
};
