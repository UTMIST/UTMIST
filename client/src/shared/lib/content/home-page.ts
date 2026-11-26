import { z } from "zod";

import { statisticSchema } from "./types.ts";
import { validateContentLink } from "./links.ts";
import { sponsorAssetsBySource } from "./page-assets.ts";

const bundledSponsorAssets = Object.values(sponsorAssetsBySource);
type SponsorAsset = (typeof bundledSponsorAssets)[number];
const sponsorAsset = z.enum(bundledSponsorAssets as [SponsorAsset, ...SponsorAsset[]]);

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
const sponsorCopy = z.object({ blockType: z.literal("sponsors"), ...intro, cta: link });
const publicImage = text.refine(value =>
  /^(https:\/\/|\/(?!\/))/.test(value) && validateContentLink(value) === true,
  "Use an HTTPS image URL or a public path",
);
const sponsorItem = z.union([
  z.object({ asset: sponsorAsset, alt: text, href }),
  z.object({ src: publicImage, alt: text, href }),
]);
const sponsors = sponsorCopy.extend({ items: z.array(sponsorItem) });
const eventCopy = z.object({
  blockType: z.literal("events"), ...intro, communityStatement: text, listHeading: text,
});
const eventPlacement = z.object({
  category: text,
  artwork: z.enum(["eigenai", "cucai", "ai2", "genai-genesis"]),
  imageAlt: z.string().nullish().transform(value => value ?? ""),
});
const events = eventCopy.extend({
  items: z.array(eventPlacement.extend({
    id: z.string().nullish(), title: text, description: text, href,
  })),
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

function validateSectionSet(sections: Array<{ blockType: string }>, ctx: z.RefinementCtx) {
  for (const type of homeSectionTypes) {
    if (sections.filter(section => section.blockType === type).length !== 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Include exactly one ${type} section` });
    }
  }
}

const eventID = z.union([z.number().int().positive(), z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().positive())]);
const editableEvent = eventPlacement.extend({
  event: z.union([eventID, z.object({ id: eventID })]).transform(value => typeof value === "number" ? value : value.id),
});
export const homePagePublishSchema = z.object({
  sections: z.array(z.discriminatedUnion("blockType", [
    hero, about, impact, mission, sponsorCopy,
    eventCopy.extend({ items: z.array(editableEvent).min(1) }), startups, faq,
  ])).superRefine(validateSectionSet),
});

export const homePageSchema = z.object({
  sections: z.array(z.discriminatedUnion("blockType", [hero, about, impact, mission, sponsors, events, startups, faq]))
    .superRefine(validateSectionSet),
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

const publishedEvent = z.object({
  id: eventID,
  _status: z.literal("published"),
  title: text,
  summary: text,
  destinationUrl: href,
});
const publishedPartner = z.object({
  _status: z.literal("published"),
  name: text,
  website: href,
  logo: z.object({
    _status: z.literal("published"),
    kind: z.literal("image"),
    source: text,
    altText: z.string().nullish(),
  }),
});
const pageDocument = z.object({
  sections: z.array(z.object({ blockType: z.string() }).passthrough()),
});

export function withHomeRelationships(document: unknown, partners: unknown[]) {
  const { sections } = pageDocument.parse(document);
  return {
    sections: sections.map(section => {
      if (section.blockType === "sponsors") {
        const items = partners.flatMap(record => {
          const partner = publishedPartner.safeParse(record);
          if (!partner.success) return [];
          const { name, website, logo } = partner.data;
          const asset = sponsorAssetsBySource[logo.source as keyof typeof sponsorAssetsBySource];
          const item = sponsorItem.safeParse({
            ...(asset ? { asset } : { src: logo.source }),
            alt: logo.altText?.trim() || `${name} logo`,
            href: website,
          });
          return item.success ? [item.data] : [];
        });
        return { ...section, items };
      }
      if (section.blockType === "events") {
        const placements = z.array(eventPlacement.extend({ event: z.unknown() })).parse(section.items);
        const items = placements.flatMap(({ event, ...placement }) => {
          const record = publishedEvent.safeParse(event);
          if (!record.success) return [];
          const { id, title, summary, destinationUrl } = record.data;
          return [{ ...placement, id: String(id), title, description: summary, href: destinationUrl }];
        });
        return { ...section, items };
      }
      return section;
    }),
  };
}
