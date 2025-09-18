import { useSelector } from 'react-redux';

export const useAuthCheck = () => {
  const { user } = useSelector((state) => state.auth);

  const requireAuth = (callback) => {
    return (...args) => {
      if (!user) {
        const currentPath  = typeof window !== 'undefined' ? window.location.pathname : '/';
        const searchParams = typeof window !== 'undefined' ? window.location.search   : '';
        const redirectUrl  = currentPath + searchParams;

        if (typeof window !== 'undefined') {
          window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl)}`;
        }
        return false;
      }
      return callback(...args);
    };
  };

  return { requireAuth, isAuthenticated: !!user };
};
