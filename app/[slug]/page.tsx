import { redirect, notFound } from "next/navigation";
import { settingsApi } from "@/lib/settingsApi";

interface Props {
  params: { slug: string };
}

export default async function CatchAllSlugPage({ params }: Props) {
  const { slug } = params;

  // 1. Check if the slug matches an active treatment
  try {
    const treatment = await settingsApi.getPublicTreatmentBySlug(slug);
    if (treatment) {
      redirect(`/treatment/${slug}`);
    }
  } catch (error) {
    console.error("CatchAll redirect: error checking treatment slug", error);
  }

  // 2. Check if the slug matches a clinic branch
  try {
    const branch = await settingsApi.getPublicBranchBySlug(slug);
    if (branch) {
      redirect(`/clinics/${slug}`);
    }
  } catch (error) {
    console.error("CatchAll redirect: error checking clinic slug", error);
  }

  // 3. If it matches neither, render the standard 404 page
  notFound();
}
