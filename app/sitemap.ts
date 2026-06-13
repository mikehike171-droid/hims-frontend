import { MetadataRoute } from 'next'
import { settingsApi } from '@/lib/settingsApi'
import { slugify } from '../lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.unicarehomeopathy.com'

  // Static URLs
  const staticUrls = [
    '',
    '/about',
    '/blogs',
    '/specialties',
    '/privacy-policy',
    '/terms-of-service',
    '/shipping-policy',
    '/cancellation-refund',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Dynamic Treatments
  let treatmentUrls: any[] = []
  try {
    const treatments = await settingsApi.getPublicTreatments()
    if (Array.isArray(treatments)) {
      treatmentUrls = treatments
        .filter((t: any) => t.status === 'active')
        .map((t: any) => ({
          url: `${baseUrl}/treatment/${t.slug || t.id}`,
          lastModified: new Date(t.updatedAt || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
    }
  } catch (error) {
    console.error('Sitemap treatments fetch error:', error)
  }

  // Dynamic Blogs
  let blogUrls: any[] = []
  try {
    const blogs = await settingsApi.getPublicBlogs(100, 0)
    if (Array.isArray(blogs)) {
      blogUrls = blogs
        .filter((b: any) => b.status === 'active')
        .map((b: any) => ({
          url: `${baseUrl}/blog/${slugify(b.title)}`,
          lastModified: new Date(b.updatedAt || b.createdAt || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
    }
  } catch (error) {
    console.error('Sitemap blogs fetch error:', error)
  }

  // Dynamic Clinics
  let clinicUrls: any[] = []
  try {
    const branches = await settingsApi.getPublicBranches()
    if (Array.isArray(branches)) {
      clinicUrls = branches.map((b: any) => ({
        url: `${baseUrl}/clinics/${b.slug || b.id}`,
        lastModified: new Date(b.updatedAt || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Sitemap branches fetch error:', error)
  }

  return [...staticUrls, ...treatmentUrls, ...blogUrls, ...clinicUrls]
}
