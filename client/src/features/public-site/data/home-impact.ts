import { z } from "zod";

import { contentSectionSchema, statisticSchema } from "@/shared/lib";
import { homeImpactContentData } from "@/features/public-site/data/home-impact-content";

export const homeImpactDefinition = {
  key: "home-impact",
  schema: contentSectionSchema.extend({ statistics: z.array(statisticSchema).min(1) }),
};

export type HomeImpactContent = z.infer<typeof homeImpactDefinition.schema>;

export const homeImpactContent: HomeImpactContent = homeImpactContentData;
