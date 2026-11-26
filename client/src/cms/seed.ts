import { getPayload, type SanitizedConfig } from "payload";

import {
  seedPublicContent,
  type SeedPayload,
} from "./seed-public-content.ts";

export async function script(config: SanitizedConfig) {
  const payload = await getPayload({ config });

  try {
    const result = await seedPublicContent(payload as unknown as SeedPayload);
    payload.logger.info(
      `Public content seed complete: ${result.created} created, ${result.skipped} already present.`,
    );
  } catch (error) {
    payload.logger.error({ err: error }, "Public content seed failed.");
    await payload.destroy();
    process.exit(1);
  }

  await payload.destroy();
}
