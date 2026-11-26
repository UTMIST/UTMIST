/** @jest-environment node */
import { homePageSchema } from "@/shared/lib";
import { Pages } from "@/cms/collections/Pages";
import { readHomePage } from "@/features/public-site/lib/home-page";
import { homePageContent, staticHomeSponsorItems } from "@/features/public-site/data/home-page";
import document from "@/features/public-site/data/home-page.json";

const mockFind = jest.fn();
const mockEvaluate = jest.fn();
const mockConnection = jest.fn();
jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("next/server", () => ({ connection: () => mockConnection() }));
jest.mock("payload", () => ({ getPayload: async () => ({ find: mockFind }) }));
jest.mock("../../payload.config", () => ({ __esModule: true, default: {} }));
jest.mock("@/shared/lib/flags/server", () => ({ evaluateFlag: () => mockEvaluate() }));
jest.mock("@/shared/lib/server", () => ({
  ...jest.requireActual("@/shared/lib/content/cms"),
  ...jest.requireActual("@/shared/lib/content/payload"),
}));

const cmsHome = {
  sections: document.sections.map(section => section.blockType === "events"
    ? {
        ...section,
        items: homePageContent.events.items.map(item => ({
          ...item,
          event: {
            id: 1, _status: "published", title: item.title,
            summary: item.description, destinationUrl: item.href,
          },
        })),
      }
    : section),
};

const publishedSponsor = {
  _status: "published", name: "Example partner", website: "https://example.com",
  logo: { kind: "image", _status: "published", source: "/logo.svg", altText: null },
};

const originalEnv = process.env;
beforeEach(() => {
  jest.clearAllMocks();
  process.env = { ...originalEnv, NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "preview" };
  mockEvaluate.mockResolvedValue(true);
  mockFind.mockImplementation(async ({ collection }) => ({
    docs: collection === "pages" ? [cmsHome] : [publishedSponsor],
  }));
});
afterEach(() => { process.env = originalEnv; });

it("preserves the source sponsor order for the legacy layout", () => {
  expect(staticHomeSponsorItems).toEqual(homePageSchema.parse(document).sponsors.items);
  expect(homePageContent.sponsors.items).not.toBe(staticHomeSponsorItems);
});

it("uses the shared Preview policy and reads only published page content without editor context", async () => {
  await expect(readHomePage()).resolves.toMatchObject({ hero: homePageContent.hero });
  expect(mockConnection).toHaveBeenCalledTimes(1);
  expect(mockFind).toHaveBeenCalledWith({
    collection: "pages", draft: false, overrideAccess: false, depth: 1, limit: 1, pagination: false,
    where: { and: [{ slug: { equals: "home" } }, { _status: { equals: "published" } }] },
  });
});

it("reads newly published edits on the next request without caching", async () => {
  const edited = structuredClone(cmsHome);
  edited.sections[0].heading = "Edited homepage";
  await readHomePage();
  mockFind.mockResolvedValueOnce({ docs: [edited] });
  expect((await readHomePage()).hero.heading).toBe("Edited homepage");
  expect(mockFind).toHaveBeenCalledTimes(4);
});

it("lists published partners marked for Home and uses their published logos", async () => {
  mockFind.mockResolvedValueOnce({ docs: [cmsHome] }).mockResolvedValueOnce({
    docs: [
      {
        ...publishedSponsor,
        website: "http://example.com/with space",
        logo: { ...publishedSponsor.logo, source: "HTTPS://example.com/my logo.svg" },
      },
      { ...publishedSponsor, _status: "draft" },
      { ...publishedSponsor, logo: { ...publishedSponsor.logo, _status: "draft" } },
    ],
  });
  const { sponsors } = await readHomePage();
  expect(mockFind).toHaveBeenLastCalledWith({
    collection: "partners", where: { showOnHome: { equals: true }, _status: { equals: "published" } },
    overrideAccess: false, draft: false, depth: 1, pagination: false, sort: ["name", "id"],
  });
  expect(sponsors.items).toEqual([{
    src: "https://example.com/my%20logo.svg",
    alt: "Example partner logo",
    href: "http://example.com/with%20space",
  }]);
});

it.each([
  ["frv-black-logo.png", "front-row-ventures"],
  ["forum-black-purple-logo.png", "forum-ventures"],
])("can display a published partner using bundled logo %s", async (file, asset) => {
  mockFind.mockResolvedValueOnce({ docs: [cmsHome] }).mockResolvedValueOnce({
    docs: [{
      ...publishedSponsor,
      logo: { ...publishedSponsor.logo, source: `src/assets/photos/ventures/${file}` },
    }],
  });
  const { sponsors } = await readHomePage();
  expect(sponsors.items).toMatchObject([{ asset }]);
});

it("uses published event fields and omits unavailable event relationships", async () => {
  const page = structuredClone(cmsHome);
  const section = page.sections.find(section => section.items?.some(item => "event" in item));
  if (!section?.items) throw new Error("Missing events fixture");
  if (!("event" in section.items[0]) || !("event" in section.items[1])) throw new Error("Missing event records");
  section.items[0].event.title = "Edited event";
  section.items[1].event._status = "draft";
  mockFind.mockResolvedValueOnce({ docs: [page] });
  const { events } = await readHomePage();
  expect(events.items.map(item => item.title)).toEqual(["Edited event", "AI Squared", "GenAI"]);
});

