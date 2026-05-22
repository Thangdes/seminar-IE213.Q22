import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clearAuthSession,
  getStoredProfile,
  saveAuthSession,
  saveStoredProfile,
} from '../src/utils/auth.js';

function createStorageMock() {
  const store = new Map();

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

test('auth helpers save, read and clear session data', () => {
  globalThis.localStorage = createStorageMock();

  saveAuthSession({ accessToken: 'access-token', refreshToken: 'refresh-token' });
  saveStoredProfile({
    _id: 'user-1',
    email: 'student@example.com',
    role: 'user',
    fullName: 'Student Name',
    displayName: 'Student',
  });

  assert.deepEqual(getStoredProfile(), {
    id: 'user-1',
    email: 'student@example.com',
    role: 'user',
    fullName: 'Student Name',
    displayName: 'Student',
    avatarUrl: '',
    bio: '',
  });

  clearAuthSession();

  assert.equal(globalThis.localStorage.getItem('accessToken'), null);
  assert.equal(globalThis.localStorage.getItem('refreshToken'), null);
  assert.equal(globalThis.localStorage.getItem('authProfile'), null);
});