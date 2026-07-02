import { NextResponse } from 'next/server';
import { settingsApi } from '@/lib/settingsApi';
import { slugify } from '../../lib/utils';

export async function GET() {
  const baseUrl = 'https://www.unicarehomeopathy.com';

  const staticRoutes = [
    '',
    '/about',
    '/blogs',
    '/specialties',
    '/privacy-policy',
    '/terms-of-service',
    '/shipping-policy',
    '/cancellation-refund',
  ];

  let items = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? '1.0' : '0.8',
  }));

  // Dynamic Treatments
  try {
    const treatments = await settingsApi.getPublicTreatments();
    if (Array.isArray(treatments)) {
      const treatmentUrls = treatments
        .filter((t: any) => t.status === 'active')
        .map((t: any) => ({
          url: `${baseUrl}/treatment/${t.slug || t.id}`,
          lastModified: new Date(t.updatedAt || new Date()).toISOString(),
          changeFrequency: 'weekly',
          priority: '0.7',
        }));
      items = [...items, ...treatmentUrls];
    }
  } catch (error) {
    console.error('Sitemap treatments fetch error:', error);
  }

  // Dynamic Blogs
  try {
    const blogs = await settingsApi.getPublicBlogs(100, 0);
    if (Array.isArray(blogs)) {
      const blogUrls = blogs
        .filter((b: any) => b.status === 'active')
        .map((b: any) => ({
          url: `${baseUrl}/blog/${b.slug || slugify(b.title)}`,
          lastModified: new Date(b.updatedAt || b.createdAt || new Date()).toISOString(),
          changeFrequency: 'weekly',
          priority: '0.6',
        }));
      items = [...items, ...blogUrls];
    }
  } catch (error) {
    console.error('Sitemap blogs fetch error:', error);
  }

  // Dynamic Clinics
  try {
    const branches = await settingsApi.getPublicBranches();
    if (Array.isArray(branches)) {
      const clinicUrls = branches.map((b: any) => ({
        url: `${baseUrl}/clinics/${b.slug || b.id}`,
        lastModified: new Date(b.updatedAt || new Date()).toISOString(),
        changeFrequency: 'monthly',
        priority: '0.6',
      }));
      items = [...items, ...clinicUrls];
    }
  } catch (error) {
    console.error('Sitemap branches fetch error:', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${items.map((item) => `
  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
