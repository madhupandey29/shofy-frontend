import { useSelector } from 'react-redux';

export const useAuthAction = () => {
  const { user } = useSelector((state) => state.auth);

  const requireAuth = (action) => {
    return async (...args) => {
      if (!user) {
        try {
          const currentPath = window.location.pathname + window.location.search;
          const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
          console.log('User not authenticated, redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
          return false;
        } catch (error) {
          console.error('Error during auth redirect:', error);
          window.location.href = '/login';
          return false;
        }
      }

      if (typeof action === 'function') {
        try {
          return await action(...args);
        } catch (error) {
          console.error('Error in auth action:', error);
          throw error;
        }
      }

      return true;
    };
  };

  return {
    requireAuth,
    isAuthenticated: !!user
  };
};

export const formatProductForCart = (product) => ({
  ...product,
  id: product._id || product.id,
  _id: product._id || product.id,
  title: product.title || product.name || 'Product',
  price: parseFloat(product.price) || 0,
  quantity: product.quantity || 1,
  orderQuantity: 1,
  image: product.image || product.imageUrl || '',
});

export const formatProductForWishlist = (product) => ({
  ...product,
  id: product._id || product.id,
  _id: product._id || product.id,
  title: product.title || product.name || 'Product',
  price: parseFloat(product.price) || 0,
  image: product.image || product.imageUrl || '',
});
