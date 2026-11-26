import "server-only";

import { payloadPageReader, readCmsContent } from "@/shared/lib/server";
import { homePageContent, homePageDefinition } from "@/features/public-site/data/home-page";

export function readHomePage() {
  return readCmsContent({ definition: homePageDefinition, fallback: homePageContent, reader: payloadPageReader });
}
