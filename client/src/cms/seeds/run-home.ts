import { getPayload } from "payload";

import { assertLocalSeedTarget, seedHomePage } from "./seed-home.ts";

assertLocalSeedTarget(process.env.PAYLOAD_DATABASE_URI, process.env.VERCEL);

// Use reviewed migrations even when the invoking shell is in development mode.
Object.assign(process.env, { NODE_ENV: "production" });
const { default: config } = await import("../../../payload.config.ts");
const payload = await getPayload({ config });
try {
  payload.logger.info(`Homepage seed: ${await seedHomePage(payload)}`);
} finally {
  await payload.destroy();
}
// Payload's Postgres listener can outlive destroy() in a one-shot process.
process.exit(0);
