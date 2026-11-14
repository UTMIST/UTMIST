import { homePageContent } from "@/features/public-site/data/home-page";
import { z } from "zod";

import { contentSectionSchema, statisticSchema } from "@/shared/lib";

export const homeImpactDefinition = {
  key: "home-impact",
  schema: contentSectionSchema.extend({ statistics: z.array(statisticSchema).min(1) }),
};

export type HomeImpactContent = z.infer<typeof homeImpactDefinition.schema>;

/** Static content also used by the legacy homepage and explicit offline examples. */
export const homeImpactContent: HomeImpactContent = homeImpactDefinition.schema.parse(homePageContent.impact);
