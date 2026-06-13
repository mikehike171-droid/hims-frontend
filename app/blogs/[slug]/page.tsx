import { redirect } from "next/navigation";

interface Props {
  params: { slug: string };
}

export default function BlogsSlugRedirectPage({ params }: Props) {
  redirect(`/blog/${params.slug}`);
}
