// Server-only provider evaluation. Explorer overrides are applied in server.ts.
//
// Internal to the shared flag runtime; the public evaluateFlag wrapper is
// exported through @/shared/lib/server. Never import this from browser code.
//
// The flag adapter is selected by environment (#447): the real Vercel Flags
// adapter whenever a per-environment SDK key is configured, the deterministic
// fixtures in local dev / CI without one, and a hard "off" adapter in production
// without a key (so the fixtures can never leak into production).
// The failure-off wrapper and the exported function signatures stay the same,
// so no consuming code changes. See docs/client/flags.md.

import { fixtureFlagAdapter } from "./fixtures";
import type { EvaluationContext, FlagAdapter } from "./types";

// --- Adapter bindings (the swap seam) ---------------------------------------
/** Every flag off — the safe binding for production with no Vercel context. */
const offAdapter: FlagAdapter = { evaluate: async () => undefined };

// Select the Vercel Flags SDK key for the current environment. Auth is an
// explicit SDK key in `FLAGS`, not OIDC; each Vercel environment holds its
// own value (the Development key locally, the Preview key on preview). Production
// is deliberately keyless — and ignored here even if a value is set — so the
// redesign stays off there. Kept SDK-free (only `process.env`) so this module
// never imports `./vercel` eagerly — see the lazy import below.
function selectSdkKey(): string | undefined {
  if (process.env.VERCEL_ENV === "production") return undefined;
  return process.env.FLAGS;
}

// Resolve the flag adapter once. The Vercel adapter (and its
// `@vercel/flags-core` SDK) is **lazily imported** only when an SDK key is
// present, so dev/CI without one never loads the SDK — that keeps Jest off the
// SDK's ESM-only dependencies with no test-config changes.
let adapterPromise: Promise<FlagAdapter> | undefined;
function getFlagAdapter(): Promise<FlagAdapter> {
  if (!adapterPromise) {
    const sdkKey = selectSdkKey();
    adapterPromise = sdkKey
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
