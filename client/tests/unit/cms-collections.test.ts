import type { AccessArgs, CollectionConfig } from "payload";

import { Careers } from "@/cms/collections/Careers";
import { Events } from "@/cms/collections/Events";
import { Media } from "@/cms/collections/Media";
import { Pages } from "@/cms/collections/Pages";
import { Partners } from "@/cms/collections/Partners";
import { People } from "@/cms/collections/People";
import { Posts } from "@/cms/collections/Posts";
import { Projects } from "@/cms/collections/Projects";
import { Startups } from "@/cms/collections/Startups";
import { SiteSettings } from "@/cms/globals/SiteSettings";

const publicCollections = [
  Pages,
  Events,
  Projects,
  Posts,
  Partners,
  People,
  Careers,
  Startups,
  Media,
];

describe("Payload public content collections", () => {
  it("registers the reviewed collection slugs with native drafts", () => {
    expect(publicCollections.map(({ slug }) => slug)).toEqual([
      "pages",
      "events",
      "projects",
      "posts",
      "partners",
      "people",
      "careers",
      "startups",
      "media",
    ]);

    for (const collection of publicCollections) {
      expect(collection.versions).toEqual({ drafts: true });
    }
  });

  it("allows anonymous reads only for published records", async () => {
    const anonymous = { req: { user: null } } as AccessArgs;
    const editor = {
      req: { user: { collection: "cms-users", id: "synthetic-editor" } },
    } as unknown as AccessArgs;

    for (const collection of publicCollections) {
      expect(await collection.access?.read?.(anonymous)).toEqual({
        _status: { equals: "published" },
      });
      expect(await collection.access?.read?.(editor)).toBe(true);
      expect(await collection.access?.readVersions?.(anonymous)).toBe(false);
      expect(await collection.access?.readVersions?.(editor)).toBe(true);
      for (const operation of ["create", "update", "delete"] as const) {
        expect(await collection.access?.[operation]?.(anonymous)).toBe(false);
        expect(await collection.access?.[operation]?.(editor)).toBe(true);
      }
    }

    expect(await SiteSettings.access?.read?.(anonymous)).toEqual({
      _status: { equals: "published" },
    });
    expect(await SiteSettings.access?.readVersions?.(anonymous)).toBe(false);
    expect(await SiteSettings.access?.readVersions?.(editor)).toBe(true);
    expect(await SiteSettings.access?.update?.(anonymous)).toBe(false);
    expect(await SiteSettings.access?.update?.(editor)).toBe(true);
  });

  it("keeps reusable roles and sponsorship context on relationships", () => {
    const field = (collection: CollectionConfig, name: string) =>
      collection.fields.find((candidate) =>
        "name" in candidate && candidate.name === name,
      );

    expect(field(People, "role")).toBeUndefined();
    expect(field(Partners, "tier")).toBeUndefined();
    expect(field(Events, "speakers")).toMatchObject({ type: "array" });
    expect(field(Events, "sponsors")).toMatchObject({ type: "array" });
    expect(field(Pages, "people")).toMatchObject({ type: "array" });
    expect(field(Pages, "partners")).toMatchObject({ type: "array" });
  });
});
