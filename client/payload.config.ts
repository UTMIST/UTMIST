import { postgresAdapter } from "@payloadcms/db-postgres";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";

import { PayloadUsers } from "./src/cms/collections/PayloadUsers.ts";
import { Proofs } from "./src/cms/collections/Proofs.ts";
import { ContentSections } from "./src/cms/collections/ContentSections.ts";
import { Pages } from "./src/cms/collections/Pages.ts";
import { PAYLOAD_ROUTES } from "./src/cms/config.ts";
import { payloadDatabaseOptions } from "./src/cms/database.ts";

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
  collections: [PayloadUsers, Proofs, ContentSections, Pages],
  db: postgresAdapter({
    ...payloadDatabaseOptions(process.env.PAYLOAD_DATABASE_URI ?? ""),
    migrationDir: path.resolve(dirname, "src/cms/migrations"),
  }),
  routes: PAYLOAD_ROUTES,
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
});
