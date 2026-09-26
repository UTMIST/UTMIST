// Server-only provider evaluation. Explorer overrides are applied in server.ts.
//
// Internal to the shared flag runtime; the public evaluateFlag wrapper is
// exported through @/shared/lib/server. Never import this from browser code.
//
// Vercel deployments authenticate with request-scoped OIDC by default. An
// explicit FLAGS SDK key is also supported. Offline local dev / CI uses
// fixtures; production builds without Vercel context or credentials stay off.
// The failure-off wrapper and the exported function signatures stay the same,
// so no consuming code changes. See docs/client/flags.md.

import { fixtureFlagAdapter } from "./fixtures";
import type { EvaluationContext, FlagAdapter } from "./types";

// --- Adapter bindings (the swap seam) ---------------------------------------
/** Every flag off — the safe binding for production with no Vercel context. */
const offAdapter: FlagAdapter = { evaluate: async () => undefined };

// Vercel may supply OIDC through the request rather than process.env. Select
// the live adapter from deployment context too; let the SDK authenticate when
// evaluate() runs. FLAGS_SECRET only authenticates Explorer overrides.
// The public evaluator in server.ts enforces production-off before reaching us.
function hasVercelContext(): boolean {
  return process.env.VERCEL === "1" || Boolean(
    process.env.VERCEL_ENV || process.env.VERCEL_OIDC_TOKEN,
  );
}

// Resolve the flag adapter once. The Vercel adapter (and its
// `@vercel/flags-core` SDK) is lazily imported only with Vercel context or an
// SDK key. Cache client construction, never eagerly initialize the client:
// request-scoped authentication is not available during module loading.
let adapterPromise: Promise<FlagAdapter> | undefined;
function getFlagAdapter(): Promise<FlagAdapter> {
  if (!adapterPromise) {
    const sdkKey = process.env.FLAGS || undefined;
    adapterPromise = sdkKey || hasVercelContext()
      ? import("./vercel").then((m) => m.createVercelFlagAdapter(sdkKey))
      : Promise.resolve(
          process.env.NODE_ENV === "production" ? offAdapter : fixtureFlagAdapter,
        );
  }
  return adapterPromise;
}

// ----------------------------------------------------------------------------

/** Context for an unknown / signed-out visitor: `public` cohort. */
const ANONYMOUS: EvaluationContext = { cohort: "public" };

/**
 * Evaluate one boolean flag for the given context, defaulting **off**.
 *
 * Per the #286 contract, this returns `false` for a missing flag, missing
 * configuration, or any evaluation failure, and treats a missing context as an
 * unknown (`public`) user so member-only flags stay off. Centralising this
 * here means every adapter — fixture or real — inherits the guarantee. A stale
 * provider read (cached definitions served after a disconnect) resolves rather
 * than throws, so the Vercel adapter turns that into `false` itself.
 */
export async function evaluateProviderFlag(
  name: string,
  ctx: EvaluationContext = ANONYMOUS,
): Promise<boolean> {
  try {
    const adapter = await getFlagAdapter();
    return (await adapter.evaluate(name, ctx)) ?? false;
  } catch {
    return false;
  }
}
