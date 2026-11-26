import { getPayload } from "payload";

import { assertLocalSeedTarget, assertTestingSeedTarget, seedHomePage } from "./seed-home.ts";

const args = process.argv.slice(2);
if (args.some(arg => arg !== "--testing")) throw new Error("Usage: payload:seed:home [--testing]");
const assertTarget = args.includes("--testing") ? assertTestingSeedTarget : assertLocalSeedTarget;
assertTarget(process.env.PAYLOAD_DATABASE_URI, process.env.VERCEL);

if (process.env.NODE_ENV !== "production") {
  throw new Error("Run with NODE_ENV=production so seeding uses reviewed migrations.");
}
const { default: config } = await import("../../../payload.config.ts");
const payload = await getPayload({ config });
try {
  payload.logger.info(`Homepage seed: ${await seedHomePage(payload)}`);
} finally {
  await payload.destroy();
}
// Payload's Postgres listener can outlive destroy() in a one-shot process.
process.exit(0);
