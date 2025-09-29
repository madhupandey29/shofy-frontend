export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fabric-shop-frontend-production.up.railway.app';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/shop',
          '/blog',
          '/cart',
          '/wishlist',
          '/login',
          '/contact',
          '/fabric/*',
          '/blog-details/*',
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/_next/*',
          '/checkout',
          '/404',
          '/500',
          '/not-found',
          '/error',
          '/email-verify/*',
          '/forget-password/*',
          '/order/*',
          '/product-details/*',
          '/blog-details-2/*',
          '/shop-right-sidebar',
          '/shop-hidden-sidebar',
          '/shop-category',
          '/product-details-video',
          '/product-details-countdown',
          '/product-details-swatches',
          '/blog-grid',
          '/blog-list',
          '/compare',
          '/coupon',
          '/forgot',
          '/register',
          '/profile',
          '/search',
          '/home-3',
          '/home-4'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 