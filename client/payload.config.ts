import { postgresAdapter } from "@payloadcms/db-postgres";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";

import { PayloadUsers } from "./src/cms/collections/PayloadUsers.ts";
import { Proofs } from "./src/cms/collections/Proofs.ts";
import {
  PAYLOAD_DATABASE_SCHEMA,
  PAYLOAD_ROUTES,
} from "./src/cms/config.ts";

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
  collections: [PayloadUsers, Proofs],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.PAYLOAD_DATABASE_URI ?? "",
    },
    schemaName: PAYLOAD_DATABASE_SCHEMA,
  }),
  routes: PAYLOAD_ROUTES,
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
});
