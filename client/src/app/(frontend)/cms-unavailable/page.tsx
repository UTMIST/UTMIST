import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/** Rewrite destination for disabled CMS pages, inside the frontend layout. */
export default function CmsUnavailablePage() {
  notFound();
}
