import { z } from "zod";

import { statisticSchema } from "./types.ts";
import { validateContentLink } from "./links.ts";
import { sponsorAssetOptions } from "./page-assets.ts";

type SponsorAsset = typeof sponsorAssetOptions[number]["value"];
const sponsorAsset = z.enum(sponsorAssetOptions.map(option => option.value) as [SponsorAsset, ...SponsorAsset[]]);

const text = z.string().trim().min(1);
const href = text.refine(value => validateContentLink(value) === true, "Invalid content link");
const link = z.object({ label: text, href });
const intro = { eyebrow: text, heading: text, description: text };
const hero = z.object({ blockType: z.literal("hero"), ...intro, links: z.array(link).min(1) });
const about = z.object({ blockType: z.literal("about"), ...intro, cta: link, imageAlt: text, caption: text });
const impact = z.object({
  blockType: z.literal("impact"), heading: text,
  description: z.string().nullish().transform(value => value || undefined),
  statistics: z.array(statisticSchema).min(1),
});
const mission = z.object({ blockType: z.literal("mission"), ...intro, cta: link });
const sponsors = z.object({
  blockType: z.literal("sponsors"), ...intro, cta: link,
  items: z.array(z.object({
    asset: sponsorAsset,
    alt: text, href,
  })).min(1),
});
const events = z.object({
  blockType: z.literal("events"), ...intro, communityStatement: text, listHeading: text,
  items: z.array(z.object({
    id: z.string().nullish(), title: text, description: text, category: text, href,
    artwork: z.enum(["eigenai", "cucai", "ai2", "genai-genesis"]),
    imageAlt: z.string().nullish().transform(value => value ?? ""),
  })).min(1),
});
const startups = z.object({
  blockType: z.literal("startups"), ...intro, cta: link,
  benefits: z.array(z.object({ title: text, description: text })).min(1),
});
const faq = z.object({
  blockType: z.literal("faq"), eyebrow: text, heading: text,
  items: z.array(z.object({ question: text, answer: text })).min(1),
});

export const homeSectionTypes = ["hero", "about", "impact", "mission", "sponsors", "events", "startups", "faq"] as const;

/** Shared by publishing validation and public reads; block order is presentation-owned. */
export const homePageSchema = z.object({
  sections: z.array(z.discriminatedUnion("blockType", [hero, about, impact, mission, sponsors, events, startups, faq]))
    .superRefine((sections, ctx) => {
      for (const type of homeSectionTypes) {
        if (sections.filter(section => section.blockType === type).length !== 1) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Include exactly one ${type} section` });
        }
      }
    }),
}).transform(({ sections }) => ({
  hero: sections.find(section => section.blockType === "hero")!,
  about: sections.find(section => section.blockType === "about")!,
  impact: sections.find(section => section.blockType === "impact")!,
  mission: sections.find(section => section.blockType === "mission")!,
  sponsors: sections.find(section => section.blockType === "sponsors")!,
  events: sections.find(section => section.blockType === "events")!,
  startups: sections.find(section => section.blockType === "startups")!,
  faq: sections.find(section => section.blockType === "faq")!,
}));

export type HomePageContent = z.infer<typeof homePageSchema>;
