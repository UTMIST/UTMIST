/** @jest-environment node */
import type { AccessArgs } from "payload";
import { AcademicsPages } from "@/cms/collections/AcademicsPages";
import { academicsContentSchema, academicsImageSchema, academicsLinkSchema } from "@/shared/lib";
import { academicsContent, academicsDefinition } from "@/features/public-site/data/academics";
import { readAcademics } from "@/features/public-site/lib/academics";
import { payloadAcademicsReader } from "@/shared/lib/content/payload-academics";

const mockFind = jest.fn();
const mockGetPayload = jest.fn(async () => ({ find: mockFind }));
const mockEvaluate = jest.fn();
const mockConnection = jest.fn();
jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("payload", () => ({ getPayload: () => mockGetPayload() }));
jest.mock("../../payload.config", () => ({ __esModule: true, default: {} }));
jest.mock("next/server", () => ({ connection: () => mockConnection() }));
jest.mock("@/shared/lib/server", () => ({
  contentOrThrow: jest.requireActual("@/shared/lib/content/reader").contentOrThrow,
  payloadAcademicsReader: jest.requireActual("@/shared/lib/content/payload-academics").payloadAcademicsReader,
  evaluateFlag: (...args: unknown[]) => mockEvaluate(...args),
}));

const originalEnv = process.env;
beforeEach(() => {
  process.env = { ...originalEnv, NODE_ENV: "development" };
  delete process.env.VERCEL;
  delete process.env.VERCEL_ENV;
  jest.clearAllMocks();
  mockEvaluate.mockResolvedValue(true);
  mockFind.mockReset().mockResolvedValue({ docs: [academicsContent] });
});
afterEach(() => { process.env = originalEnv; });

describe("Academics editorial permissions", () => {
  it.each([null, { collection: "members" }, { role: "admin" }, { collection: "cms-users" }])("checks editor identity for %j", async (user) => {
    const args = { req: { user } } as AccessArgs;
    const allowed = user?.collection === "cms-users";
    for (const operation of ["create", "update", "delete", "readVersions"] as const) {
      expect(await AcademicsPages.access?.[operation]?.(args)).toBe(allowed);
    }
    expect(await AcademicsPages.access?.read?.(args)).toEqual(allowed ? true : { _status: { equals: "published" } });
  });
});

describe("Academics content validation", () => {
  it("normalizes cleared optional fields and strips CMS metadata", () => {
    const result = academicsContentSchema.parse({
      ...academicsContent, _status: "published", updatedAt: "private",
      kickoff: { ...academicsContent.kickoff, dateTime: null, resources: { slides: "", code: null } },
      teamNotice: " ", team: [{ ...academicsContent.team[0], image: null, isDirector: null }],
    });
    expect(result).not.toHaveProperty("_status");
    expect(result.kickoff.resources.slides).toBeUndefined();
    expect(result.kickoff.resources.code).toBeUndefined();
    expect(result.kickoff.dateTime).toBeUndefined();
    expect(result.teamNotice).toBeUndefined();
    expect(result.team[0].image).toBeUndefined();
    expect(result.team[0].isDirector).toBe(false);
  });

  it.each(["javascript:alert(1)", "data:text/html,hello", "//example.org", "/\\example.org", "https://user:pass@example.org"])("rejects unsafe link %s", (url) => {
    expect(academicsLinkSchema.safeParse(url).success).toBe(false);
    expect(academicsContentSchema.safeParse({ ...academicsContent, kickoff: { ...academicsContent.kickoff, resources: { code: url } } }).success).toBe(false);
  });

  it.each(["/ml-fundamentals/2025", "https://example.org/slides.pdf"])("accepts supported link %s", (url) => {
    expect(academicsLinkSchema.safeParse(url).success).toBe(true);
  });

  it.each([
    ["/academics-redesign/workshop.png", true],
    ["https://project.supabase.co/storage/v1/object/public/photos/person.png", true],
    ["https://example.org/person.png", false],
    ["https://project.supabase.co/storage/v1/object/sign/photos/person.png", false],
    ["//example.org/person.png", false],
  ])("restricts images to the existing public asset policy (%s)", (url, valid) => {
    expect(academicsImageSchema.safeParse(url).success).toBe(valid);
  });

  it("rejects unlabeled FAQ links, impossible dates and empty published content", () => {
    expect(academicsContentSchema.safeParse({ ...academicsContent, faqs: [{ ...academicsContent.faqs[0], href: "/archive" }] }).success).toBe(false);
    expect(academicsContentSchema.safeParse({ ...academicsContent, kickoff: { ...academicsContent.kickoff, dateTime: "2026-02-30" } }).success).toBe(false);
    expect(academicsContentSchema.safeParse({ ...academicsContent, topics: [] }).success).toBe(false);
    expect(academicsContentSchema.safeParse({ ...academicsContent, hero: { ...academicsContent.hero, title: " " } }).success).toBe(false);
  });
});

