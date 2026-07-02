import type { Metadata } from 'next'
import BlogDetails from "@/pages/BlogDetails";
import { settingsApi } from "@/lib/settingsApi";
import authService from "@/lib/authService";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await settingsApi.getPublicBlogByTitle(params.slug);
  if (!blog) {
    return {
      title: 'Blog Post Not Found | UniCare Homeopathy',
    }
  }

  const title = `${blog.title} | UniCare Homeopathy`
  const description = blog.short_description || `Read our blog article about ${blog.title}.`
  const imageUrl = blog.image_url ? authService.getFileUrl(blog.image_url) : 'https://www.unicarehomeopathy.com/images/og-main.jpg'

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://www.unicarehomeopathy.com/blog/${params.slug}`,
      publishedTime: blog.createdAt,
      authors: [blog.author || 'UniCare Team'],
      images: [
        {
          url: imageUrl,
          alt: blog.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    }
  }
}

export default async function BlogPage({ params }: Props) {
  const blog = await settingsApi.getPublicBlogByTitle(params.slug);
  
  if (!blog) {
    notFound();
  }

  const imageUrl = blog.image_url ? authService.getFileUrl(blog.image_url) : 'https://www.unicarehomeopathy.com/images/og-main.jpg'

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": imageUrl,
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "author": {
      "@type": "Person",
      "name": blog.author || "UniCare Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "UniCare Homeopathy",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.unicarehomeopathy.com/images/logo-dark.png"
      }
    },
    "description": blog.short_description || blog.title
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <BlogDetails />
    </>
  );
}