it("retains distinct placement IDs for cards linked to the same event", async () => {
  const card = homePageContent.events.items[0];
  const event = {
    id: 1, _status: "published", title: card.title,
    summary: card.description, destinationUrl: card.href,
  };
  const page = {
    sections: cmsHome.sections.map(section => section.blockType === "events"
      ? { ...section, items: ["placement-a", "placement-b"].map(id => ({ ...card, id, event })) }
      : section),
  };
  mockFind.mockResolvedValueOnce({ docs: [page] });

  const { events } = await readHomePage();
  expect(events.items.map(({ id }) => id)).toEqual(["placement-a", "placement-b"]);
});

it("normalizes a published event's destination or registration link", async () => {
  const page = {
    sections: document.sections.map(section => section.blockType === "events"
      ? {
          ...section,
          items: homePageContent.events.items.slice(0, 3).map((item, index) => ({
            ...item,
            event: {
              _status: "published", id: index + 1, title: item.title, summary: item.description,
              destinationUrl: ["http://example.com/my event", "/events/my event?year=2026#info", null][index],
              registrationUrl: "https://example.com/register here",
            },
          })),
        }
      : section),
  };
  mockFind.mockResolvedValueOnce({ docs: [page] });
  const { events } = await readHomePage();
  expect(events.items.map(item => item.href)).toEqual([
    "http://example.com/my%20event",
    "/events/my%20event?year=2026#info",
    "https://example.com/register%20here",
  ]);
});

it.each(["off", "production"])("retains static content without querying Pages when %s", async mode => {
  if (mode === "off") mockEvaluate.mockResolvedValue(false);
  else process.env.VERCEL_ENV = "production";
  await expect(readHomePage()).resolves.toBe(homePageContent);
  expect(mockFind).not.toHaveBeenCalled();
});

it.each([{ docs: [] }, { docs: [{ sections: [] }] }])("fails explicitly when published content is missing or malformed", async ({ docs }) => {
  mockFind.mockResolvedValue({ docs });
  await expect(readHomePage()).rejects.toThrow("CMS content");
});

it("redacts database errors without returning static content", async () => {
  mockFind.mockRejectedValue(new Error("postgres://private"));
  await expect(readHomePage()).rejects.toThrow("CMS content unavailable");
});

it("rejects unsafe links and unknown assets before rendering", () => {
  for (const changed of [
    { ...homePageContent.sponsors, items: [{ asset: "unknown", alt: "Logo", href: "/" }] },
    { ...homePageContent.hero, links: [{ label: "Link", href: "javascript:alert(1)" }] },
  ]) {
    const sections = document.sections.map(section => section.blockType === changed.blockType ? changed : section);
    expect(homePageSchema.safeParse({ sections }).success).toBe(false);
  }
});

it("renders an accepted HTTPS CTA as an absolute URL", () => {
  const sections = document.sections.map(section => section.blockType === "hero"
    ? { ...section, links: [{ label: "Visit", href: "https:example.com/visit" }] }
    : section);

  const page = homePageSchema.parse({ sections });
  expect(page.hero.links[0].href).toBe("https://example.com/visit");
});

describe("homepage publication structure", () => {
  const field = Pages.fields.find(field => "name" in field && field.name === "sections");
  if (!field || field.type !== "blocks" || !field.validate) throw new Error("Missing section validation");
  const validate = field.validate;
  const args = { data: { slug: "home", _status: "published" } } as unknown as Parameters<typeof validate>[1];
  const requiredSections = ["hero", "about", "impact", "mission", "sponsors", "events", "startups", "faq"] as const;

  it.each(["original", "reversed"])("accepts a complete homepage in %s section order", async order => {
    const sections = order === "original" ? cmsHome.sections : [...cmsHome.sections].reverse();
    expect(await validate(sections, args)).toBe(true);
    expect(homePageSchema.safeParse(document).success).toBe(true);
  });

  it.each(requiredSections)("rejects publishing or reading Home without its %s section", async type => {
    const sections = document.sections.filter(section => section.blockType !== type);
    expect(await validate(cmsHome.sections.filter(section => section.blockType !== type), args)).toContain(`exactly one ${type}`);
    expect(homePageSchema.safeParse({ sections }).success).toBe(false);
  });

  it.each(requiredSections)("rejects publishing or reading Home with a duplicate %s section", async type => {
    const sections = [...document.sections, ...document.sections.filter(section => section.blockType === type)];
    expect(await validate([...cmsHome.sections, ...cmsHome.sections.filter(section => section.blockType === type)], args)).toContain(`exactly one ${type}`);
    expect(homePageSchema.safeParse({ sections }).success).toBe(false);
  });

  it("rejects an empty homepage", async () => {
    expect(await validate([], args)).not.toBe(true);
    expect(homePageSchema.safeParse({ sections: [] }).success).toBe(false);
  });

  it("does not impose the homepage section set on other pages", async () => {
    expect(await validate(document.sections.slice(0, 1), {
      ...args, data: { slug: "events", _status: "published" },
    })).toBe(true);
  });
});
