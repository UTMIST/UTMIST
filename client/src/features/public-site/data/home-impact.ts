import { z } from "zod";

import { contentSectionSchema, statisticSchema } from "@/shared/lib";

export const homeImpactDefinition = {
  key: "home-impact",
  schema: contentSectionSchema.extend({ statistics: z.array(statisticSchema).min(1) }),
};

export type HomeImpactContent = z.infer<typeof homeImpactDefinition.schema>;

/** Existing deployed content; also reused explicitly in offline examples/tests. */
export const homeImpactContent: HomeImpactContent = {
  heading: "UTMIST is North America's largest student-led organization for Artificial Intelligence and Machine Learning",
  statistics: [
    { number: "500+", description: "developers across all teams and departments" },
    { number: "50+", description: "AI/ML projects completed" },
    { number: "20+", description: "industry partners and collaborations" },
    { number: "50+", description: "academic workshops conducted" },
    { number: "50+", description: "articles and notebooks published" },
    { number: "10+", description: "papers published in top-tier conferences" },
  ],
};
