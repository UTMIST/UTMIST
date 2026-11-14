/** @jest-environment node */
import { homePageSchema } from "@/shared/lib";
import { Pages } from "@/cms/collections/Pages";
import { readHomePage } from "@/features/public-site/lib/home-page";
import { homePageContent } from "@/features/public-site/data/home-page";
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

const originalEnv = process.env;
beforeEach(() => {
  jest.clearAllMocks();
  process.env = { ...originalEnv, NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "preview" };
  mockEvaluate.mockResolvedValue(true);
  mockFind.mockResolvedValue({ docs: [document] });
});
afterEach(() => { process.env = originalEnv; });

it("uses the shared Preview policy and reads only published page content without editor context", async () => {
  await expect(readHomePage()).resolves.toEqual(homePageContent);
  expect(mockConnection).toHaveBeenCalledTimes(1);
  expect(mockFind).toHaveBeenCalledWith({
    collection: "pages", draft: false, overrideAccess: false, depth: 0, limit: 1, pagination: false,
    where: { and: [{ slug: { equals: "home" } }, { _status: { equals: "published" } }] },
  });
});

it("reads newly published edits on the next request without caching", async () => {
  const edited = structuredClone(document);
  edited.sections[0].heading = "Edited homepage";
  mockFind.mockResolvedValueOnce({ docs: [document] }).mockResolvedValueOnce({ docs: [edited] });
  await readHomePage();
  expect((await readHomePage()).hero.heading).toBe("Edited homepage");
  expect(mockFind).toHaveBeenCalledTimes(2);
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

describe("homepage publication structure", () => {
  const field = Pages.fields.find(field => "name" in field && field.name === "sections");
  if (!field || field.type !== "blocks" || !field.validate) throw new Error("Missing section validation");
  const validate = field.validate;
  const args = { data: { slug: "home", _status: "published" } } as unknown as Parameters<typeof validate>[1];
  const requiredSections = ["hero", "about", "impact", "mission", "sponsors", "events", "startups", "faq"] as const;

  it.each(["original", "reversed"])("accepts a complete homepage in %s section order", async order => {
    const sections = order === "original" ? document.sections : [...document.sections].reverse();
    expect(await validate(sections, args)).toBe(true);
    expect(homePageSchema.safeParse({ sections }).success).toBe(true);
  });

  it.each(requiredSections)("rejects publishing or reading Home without its %s section", async type => {
    const sections = document.sections.filter(section => section.blockType !== type);
    expect(await validate(sections, args)).toContain(`exactly one ${type}`);
    expect(homePageSchema.safeParse({ sections }).success).toBe(false);
  });

  it.each(requiredSections)("rejects publishing or reading Home with a duplicate %s section", async type => {
    const sections = [...document.sections, ...document.sections.filter(section => section.blockType === type)];
    expect(await validate(sections, args)).toContain(`exactly one ${type}`);
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
