export const getAuthUser = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearAuthSession();
      return null;
    }
    const storedProfile = getStoredProfile();
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role || 'user',
      isAdmin: payload.role === 'admin',
      fullName: storedProfile?.fullName || '',
      displayName: storedProfile?.displayName || '',
      avatarUrl: storedProfile?.avatarUrl || '',
      bio: storedProfile?.bio || '',
    };
  } catch {
    clearAuthSession();
    return null;
  }
};

export const saveAuthSession = ({ accessToken, refreshToken }) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getStoredProfile = () => {
  try {
    return JSON.parse(localStorage.getItem('authProfile') || 'null');
  } catch {
    return null;
  }
};

export const saveStoredProfile = (profile) => {
  localStorage.setItem('authProfile', JSON.stringify({
    id: profile._id || profile.id,
    email: profile.email,
    role: profile.role || 'user',
    fullName: profile.fullName || '',
    displayName: profile.displayName || '',
    avatarUrl: profile.avatarUrl || '',
    bio: profile.bio || '',
  }));
};

export const clearAuthSession = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('authProfile');
};
