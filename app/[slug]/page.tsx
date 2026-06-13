import { redirect, notFound } from "next/navigation";
import { settingsApi } from "@/lib/settingsApi";
import { slugify } from "../../lib/utils";

interface Props {
  params: { slug: string };
}

export default async function CatchAllSlugPage({ params }: Props) {
  const { slug } = params;
  const normalizedReq = slug.toLowerCase().trim();

  // Static redirects for common legacy paths
  if (normalizedReq === 'treatment' || normalizedReq === 'treatments') {
    redirect('/specialties');
  }
  if (normalizedReq === 'clinic') {
    redirect('/#clinics');
  }
  if (normalizedReq === 'about-us') {
    redirect('/about');
  }
  if (normalizedReq === 'contact' || normalizedReq === 'contact-us') {
    redirect('/#appointment');
  }

  let redirectTo: string | null = null;

  // 1. Fetch all treatments and find a robust match by slug or name
  try {
    const treatments = await settingsApi.getPublicTreatments();
    if (Array.isArray(treatments)) {
      const matched = treatments.find((t: any) => {
        if (t.status !== 'active') return false;
        const dbSlug = (t.slug || '').toLowerCase().trim();
        const dbNameSlug = slugify(t.name || '').toLowerCase().trim();
        return dbSlug === normalizedReq || dbNameSlug === normalizedReq;
      });

      if (matched) {
        redirectTo = `/treatment/${matched.slug || matched.id}`;
      }
    }
  } catch (error) {
    console.error("CatchAll redirect: error checking treatments list", error);
  }

  // 2. Fetch all clinic branches and find a robust match by slug or name
  if (!redirectTo) {
    try {
      const branches = await settingsApi.getPublicBranches();
      if (Array.isArray(branches)) {
        const matched = branches.find((b: any) => {
          const dbSlug = (b.slug || b.id || '').toString().toLowerCase().trim();
          const dbNameSlug = slugify(b.name || '').toLowerCase().trim();
          return dbSlug === normalizedReq || dbNameSlug === normalizedReq;
        });

        if (matched) {
          redirectTo = `/clinics/${matched.slug || matched.id}`;
        }
      }
    } catch (error) {
      console.error("CatchAll redirect: error checking branches list", error);
    }
  }

  // Perform redirect outside of try-catch blocks
  if (redirectTo) {
    redirect(redirectTo);
  }

  // 3. If it matches neither, render the standard 404 page
  notFound();
}
