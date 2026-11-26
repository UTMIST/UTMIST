import type { AccessArgs, Payload } from "payload";

import { Pages } from "@/cms/collections/Pages";
import { validateRecordDestination, validateRecordWebsite } from "@/cms/fields";
import { homeSections } from "@/cms/home-sections";
import { validateContentLink } from "@/cms/page-fields";
import { assertLocalSeedTarget, assertTestingSeedTarget, seedHomePage } from "@/cms/seeds/seed-home";

jest.mock("payload", () => ({
  ValidationError: class extends Error {
    constructor({ errors }: { errors: Array<{ message: string }> }) {
      super(errors[0].message);
    }
  },
}));

describe("homepage identity", () => {
  const validate = Pages.hooks?.beforeValidate?.[0];
  if (!validate) throw new Error("Missing page identity validation");
  const home = { slug: "home", template: "home" };

  it.each([
    [{ slug: "home-edited" }, home],
    [{ template: "departments" }, home],
    [{ slug: "home-edited", template: "departments" }, home],
    [{ slug: "home", template: "departments" }, undefined],
  ])("rejects mismatched Home identifiers in %j", async (data, originalDoc) => {
    const args = { data, originalDoc } as unknown as Parameters<typeof validate>[0];
    await expect(validate(args)).rejects.toThrow('The homepage must keep "home" as its slug and template.');
  });

  it("allows partial content updates to Home", async () => {
    const data = { title: "Home title" };
    const args = { data, originalDoc: home } as unknown as Parameters<typeof validate>[0];
    await expect(validate(args)).resolves.toBe(data);
  });
});

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

it.each(["introduction", "faq", "featuredEvents", "partners", "metadata"])(
  "shows the generic %s field on other templates and uses the Home sections on Home",
  (name) => {
    const field = Pages.fields.find(field => "name" in field && field.name === name);
    const condition = field?.admin?.condition;
    const context = { user: null, operation: "update" as const, path: [name], blockData: {} };
    expect(condition?.({}, { template: "home" }, context)).toBe(false);
    expect(condition?.({}, { template: "events" }, context)).toBe(true);
  },
);

it("shows an alt text field for image artwork within a Home event placement", () => {
  const events = homeSections.find(block => block.slug === "events");
  const placements = events?.fields.find(field => field.type === "array" && field.name === "items");
  if (placements?.type !== "array") throw new Error("Missing Home event placements");
  const alt = placements.fields.find(field => "name" in field && field.name === "imageAlt");
  const context = { user: null, operation: "update" as const, path: ["imageAlt"], blockData: {} };
  expect(alt?.admin?.condition?.({}, { artwork: "ai2" }, context)).toBe(true);
  expect(alt?.admin?.condition?.({}, { artwork: "eigenai" }, context)).toBe(false);
});

describe("content links", () => {
  it.each(["/careers", "/events#upcoming", "https://example.com/event?a=1", "mailto:editor@example.com"])("accepts %s", (href) => {
    expect(validateContentLink(href)).toBe(true);
  });
  it.each(["", "javascript:alert(1)", "data:text/html,test", "//example.com", "/\\example.com", "https://user:pass@example.com", "https://example.com\n", "not a url"])("rejects %s", (href) => {
    expect(validateContentLink(href)).not.toBe(true);
  });
});

describe("shared record links", () => {
  it.each(["http://example.com/with space", "https://example.com/event"])("accepts %s for websites and destinations", (href) => {
    expect(validateRecordWebsite(href)).toBe(true);
    expect(validateRecordDestination(href)).toBe(true);
  });

  it("accepts root-relative paths for event destinations", () => {
    expect(validateRecordDestination("/events/my event#info")).toBe(true);
    expect(validateRecordWebsite("/events/my event#info")).not.toBe(true);
  });

  it.each(["//example.com", "/\\example.com", "/path/..//example.com", "https://user:pass@example.com", "javascript:alert(1)"])(
    "rejects ambiguous or unsafe links such as %s",
    (href) => {
      expect(validateRecordDestination(href)).not.toBe(true);
      expect(validateRecordWebsite(href)).not.toBe(true);
    },
  );
});

describe("homepage seed", () => {
  it("creates missing content as a draft", async () => {
    const find = jest.fn().mockImplementation(async ({ collection }) => ({ docs: collection === "events" ? [{ id: 1 }] : [] }));
    const create = jest.fn().mockResolvedValue({});
    await expect(seedHomePage({ find, create } as unknown as Payload)).resolves.toBe("created");
    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      collection: "pages", data: expect.objectContaining({ slug: "home", template: "home" }),
    }));
  });

  it("preserves existing content, including unpublished editorial changes", async () => {
    const find = jest.fn().mockResolvedValue({ docs: [{ id: 1, status: "draft", title: "Edited home", sections: [{ blockType: "hero" }] }] });
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
    }] }).mockResolvedValue({ docs: [{ id: 1 }] });
    const create = jest.fn();
    await seedHomePage({ find, create } as unknown as Payload);
    expect(create.mock.calls[0][0].data.sections).toContainEqual(expect.objectContaining({
      blockType: "impact", heading: "Existing CMS heading", description: "Existing CMS description",
      statistics: [{ number: "12+", description: "Existing statistic" }],
    }));
  });

  it("adds sections as a draft to a pre-existing Home while preserving its other fields", async () => {
    const find = jest.fn().mockResolvedValueOnce({ docs: [{ id: 9, sections: [], title: "Edited" }] })
      .mockResolvedValueOnce({ docs: [] }).mockResolvedValue({ docs: [{ id: 1 }] });
    const create = jest.fn();
    const update = jest.fn();
    await expect(seedHomePage({ find, create, update } as unknown as Payload)).resolves.toBe("added-to-existing");
    expect(update).toHaveBeenCalledWith({
      collection: "pages", id: 9, draft: true, overrideAccess: true,
      data: { sections: expect.any(Array) },
    });
    expect(create).not.toHaveBeenCalled();
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
