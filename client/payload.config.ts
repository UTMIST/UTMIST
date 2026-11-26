import { postgresAdapter } from "@payloadcms/db-postgres";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";

import { PayloadUsers } from "./src/cms/collections/PayloadUsers.ts";
import { Proofs } from "./src/cms/collections/Proofs.ts";
import { ContentSections } from "./src/cms/collections/ContentSections.ts";
import { Careers } from "./src/cms/collections/Careers.ts";
import { Events } from "./src/cms/collections/Events.ts";
import { Media } from "./src/cms/collections/Media.ts";
import { Pages } from "./src/cms/collections/Pages.ts";
import { Partners } from "./src/cms/collections/Partners.ts";
import { People } from "./src/cms/collections/People.ts";
import { Posts } from "./src/cms/collections/Posts.ts";
import { Projects } from "./src/cms/collections/Projects.ts";
import { Startups } from "./src/cms/collections/Startups.ts";
import { PAYLOAD_ROUTES } from "./src/cms/config.ts";
import { payloadDatabaseOptions } from "./src/cms/database.ts";
import { SiteSettings } from "./src/cms/globals/SiteSettings.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(
        dirname,
        "src/app/(payload)/cms/importMap.js",
      ),
    },
    meta: {
      titleSuffix: "- UTMIST CMS",
    },
    user: PayloadUsers.slug,
  },
  collections: [
    Pages,
    Media,
    Partners,
    Events,
    Careers,
    Projects,
    Posts,
    People,
    Startups,
    PayloadUsers,
    ContentSections,
    Proofs,
  ],
  bin: [
    {
      key: "seed",
      scriptPath: path.resolve(dirname, "src/cms/seed.ts"),
    },
  ],
  db: postgresAdapter({
    ...payloadDatabaseOptions(process.env.PAYLOAD_DATABASE_URI ?? ""),
    migrationDir: path.resolve(dirname, "src/cms/migrations"),
  }),
  routes: PAYLOAD_ROUTES,
  secret: process.env.PAYLOAD_SECRET ?? "",
  globals: [SiteSettings],
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
});
