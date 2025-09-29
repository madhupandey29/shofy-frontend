export const revalidate = 0;
import blogData from '@/data/blog-data';
import { logSitemapStats, validateSitemapData } from '@/utils/sitemap-utils';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fabric-shop-frontend-production.up.railway.app';
  
  // Static pages that work
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Blog post pages with proper dates
  const blogPages = blogData.map(blog => {
    const blogDate = new Date(blog.date);
    return {
      url: `${baseUrl}/blog-details/${blog.id}`,
      lastModified: blogDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    };
  });

  // Fetch ALL products from API at runtime (this ensures new products are included)
  let productPages = [];
  try {
    let apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://adorable-gentleness-production.up.railway.app/api';
    if (!apiBaseUrl.endsWith('/api')) {
      apiBaseUrl = apiBaseUrl.replace(/\/$/, '') + '/api';
    }
    const apiUrl = `${apiBaseUrl}/newproduct/view`;
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Cache for 5 minutes to avoid hammering your API
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();

      
      if (data.data && Array.isArray(data.data)) {        
        productPages = data.data
          .filter(product => product.slug) // Only include products with slugs
          .map(product => ({
            url: `${baseUrl}/fabric/${product.slug}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          }));
      }
    }
  } catch (error) {
    // Error fetching products (silent for production)
  }

  // Combine all pages
  const allPages = [
    ...staticPages,
    ...blogPages,
    ...productPages,
    // Add a timestamp entry for debugging
    {
      url: `${baseUrl}/sitemap-generated-at-${Date.now()}`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.1,
    },
  ];

  // Validate and log statistics
  validateSitemapData(allPages);
  logSitemapStats(allPages);
  
  return allPages;
} 