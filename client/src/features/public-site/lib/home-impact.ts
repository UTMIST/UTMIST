import "server-only";

import { readCmsContent } from "@/shared/lib/server";
import { homeImpactContent, homeImpactDefinition } from "@/features/public-site/data/home-impact";

/** Bind the homepage definition and fallback to the shared CMS source policy. */
export async function readHomeImpact() {
  return readCmsContent({
    definition: homeImpactDefinition,
    fallback: homeImpactContent,
  });
}
