# Feature flags & beta preferences

The shared contract for server-side flags and member beta preferences. Vercel
Flags supplies live definitions; the Flags SDK adds authenticated Explorer
overrides. Deterministic fixtures support local development without credentials.

This is the F3.8 (#372) deliverable under epic
[F3](https://github.com/UTMIST/UTMIST/issues/271). The provider decision and the
integration contract are [#286](https://github.com/UTMIST/UTMIST/issues/286):
**Vercel Flags** (`flags/next` and `@vercel/flags-core`) for flags, **Supabase**
for member identity and preferences.

Everything here works with **no provider** — the fixtures are in-memory and
deterministic — so server/client examples and the opt-in UI can be built now.

## Where it lives

```
client/src/shared/lib/flags/
  types.ts       # contracts + result types (client-safe; no provider/server imports)
  fixtures.ts    # deterministic in-memory flag adapter + beta-preference store
  server.ts      # public evaluator, production guard, authenticated discovery
  provider.ts    # FLAGS credential selection + provider/fixture failure-off wrapper
  vercel.ts      # core client adapter retaining provider freshness metrics
  definitions.ts # internal flags/next declarations + discovery metadata
```

Exported through the platform barrels (never deep-import these files):

| Import from | What |
| --- | --- |
| `@/shared/lib` | client-safe **types** (`Cohort`, `EvaluationContext`, `FlagEvaluator`, `FeatureFlags`, `FlagAdapter`, `BetaPreferenceStore`, `SetPreferenceResult`, `contextFromProfile`) |
| `@/shared/lib/server` | the **evaluator** (`evaluateFlag`, `getBetaPreference`, `setBetaPreference`) and `getFlagsDiscovery` |

`flags/server.ts` is server-only. Browser components import only the types/results
from `@/shared/lib` and receive evaluated booleans as props — they never import the
evaluator or the provider.

## The contract

### Flags are boolean

`evaluateFlag(name, ctx?)` returns `Promise<boolean>`. There are no variant or
multivalue flags. Evaluation defaults **off** (per #286):

- an unknown flag name → `false`;
- a missing / failed configuration → `false`;
- an adapter that throws → `false` (the provider wrapper catches it);
- a stale provider read (cached definitions served while the provider is
  disconnected) → `false` (enforced by the Vercel adapter);
- a missing context is treated as an unknown (`public`) user, so member-only
  flags stay off.

Authenticated Explorer overrides are an explicit opt-in for the current browser
in development/preview, including when no provider key is configured. Provider
failures themselves never enable a flag. Production returns `false` before
calling the SDK, even with a valid override. Non-boolean overrides stay off.

### Cohorts and unknown users

`Cohort` is `public | member | exec | internal` (ascending privilege). An
`EvaluationContext` is built from the current user, or left anonymous:

```ts
import { contextFromProfile } from "@/shared/lib";

const ctx = contextFromProfile(profile); // profile: UserProfile | null
```

Unknown / signed-out users resolve to `public` and never qualify for member-only
targeting. Real cohort resolution (exec/internal) lands with
[#289](https://github.com/UTMIST/UTMIST/issues/289); until then a signed-in user
is `member` and an admin is `internal`.

### Beta preferences

Reads are a plain `boolean | null` (`true` opted in, `false` opted out, `null`
no stored preference / unknown user). The one intentionally non-boolean type is
the **write** result, because a bare boolean cannot distinguish "set to `false`"
from "the change was refused":

```ts
type SetPreferenceResult =
  | { ok: true; optedIn: boolean }
  | { ok: false; reason: "denied" | "unauthenticated" };
```

`denied` is how a user editing *someone else's* preference is rejected;
`unauthenticated` is a write with no actor. Client-facing UI states (loading,
request failure, signed-out) belong to the opt-in interface
([#290](https://github.com/UTMIST/UTMIST/issues/290)), derived from calling these
methods plus auth state — they are deliberately not part of this contract.

## Server → client usage

Evaluate on the server, pass plain booleans to client components as props. The
consumer selects between existing and new implementations inside its feature
module (no separate directory tree per flag); pages live under the `(frontend)`
route group.

```tsx
// app/(frontend)/<feature>/page.tsx  (server component)
import { evaluateFlag, requireUser } from "@/shared/lib/server";
import { contextFromProfile } from "@/shared/lib";

export default async function Page() {
  const profile = await requireUser();
  const showRedesign = await evaluateFlag("someFeature", contextFromProfile(profile));
  return <FeatureClient showRedesign={showRedesign} />; // client gets a boolean
}
```

## Provider and Explorer configuration

The two credentials have different purposes:

| Variable | Purpose |
| --- | --- |
| `FLAGS` | Vercel Flags SDK key (`vf_server_...`) or `flags:` connection string; selects the provider environment. |
| `FLAGS_SECRET` | Independent 32-byte base64url encryption key for Explorer discovery and overrides. Never pass this to `createClient`. |
| `VERCEL_FLAGS_DISABLE_DEFINITION_EMBEDDING=1` | Prevent build-time definitions from being bundled as a fallback. |

Set the Development SDK key in local `FLAGS`, and the Preview SDK key in the
Vercel project's Preview settings. Generate a separate `FLAGS_SECRET` for each
environment, using `node -e "console.log(crypto.randomBytes(32).toString('base64url'))"`.
Keep both values server-only. `client/env.example` documents the local setup.
Existing `FLAGS_KEY_DEV` / `FLAGS_KEY_PREVIEW` variables are no longer read.

Per AGENTS.md, provision the Preview values as GitHub Actions secrets `FLAGS`
and `FLAGS_SECRET`, and configure them in Vercel project settings as well.
The preview CI build passes these secrets and all CI builds disable definition
embedding. **Build-step environment variables do not configure runtime:** the
Vercel project's environment settings must also contain the correct values for
the deployed functions and Toolbar. Redeploy after changing credentials.

### Evaluation path

`evaluateFlag` in `server.ts` first checks `VERCEL_ENV === "production"` and
returns `false`. This guard must remain outside the SDK: Explorer overrides
bypass a flag's `decide` function.

When `FLAGS_SECRET` is present, declared flags run through `flags/next`.
`definitions.ts` declares `Eigen-AI-Redesign` with `defaultValue: false`; its
`decide` calls `evaluateProviderFlag` with the evaluation context. Before invoking
the declaration, `server.ts` validates the request's `vercel-flag-overrides`
cookie with the SDK's `decryptOverrides` helper on every evaluation. This is
necessary because `flags@4.3.1` caches its last decrypted cookie across requests
without rechecking expiry. Invalid or expired cookies bypass that cache: the
wrapper evaluates the provider and reports the resulting value with the SDK's
`reportValue`. This includes cookies that were accepted before they expired.

Valid development/preview overrides affect only that request/browser. The SDK
memoizes flag evaluation per request, never globally across visitors. Without
an Explorer secret, evaluation calls the provider wrapper directly and ignores
override cookies.

`provider.ts` selects the core adapter using `FLAGS`. With no key, local/test
runs use fixtures; `NODE_ENV=production` builds stay off. Provider initialization
is shared per server instance. An invalid provider key fails off for that
instance, and transient evaluation failures return `false`.

`vercel.ts` keeps the official `@vercel/flags-core` client because the value-only
`@flags-sdk/vercel` adapter does not expose the freshness metrics required here.
A successful boolean `true` enables the flag only when the read is not `STALE`.
The SDK can serve cached definitions after disconnecting, so a default value
and exception handler alone are insufficient. Definition embedding is disabled
separately; it does not disable the runtime cache.

The beta-preference store in `server.ts` remains a fixture pending
[#289](https://github.com/UTMIST/UTMIST/issues/289). That task replaces it with
Supabase-backed storage and row-level authorization without changing consumers.

### Flags Explorer discovery

`client/src/app/(frontend)/.well-known/vercel/flags/route.ts` re-exports
`getFlagsDiscovery` through `@/shared/lib/server` and is force-dynamic. It uses
`createFlagsDiscoveryEndpoint` and `getProviderData` from `flags/next`. A valid
access proof made with `FLAGS_SECRET` returns flag metadata with `no-store`;
missing/invalid proofs or missing/malformed secrets return `401`. Discovery does
not contact the flag provider, expose credentials, or require a site login.

In the Vercel Preview Toolbar, open Flags Explorer and override
`Eigen-AI-Redesign` for your browser. Clear the override to resume dashboard
values. A production override cannot enable the redesign. Do not import the
internal SDK declarations in feature code; that would bypass the public guard.

### EigenAI consumer (#447) & rollout

`/eigenai` re-exports the server selector in
`features/public-site/pages/eigenaiFlagged.tsx`. The route shell itself declares
`dynamic = "force-dynamic"`, so server selection is not frozen at build time.
Off/missing/error keeps the existing page with its standard navigation, footer,
and theme control; on selects the redesigned page with its own navigation and
footer. Local development without a provider key uses fixtures, which currently
enable the redesign. Keyless preview deployments and Production remain off.

For provider verification, set the appropriate Development/Preview `FLAGS`,
clear any Explorer override, and toggle `Eigen-AI-Redesign` on → off → on in
that environment's dashboard. The next server evaluation after the provider's
stream update should follow the value without redeploy. Then verify an Explorer
override in one browser and the dashboard value in another. Use synthetic data;
keep Production off until the launch task. Real project credentials and preview
access are needed to complete this deployment verification.

Because the exported function signatures don't change, consumers
([#287](https://github.com/UTMIST/UTMIST/issues/287),
[#443](https://github.com/UTMIST/UTMIST/issues/443) CMS,
[#447](https://github.com/UTMIST/UTMIST/issues/447) EigenAI,
[#290](https://github.com/UTMIST/UTMIST/issues/290) opt-in UI) don't change when
the real adapters land. All flag consumers reuse this **one** shared evaluator —
do not introduce a separate flag system per feature.

Retire a flag and its obsolete implementation after rollout, per
[#292](https://github.com/UTMIST/UTMIST/issues/292)'s ownership/retirement policy.

> **Fixtures must not become the production source.** They are wired only in
> `flags/provider.ts` (flags) and `flags/server.ts` (beta preferences). Feature code imports the
> evaluator from `@/shared/lib/server`, never `flags/fixtures` directly.

## Tests

- [`tests/unit/flags/flags-server.test.ts`](../../client/tests/unit/flags/flags-server.test.ts)
  — default-off, unknown-user, and failure-off flag evaluation.
- [`tests/unit/flags/beta-preferences.test.ts`](../../client/tests/unit/flags/beta-preferences.test.ts)
  — preference reads (`boolean | null`) and typed write results, including the
  `denied` and `unauthenticated` cases.
- [`tests/unit/flags/vercel-adapter.test.ts`](../../client/tests/unit/flags/vercel-adapter.test.ts)
  — the Vercel adapter's name→flag mapping (unknown → `undefined`) and
  failure-off for errors and stale reads, including a warmed enabled definition
  going off after a disconnect and back on after reconnect, with
  `@vercel/flags-core` mocked so no key/network is touched.
- [`tests/unit/flags/flags-env-selection.test.ts`](../../client/tests/unit/flags/flags-env-selection.test.ts)
  — which adapter `evaluateFlag` binds per environment (`FLAGS` on
  preview and development, production always off, keyless → fixtures), plus the
  edges: a keyless preview deploy stays off (no fixture fallback), the retired
  `FLAGS_KEY_DEV` / `FLAGS_KEY_PREVIEW` names are ignored, the adapter
  is built once and reads the key once, and a failed adapter build keeps every
  flag off for the instance lifetime.
- [`tests/unit/flags/vercel-adapter-sdk.test.ts`](../../client/tests/unit/flags/vercel-adapter-sdk.test.ts)
  — the Vercel adapter against the **real** `@vercel/flags-core`, offline: a
  local datafile and a stub `fetch` are injected, so no key or network is used.
  Checks the assumptions the mocked test makes (the real `FLAG_NOT_FOUND` shape,
  runtime reads without a live stream tagged `STALE`, environment `reuse`,
  non-boolean variants) so an SDK bump that breaks failure-off fails here.
- [`tests/unit/pages/eigenai-selector.test.tsx`](../../client/tests/unit/pages/eigenai-selector.test.tsx)
  — the `/eigenai` selector picks existing vs. redesign for off/on and stays on
  the existing page for default-off.

These double as the runnable "examples can be built without the provider" proof.
Import the flags modules directly (not the `@/shared/lib/server` barrel, which
transitively pulls in `@supabase/ssr` and `googleapis` that Jest cannot parse —
see [`tests/unit/auth-guards.test.ts`](../../client/tests/unit/auth-guards.test.ts)).
`jest.setup.js` clears `FLAGS` and `FLAGS_SECRET` so local credentials cannot
change fixture tests. `tests/integration/flags-explorer.test.ts` exercises the
real Flags SDK cryptography, discovery and request-scoped overrides alongside
the real core client. It uses synthetic credentials, a local datafile and stub
transport, covering credential separation, invalid/expired proofs and cookies,
expiry across requests after an override was accepted (on, off and keyless),
production suppression, unknown/non-boolean overrides, and stale provider reads.
The core SDK contract tests also remain in place for outage fallback semantics.
