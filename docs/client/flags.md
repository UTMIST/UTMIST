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

## Using the EigenAI flag

**Do I need to set `FLAGS`? No, not for this Vercel project.** Leave it unset:
Vercel supplies OIDC automatically so the application can read dashboard values.
Keep the existing `FLAGS_SECRET` in Vercel's environment settings; it secures
Toolbar discovery and browser overrides. It does not set the flag's value.
Neither credential changes when you toggle the feature.

### Change what everyone sees on Preview

1. Open [Eigen-AI-Redesign in the Vercel dashboard](https://vercel.com/utmist-infrastructure/client/flag/Eigen-AI-Redesign).
2. Change the **Preview** value: **On** shows the redesign; **Off** shows the
   existing EigenAI page.
3. Open `/eigenai` on the latest Preview deployment linked in the PR's preview
   comment. Clear any Toolbar override and refresh the page.

Dashboard changes take effect on subsequent server evaluations after the SDK
receives the update. No redeploy is needed for a flag toggle. Everyone without
a browser override follows the Preview value.

### Test a different value in your browser

Open the Preview's **Vercel Toolbar → Flags Explorer** and override
`Eigen-AI-Redesign` to **On** or **Off**. The override applies only to that
browser; it does not change the dashboard value for other visitors.

For example, leave Preview **Off** and override **On** in your browser to review
the redesign while everyone else sees the existing page. **Clear the override**
when finished to follow the dashboard again.

### Use live flags locally

Follow the commands under [Set up this project](#set-up-this-project) to link
`client/`, pull Development credentials into `.env.local`, and start the dev
server. Then use the dashboard's **Development** value for local testing.
No manual `FLAGS` key is needed. Without Vercel context or provider credentials,
local development uses fixtures, which currently enable the redesign.

### Launch to Production

Production is currently forced **Off** by a code guard in `server.ts`.
Changing Production to On in the dashboard or setting a browser override cannot
enable the redesign. Launch requires a reviewed code change to remove that
guard before the Production dashboard value can control the page.

## Where it lives

```
client/src/shared/lib/flags/
  types.ts       # contracts + result types (client-safe; no provider/server imports)
  fixtures.ts    # deterministic in-memory flag adapter + beta-preference store
  server.ts      # public evaluator, production guard, authenticated discovery
  provider.ts    # OIDC / SDK-key selection + provider/fixture failure-off wrapper
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

### Authentication and overrides are separate

On Vercel, the provider uses the deployment's **automatic OIDC identity**. A
manual `FLAGS` key is not required. Locally, `vercel env pull` supplies the linked
project's Development OIDC credentials. `FLAGS_SECRET` protects Flags Explorer
discovery and browser overrides; it does not authenticate provider reads.

This follows the current [Vercel Flags quickstart](https://vercel.com/docs/flags/vercel-flags/quickstart)
and the official [Flags SDK skill](https://github.com/vercel/flags/tree/main/skills/flags-sdk).

| Variable | Purpose |
| --- | --- |
| Vercel OIDC | Default provider authentication. Supplied at request time on Vercel; `vercel env pull` supplies `VERCEL_OIDC_TOKEN` locally. Let Vercel manage this credential. |
| `FLAGS` | Optional manual SDK key (`vf_server_...`) or `flags:` connection string, for example outside Vercel or when reading another project's flags. An explicit key takes precedence over OIDC and selects its own flag environment. |
| `FLAGS_SECRET` | Independent 32-byte base64url encryption key for Explorer discovery and overrides. Never pass this to `createClient`. |
| `VERCEL_FLAGS_DISABLE_DEFINITION_EMBEDDING=1` | Prevent build-time definitions from being bundled as a fallback. |

Keep credentials server-only. `client/env.example` documents local configuration.
The retired `FLAGS_KEY_DEV` / `FLAGS_KEY_PREVIEW` variables are not read.

### Set up this project

The project is **`utmist-infrastructure/client`**. The `flags` package, server
declaration, discovery endpoint and `/eigenai` consumer are already installed.
Vercel provides the Toolbar on protected preview deployments; use its Flags
Explorer to inspect and override this flag.

For live local evaluation, run from `client/`:

```bash
vercel link --project client --scope utmist-infrastructure
vercel project inspect --scope utmist-infrastructure
vercel env pull .env.local --environment development --scope utmist-infrastructure
npm run dev
```

Verify the linked project before pulling. The gitignored `.env.local` contains
Development OIDC credentials and the Development `FLAGS_SECRET`. Do not copy
OIDC tokens into GitHub secrets or commit the file. Re-pull if local credentials
cannot be refreshed. Offline development can omit the pull and use fixtures.

On Preview, no manual provider credentials are needed. Preserve the existing
Preview `FLAGS_SECRET` in Vercel's environment settings. Flags Explorer setup
creates separate secrets per environment; do not rotate them during routine
setup. Redeploy after changing environment variables or authentication code.

The CI build does not need flag credentials: `/eigenai` and discovery evaluate
at request time. The deployed function receives its identity and environment
settings from Vercel. All CI builds disable definition embedding. A build-step
environment variable does not configure the deployed function's runtime.

### EigenAI flag definition and example

Read the existing flag instead of creating a duplicate:

```bash
vercel flags inspect Eigen-AI-Redesign --project client --scope utmist-infrastructure
```

The `flags/next` declaration in `definitions.ts` mirrors the dashboard:

| Field | Value |
| --- | --- |
| Key | `Eigen-AI-Redesign` |
| Kind | Boolean |
| Description | Toggle the new 2026 EigenAI Website |
| Variants | `false` (Off), `true` (On) |
| Default | `false` |

See [Using the EigenAI flag](#using-the-eigenai-flag) for dashboard toggles,
browser overrides, local testing, and the Production launch restriction.

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

`provider.ts` selects the live adapter when `FLAGS`, `VERCEL_OIDC_TOKEN`,
`VERCEL=1`, or `VERCEL_ENV` is present. An explicit nonempty `FLAGS` key is passed
to the client; otherwise the SDK resolves OIDC during evaluation. A Vercel
deployment must select the live adapter even when the token exists only in
request context, not in `process.env`.

Client construction is shared per server instance. Do not call `initialize()`
or cache an initialization promise at module scope: OIDC may be unavailable
until a request arrives. Authentication/provider failures return `false` and
never switch to fixtures. Transient evaluation failures can recover on later
requests; an invalid explicit key that prevents construction fails off for that
instance. With neither Vercel context nor credentials, local/test runs use
fixtures and standalone `NODE_ENV=production` builds stay off. `FLAGS_SECRET`
alone never selects the live provider.

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
footer. Offline local development uses fixtures, which currently enable the
redesign. Preview deployments use OIDC without a manual SDK key. Production
remains off.

For provider verification, use a Preview deployment or pull Development OIDC
credentials locally. Clear any Explorer override, and toggle `Eigen-AI-Redesign`
on → off → on in that environment's dashboard. The next server evaluation after the provider's
stream update should follow the value without redeploy. Then verify an Explorer
override in one browser and the dashboard value in another. Use synthetic data;
keep Production off until the launch task. Real project credentials and preview
access are needed to complete this deployment verification.

### Troubleshooting

| Symptom | Check |
| --- | --- |
| Preview shows the old page while its dashboard flag is On | Clear browser overrides, verify the deployment is linked to `utmist-infrastructure/client`, and check for authentication/provider errors. A missing `FLAGS` variable is normal with OIDC. |
| Local page ignores dashboard changes | Without pulled OIDC credentials or an explicit SDK key, local development uses fixtures. Pull Development credentials and restart the dev server. |
| An SDK key reads unexpected values | Explicit `FLAGS` overrides OIDC; its project and flag environment determine which configuration is read. |
| Toolbar cannot discover flags or apply overrides | Check that `FLAGS_SECRET` is configured for that deployment's environment and discovery is accessible. Do not replace it with an SDK key. |
| Production stays off | Intentional until launch: `server.ts` rejects both dashboard enablement and browser overrides in Production. |

The September 2026 regression in #452 came from replacing automatic OIDC with
a mandatory `FLAGS` check during a merge. Preview had valid Vercel identity and
an Explorer secret, but provider evaluation was skipped. Keep the OIDC regression
tests when changing provider selection; missing manual credentials must not
disable a Vercel deployment before the SDK attempts authentication.

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
  — which adapter `evaluateFlag` binds per environment (OIDC on Vercel or with
  pulled credentials, optional `FLAGS`, production always off, offline → fixtures),
  plus request-only OIDC, explicit-key precedence, ignored retired
  `FLAGS_KEY_DEV` / `FLAGS_KEY_PREVIEW` names, an adapter that
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
`jest.setup.js` clears Vercel context, OIDC, `FLAGS` and `FLAGS_SECRET` so local
credentials cannot change fixture tests. `tests/integration/flags-explorer.test.ts` exercises the
real Flags SDK cryptography, discovery and request-scoped overrides alongside
the real core client. It uses synthetic credentials, a local datafile and stub
transport, covering real OIDC-authenticated stream evaluation, credential
separation, invalid/expired proofs and cookies,
expiry across requests after an override was accepted (on, off and keyless),
production suppression, unknown/non-boolean overrides, and stale provider reads.
The core SDK contract tests also remain in place for outage fallback semantics.