describe("Academics public source", () => {
  it.each(["production", "test"] as const)("keeps static content and avoids Payload in %s", async (env) => {
    process.env = { ...process.env, NODE_ENV: env };
    expect(await readAcademics()).toBe(academicsContent);
    expect(mockGetPayload).not.toHaveBeenCalled();
    expect(mockEvaluate).not.toHaveBeenCalled();
  });

  it.each(["VERCEL", "VERCEL_ENV"])("keeps hosted source selection separate (%s)", async (key) => {
    process.env[key] = "development";
    expect(await readAcademics()).toBe(academicsContent);
    expect(mockGetPayload).not.toHaveBeenCalled();
  });

  it("does not initialize CMS when access is Off", async () => {
    mockEvaluate.mockResolvedValue(false);
    expect(await readAcademics()).toBe(academicsContent);
    expect(mockGetPayload).not.toHaveBeenCalled();
  });

  it("reads only published content anonymously and queries again after publishing", async () => {
    const edited = { ...academicsContent, hero: { ...academicsContent.hero, title: "Edited title" }, topics: [...academicsContent.topics].reverse() };
    mockFind.mockResolvedValueOnce({ docs: [academicsContent] }).mockResolvedValueOnce({ docs: [edited] });
    expect(await readAcademics()).toEqual(academicsContent);
    expect(await readAcademics()).toEqual(edited);
    expect(mockFind).toHaveBeenCalledTimes(2);
    expect(mockConnection).toHaveBeenCalledTimes(2);
    expect(mockEvaluate).toHaveBeenCalledWith("CMS-Access");
    expect(mockFind).toHaveBeenCalledWith({
      collection: "academics-pages", draft: false, overrideAccess: false, depth: 0, limit: 1, pagination: false,
      where: { and: [{ key: { equals: "f2f" } }, { _status: { equals: "published" } }] },
    });
    expect(mockFind.mock.calls[0][0]).not.toHaveProperty("user");
    expect(mockFind.mock.calls[0][0]).not.toHaveProperty("req");
  });

  it("does not silently replace missing or invalid CMS content with fixtures", async () => {
    mockFind.mockResolvedValueOnce({ docs: [] }).mockResolvedValueOnce({ docs: [{ hero: {} }] });
    await expect(readAcademics()).rejects.toThrow("CMS content missing");
    await expect(readAcademics()).rejects.toThrow("CMS content invalid-content");
  });

  it("hides database failures and rejects invalid keys before connecting", async () => {
    expect(await payloadAcademicsReader.read({ ...academicsDefinition, key: "../unsafe" })).toEqual({ status: "error", reason: "invalid-key" });
    expect(mockGetPayload).not.toHaveBeenCalled();
    mockFind.mockRejectedValueOnce(new Error("postgresql://private-credentials"));
    await expect(readAcademics()).rejects.toThrow("CMS content unavailable");
  });
});
