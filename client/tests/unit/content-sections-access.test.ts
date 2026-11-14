import type { AccessArgs } from "payload";

import { ContentSections } from "@/cms/collections/ContentSections";

describe("content sections permissions", () => {
  it.each([
    [null, false],
    [{ id: "member", collection: "members" }, false],
    [{ id: "forged-user", role: "admin" }, false],
    [{ id: "editor", collection: "cms-users" }, true],
  ])("allows only dedicated CMS editors to write (%j)", async (user, allowed) => {
    const args = { req: { user } } as AccessArgs;
    for (const operation of ["create", "update", "delete"] as const) {
      expect(await ContentSections.access?.[operation]?.(args)).toBe(allowed);
    }
    expect(await ContentSections.access?.read?.(args)).toEqual(
      allowed ? true : { status: { equals: "published" } },
    );
  });
});
