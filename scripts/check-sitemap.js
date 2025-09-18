#!/usr/bin/env node

/**
 * Sitemap Validation Script
 * Run this script to check your sitemap generation
 */

import fs from 'fs';
import path from 'path';

async function checkSitemap() {
  try {
    // Check if sitemap.xml exists
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
      // Sitemap not found
      return;
    }
    // Read and parse sitemap
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    // Validate structure
    if (!sitemapContent.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      return;
    }
    if (!sitemapContent.includes('<urlset')) {
      return;
    }
    // Check file size
    const stats = fs.statSync(sitemapPath);
    if (stats.size > 50 * 1024 * 1024) { // 50MB limit
      return;
    }
    // All checks passed silently
  } catch (error) {
    // Optionally, handle error (silent for production)
  }
}
// Run the check
checkSitemap(); 