import test from 'node:test';
import assert from 'node:assert/strict';

import {
  hashPassword,
  isValidEmail,
  sanitizeEmail,
  sanitizeString,
  signJwt,
  verifyJwt,
  verifyPassword,
} from '../utils/authUtils.js';

process.env.JWT_SECRET = 'test-secret';

test('isValidEmail accepts a valid email and rejects an invalid one', () => {
  assert.equal(isValidEmail('student@example.com'), true);
  assert.equal(isValidEmail('not-an-email'), false);
});

test('sanitize helpers normalize string input safely', () => {
  assert.equal(sanitizeString('  <b>Hello</b>\u0000 '), 'bHello/b');
  assert.equal(sanitizeEmail('  USER@Example.COM '), 'user@example.com');
});

test('password hashing and JWT utilities round-trip correctly', () => {
  const passwordHash = hashPassword('secret-password');
  assert.equal(verifyPassword('secret-password', passwordHash), true);
  assert.equal(verifyPassword('wrong-password', passwordHash), false);

  const token = signJwt({ sub: 'user-1', email: 'student@example.com', role: 'user' }, '1h');
  const payload = verifyJwt(token);

  assert.equal(payload.sub, 'user-1');
  assert.equal(payload.email, 'student@example.com');
  assert.equal(payload.role, 'user');
});