import {
  featuredEventSeedData,
  pageSeedData,
  partnerSeedData,
  personSeedData,
  seedSourceData,
  startupSeedData,
} from "./seed-data.ts";

type SeedCollection =
  | "careers"
  | "content-sections"
  | "events"
  | "media"
  | "pages"
  | "partners"
  | "people"
  | "posts"
  | "projects"
  | "startups";

export interface SeedPayload {
  create(args: {
    collection: SeedCollection;
    data: Record<string, unknown>;
    draft: false;
    overrideAccess: true;
  }): Promise<{ id: number | string }>;
  find(args: {
    collection: SeedCollection;
    limit: 1;
    overrideAccess: true;
    where: Record<string, { equals: unknown }>;
  }): Promise<{ docs: Array<{ id: number | string }> }>;
  findGlobalVersions(args: {
    limit: 1;
    overrideAccess: true;
    pagination: false;
    slug: "site-settings";
  }): Promise<{ docs: unknown[] }>;
  updateGlobal(args: {
    data: Record<string, unknown>;
    draft: false;
    overrideAccess: true;
    slug: "site-settings";
  }): Promise<unknown>;
}

export interface SeedResult {
  created: number;
  skipped: number;
}

export const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100)
    .replace(/-$/g, "");

const published = <T extends Record<string, unknown>>(data: T) => ({
  ...data,
  _status: "published",
});

const isHttpUrl = (value: string) => /^https?:\/\//.test(value);

async function createIfMissing(
  payload: SeedPayload,
  collection: SeedCollection,
  uniqueField: string,
  data: Record<string, unknown>,
  result: SeedResult,
) {
  const existing = await payload.find({
    collection,
    limit: 1,
    overrideAccess: true,
    where: { [uniqueField]: { equals: data[uniqueField] } },
  });

  if (existing.docs.length > 0) {
    result.skipped += 1;
    return existing.docs[0].id;
  }

  const created = await payload.create({
    collection,
    data: published(data),
    draft: false,
    overrideAccess: true,
  });
  result.created += 1;
  return created.id;
}

export async function seedPublicContent(payload: SeedPayload): Promise<SeedResult> {
  const result: SeedResult = { created: 0, skipped: 0 };

  const startupLogoIds = new Map<string, number | string>();
  for (const startup of startupSeedData) {
    const logoId = await createIfMissing(
      payload,
      "media",
      "source",
      {
        title: `${startup.name} logo`,
        kind: "image",
        source: startup.logoSource,
        altText: `${startup.name} logo`,
      },
      result,
    );
    startupLogoIds.set(startup.name, logoId);
  }

  for (const [name, website, logoSource] of partnerSeedData) {
    const logoId = await createIfMissing(
      payload,
      "media",
      "source",
      {
        title: `${name} logo`,
        kind: "image",
        source: logoSource,
        altText: `${name} logo`,
      },
      result,
    );
    await createIfMissing(
      payload,
      "partners",
      "slug",
      { name, slug: slugify(name), website, logo: logoId },
      result,
    );
  }

  for (const name of personSeedData) {
    await createIfMissing(
      payload,
      "people",
      "slug",
      { name, slug: slugify(name) },
      result,
    );
  }

  for (const startup of startupSeedData) {
    await createIfMissing(
      payload,
      "startups",
      "slug",
      {
        name: startup.name,
        slug: slugify(startup.name),
        description: startup.description,
        logo: startupLogoIds.get(startup.name),
      },
      result,
    );
  }

  for (const career of seedSourceData.careers) {
    await createIfMissing(
      payload,
      "careers",
      "slug",
      {
        title: career.title,
        slug: slugify(`${career.department}-${career.title}`),
        department: career.department,
        division: career.division || undefined,
        applicationUrl: career.applicationLink,
      },
      result,
    );
  }

  for (const project of seedSourceData.projects) {
    await createIfMissing(
      payload,
      "projects",
      "slug",
      {
        name: project.name,
        slug: slugify(project.name),
        description: project.description,
        category: project.type,
        repositoryUrl: project.github || undefined,
        destinationUrl: project.readMoreLink || undefined,
      },
      result,
    );
  }

  for (const post of seedSourceData.posts) {
    await createIfMissing(
      payload,
      "posts",
      "externalUrl",
      {
        title: post.title,
        slug: slugify(post.title),
        author: post.author,
        publishedAt: new Date(post.date).toISOString(),
        externalUrl: post.url,
      },
      result,
    );
  }

  for (const event of seedSourceData.events) {
    const isPastEvent = "overview" in event;
    await createIfMissing(
      payload,
      "events",
      "slug",
      {
        title: event.title,
        slug: slugify(`${event.id}-${event.title}`),
        kind: isPastEvent ? "workshop" : "event",
        summary: isPastEvent ? event.overview : event.description,
        dateLabel: event.date,
        instructor: isPastEvent ? event.instructor : undefined,
        venue: isPastEvent ? undefined : event.location,
        registrationUrl: isPastEvent ? undefined : event.rsvpLink,
        tags: event.tags.map((label) => ({ label })),
        learningGoals: isPastEvent
          ? event.learningGoals.map((goal) => ({ goal }))
          : undefined,
        resources: isPastEvent
          ? event.resources.filter(({ url }) => isHttpUrl(url))
          : undefined,
      },
      result,
    );
  }

  const featuredEventIds: Array<number | string> = [];
  for (const event of featuredEventSeedData) {
    const id = await createIfMissing(
      payload,
      "events",
      "slug",
      {
        title: event.title,
        slug: slugify(event.title),
        kind: "program",
        summary: event.summary,
        destinationUrl: event.destinationUrl,
      },
      result,
    );
    featuredEventIds.push(id);
  }

  for (const page of pageSeedData) {
    await createIfMissing(
      payload,
      "pages",
      "slug",
      {
        ...page,
        ...(page.slug === "events" ? { featuredEvents: featuredEventIds } : {}),
      },
      result,
    );
  }

  await createIfMissing(
    payload,
    "content-sections",
    "key",
    {
      key: "home-impact",
      heading: seedSourceData.homeImpactContent.heading,
      statistics: seedSourceData.homeImpactContent.statistics,
      status: "published",
    },
    result,
  );

  const settingsVersions = await payload.findGlobalVersions({
    limit: 1,
    overrideAccess: true,
    pagination: false,
    slug: "site-settings",
  });
  if (settingsVersions.docs.length > 0) {
    result.skipped += 1;
  } else {
    await payload.updateGlobal({
      slug: "site-settings",
      overrideAccess: true,
      draft: false,
      data: published({
        contactEmail: "utorontomist@gmail.com",
        navigation: pageSeedData.map((page) => ({
          label: page.title,
          href: page.slug === "home" ? "/" : `/${page.slug}`,
        })),
        socialLinks: [
          { label: "LinkedIn", url: "https://www.linkedin.com/company/utmist/" },
          { label: "Instagram", url: "https://www.instagram.com/uoft_utmist/" },
          { label: "YouTube", url: "https://www.youtube.com/@UTMIST" },
          { label: "GitHub", url: "https://github.com/UTMIST" },
        ],
        footerText: "University of Toronto Machine Intelligence Student Team",
      }),
    });
    result.created += 1;
  }

  return result;
}
