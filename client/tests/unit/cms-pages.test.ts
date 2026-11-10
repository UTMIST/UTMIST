import type { AccessArgs, Payload } from "payload";

import { Pages } from "@/cms/collections/Pages";
import { validateContentLink } from "@/cms/page-fields";
import { assertLocalSeedTarget, assertTestingSeedTarget, seedHomePage } from "@/cms/seeds/seed-home";

describe("page content permissions", () => {
  it.each([null, { id: 1, collection: "members" }])("restricts non-editors to published pages: %j", async (user) => {
    const args = { req: { user } } as AccessArgs;
    for (const operation of ["create", "update", "delete"] as const) {
      expect(await Pages.access?.[operation]?.(args)).toBe(false);
    }
    expect(await Pages.access?.read?.(args)).toEqual({ _status: { equals: "published" } });
  });

  it("allows CMS editors to manage pages and read drafts", async () => {
    const args = { req: { user: { id: 1, collection: "cms-users" } } } as AccessArgs;
    for (const operation of ["create", "read", "update", "delete"] as const) {
      expect(await Pages.access?.[operation]?.(args)).toBe(true);
    }
  });
});

describe("content links", () => {
  it.each(["/careers", "/events#upcoming", "https://example.com/event?a=1", "mailto:editor@example.com"])("accepts %s", (href) => {
    expect(validateContentLink(href)).toBe(true);
  });
  it.each(["", "javascript:alert(1)", "data:text/html,test", "//example.com", "/\\example.com", "https://user:pass@example.com", "https://example.com\n", "not a url"])("rejects %s", (href) => {
    expect(validateContentLink(href)).not.toBe(true);
  });
});

describe("homepage seed", () => {
  it("creates missing content as a draft", async () => {
    const find = jest.fn().mockResolvedValue({ docs: [] });
    const create = jest.fn().mockResolvedValue({});
    await expect(seedHomePage({ find, create } as unknown as Payload)).resolves.toBe("created");
    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      collection: "pages", data: expect.objectContaining({ slug: "home", _status: "draft" }),
    }));
  });

  it("preserves existing content, including unpublished editorial changes", async () => {
    const find = jest.fn().mockResolvedValue({ docs: [{ id: 1, status: "draft", title: "Edited home" }] });
    const create = jest.fn();
    await expect(seedHomePage({ find, create } as unknown as Payload)).resolves.toBe("already-exists");
    expect(find).toHaveBeenCalledWith(expect.objectContaining({
      where: { slug: { equals: "home" } }, overrideAccess: true,
    }));
    expect(create).not.toHaveBeenCalled();
  });

  it("carries forward published impact edits when creating the page", async () => {
    const find = jest.fn().mockResolvedValueOnce({ docs: [] }).mockResolvedValueOnce({ docs: [{
      heading: "Existing CMS heading", description: "Existing CMS description",
      statistics: [{ number: "12+", description: "Existing statistic" }],
    }] });
    const create = jest.fn();
    await seedHomePage({ find, create } as unknown as Payload);
    expect(create.mock.calls[0][0].data.sections).toContainEqual(expect.objectContaining({
      blockType: "impact", heading: "Existing CMS heading", description: "Existing CMS description",
      statistics: [{ number: "12+", description: "Existing statistic" }],
    }));
  });

  it("propagates database failures instead of reporting a successful seed", async () => {
    const create = jest.fn();
    await expect(seedHomePage({ find: jest.fn().mockRejectedValue(new Error("unavailable")), create } as unknown as Payload)).rejects.toThrow("unavailable");
    expect(create).not.toHaveBeenCalled();
  });

  it.each(["postgresql://payload@127.0.0.1:5432/payload", "postgres://payload@localhost/payload", "postgresql://payload@[::1]/payload"])("accepts local target %s", (uri) => {
    expect(() => assertLocalSeedTarget(uri, undefined)).not.toThrow();
  });
  it.each([
    undefined, "invalid", "postgresql://payload@project.supabase.co/postgres",
    "postgresql://payload@127.0.0.1/payload?host=remote.example.com", "https://localhost/payload",
  ])("refuses unsafe or absent target %s", (uri) => {
    expect(() => assertLocalSeedTarget(uri, undefined)).toThrow();
  });
  it("refuses hosted invocations even with a loopback target", () => {
    expect(() => assertLocalSeedTarget("postgresql://payload@localhost/payload", "1")).toThrow();
  });

  it("allows an explicit testing import only with the scoped testing CMS login", () => {
    const uri = "postgresql://utmist_payload.lrbvknlviodxhhuautfi:synthetic@aws-0-us-east-2.pooler.supabase.com:5432/postgres";
    expect(() => assertTestingSeedTarget(uri, undefined)).not.toThrow();
    for (const rejected of [
      uri.replace("lrbvknlviodxhhuautfi", "gqqgsvhzonratwkmjiji"),
      uri.replace("utmist_payload.", "postgres."),
      uri + "?host=elsewhere.example.com", uri.replace(":5432", ":6543"),
    ]) expect(() => assertTestingSeedTarget(rejected, undefined)).toThrow();
    expect(() => assertTestingSeedTarget(uri, "1")).toThrow();
  });
});
