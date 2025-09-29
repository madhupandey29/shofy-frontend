
export async function pingSearchEngines(sitemapUrl) {
  const searchEngines = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];
  await Promise.allSettled(
    searchEngines.map(async (url) => {
      try {
        const response = await fetch(url, { method: 'GET' });
        return { url, status: response.status, success: response.ok };
      } catch (error) {
        return { url, status: 'error', success: false, error: error.message };
      }
    })
  );
 
}

export function getSitemapUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fabric-shop-frontend-production.up.railway.app';
  return `${baseUrl}/sitemap.xml`;
}


export function logSitemapStats(sitemapData) {
  const stats = {
    total: sitemapData.length,
    static: sitemapData.filter(item => 
      ['/', '/shop', '/blog', '/cart', '/wishlist', '/login', '/contact'].includes(item.url.split('/').pop() || '/')
    ).length,
    products: sitemapData.filter(item => item.url.includes('/fabric/')).length,
    blogs: sitemapData.filter(item => item.url.includes('/blog-details/')).length,
  };
  return stats;
}


export function validateSitemapData(sitemapData) {
  if (!Array.isArray(sitemapData)) {
    return false;
  }
  const requiredFields = ['url'];
  const invalidEntries = sitemapData.filter(entry => 
    !requiredFields.every(field => Object.prototype.hasOwnProperty.call(entry, field))
  );
  if (invalidEntries.length > 0) {
    return false;
  }
  return true;
} 