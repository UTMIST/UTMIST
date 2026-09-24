# Feature flags & beta preferences

The shared contract that feature teams evaluate flags and read/write member
beta-opt-in preferences against, plus the deterministic **fixtures** that stand
in for the real provider until it lands.

This is the F3.8 (#372) deliverable under epic
[F3](https://github.com/UTMIST/UTMIST/issues/271). The provider decision and the
integration contract are [#286](https://github.com/UTMIST/UTMIST/issues/286):
**Vercel Flags** (`@vercel/flags-core`) for flag storage, **Supabase**
for member identity and preferences.

Everything here works with **no provider** — the fixtures are in-memory and
deterministic — so server/client examples and the opt-in UI can be built now.

## Where it lives

```
client/src/shared/lib/flags/
  types.ts       # contracts + result types (client-safe; no provider/server imports)
  fixtures.ts    # deterministic in-memory flag adapter + beta-preference store
  server.ts      # server-side evaluation + failure-off wrapper (the swap seam)
```

Exported through the platform barrels (never deep-import these files):

| Import from | What |
| --- | --- |
| `@/shared/lib` | client-safe **types** (`Cohort`, `EvaluationContext`, `FlagEvaluator`, `FeatureFlags`, `FlagAdapter`, `BetaPreferenceStore`, `SetPreferenceResult`, `contextFromProfile`) |
| `@/shared/lib/server` | the **evaluator** (`evaluateFlag`, `getBetaPreference`, `setBetaPreference`) |

`flags/server.ts` is server-only. Browser components import only the types/results
from `@/shared/lib` and receive evaluated booleans as props — they never import the
evaluator or the provider.

## The contract

### Flags are boolean

`evaluateFlag(name, ctx?)` returns `Promise<boolean>`. There are no variant or
multivalue flags. Evaluation defaults **off** (per #286):

- an unknown flag name → `false`;
- a missing / failed configuration → `false`;
- an adapter that throws → `false` (the wrapper in `server.ts` catches it);
- a stale provider read (cached definitions served while the provider is
  disconnected) → `false` (enforced by the Vercel adapter);
- a missing context is treated as an unknown (`public`) user, so member-only
  flags stay off.

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

## How real adapters replace fixtures

The fixtures satisfy the same interfaces (`FlagAdapter`, `BetaPreferenceStore`)
as the real adapters, so going live is a change to **one seam** in
`flags/server.ts`. The flag adapter is **selected by environment**; the beta
store is still the fixture pending #289:

```ts
// Live on Vercel, or locally with credentials from `vercel env pull`.
const adapter = hasVercelContext()
  ? createVercelFlagAdapter()       // automatic Vercel OIDC / standard FLAGS
  : NODE_ENV === "production"
    ? offAdapter                    // unconfigured build: off, never fixtures
    : fixtureFlagAdapter;           // offline dev / CI
const betaStore: BetaPreferenceStore = fixtureBetaStore; // ← Supabase-backed store (#289)
```

Status of each seam:

1. **Flags — done (#447).** `flags/vercel.ts` exports
   `createVercelFlagAdapter()`, a `FlagAdapter` over Vercel Flags
   (`@vercel/flags-core`'s `FlagsClient`, server-only). Authentication uses
   **Vercel OIDC automatically**, with the standard `FLAGS` credential supported
   as an optional SDK override. Vercel supplies the identity and environment for
   Development, Preview, and Production; no `FLAGS_KEY_DEV` or
   `FLAGS_KEY_PREVIEW` secrets are required. `FLAGS_SECRET` is for Flags Explorer
   overrides, not provider authentication; this adapter does not read it or
   implement toolbar overrides.

   `server.ts` selects the live adapter when `VERCEL=1`, `VERCEL_ENV`, or local
   `VERCEL_OIDC_TOKEN` / `FLAGS` credentials are present. It lazily imports the
   SDK and caches the adapter, but **never initializes it outside a request**.
   Evaluation initializes the client inside the current request so it can read
   request-scoped OIDC even when no token exists in `process.env`. Offline dev
   and CI use fixtures; unconfigured production builds stay off. Authentication
   failures in a live environment stay off rather than falling back to fixtures.
   `Eigen-AI-Redesign` is evaluated with a `false` default.

   The adapter calls the client directly rather than through `flags/next` +
   `@flags-sdk/vercel` because those return only the value and drop the
   evaluation metrics. Once an instance has cached definitions, the client
   keeps serving them after the provider stream disconnects, tagged
   `cacheStatus: "STALE"`, instead of failing. The adapter treats a `STALE` (or
   errored) evaluation as `false`, so a warmed instance can't keep a flag on
   through an outage, and the flag comes back on once the stream reconnects.
   Separately, set `VERCEL_FLAGS_DISABLE_DEFINITION_EMBEDDING=1` so no
   build-time snapshot is bundled as a fallback; that setting does not affect
   the runtime cache.
2. **Beta preferences — pending (#289).**
   [#289](https://github.com/UTMIST/UTMIST/issues/289) implements
   `BetaPreferenceStore` over Supabase with row-level policies enforcing "a user
   can only edit their own preference" (the `denied` case) and repoints
   `betaStore`.

### EigenAI consumer (#447) & rollout

`/eigenai` is the first live consumer. The route shell re-exports a server
selector (`features/public-site/pages/eigenaiFlagged.tsx`, `dynamic =
"force-dynamic"`) that evaluates `Eigen-AI-Redesign` and renders the existing
page or the redesign — off/missing/error keeps the existing page.

**Local/preview opt-in is dashboard-driven, not code:** turn `Eigen-AI-Redesign`
**ON in the Development and Preview environments** and keep **Production OFF**.
For live local flags, run `vercel link` for the `utmist-infrastructure/client`
project, then `vercel env pull .env.local` from `client/`. This supplies the
Development OIDC token. Pull again when it expires. Keep `.env.local` untracked.
Without credentials, local development uses the fixtures (currently enabling the
redesign). Vercel deployments authenticate automatically at runtime; GitHub
Actions does not need a flag SDK secret or a copied OIDC token.

A dashboard change takes effect on subsequent requests as the SDK receives it,
without redeployment. **Production now follows its dashboard configuration**;
there is no hardcoded production override. Keep its value off until launch.
Missing, invalid, or stale provider results still keep the existing page.

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
> `flags/server.ts` and are meant to be replaced there. Feature code imports the
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
  — automatic adapter selection across Development, Preview, and Production,
  request-scoped OIDC without an env token, local credentials, offline fixtures,
  production provider values, and failure-off without fixture fallback.
- [`tests/unit/flags/vercel-adapter-sdk.test.ts`](../../client/tests/unit/flags/vercel-adapter-sdk.test.ts)
  — the Vercel adapter against the **real** `@vercel/flags-core`, offline: a
  local datafile, mocked OIDC token, and stub `fetch` are injected, so no real
  credentials or network are used. Verifies authentication starts at evaluation
  time and the runtime stream uses OIDC for each environment's datafile.
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
The real Vercel adapter is only reached through the lazy import in
`flags/server.ts`, so tests that touch `flags/server` never load the SDK; a test
that imports `flags/vercel` directly must either mock `@vercel/flags-core` or,
like `vercel-adapter-sdk.test.ts`, run under `@jest-environment node` and wrap
`createClient` to inject a datafile and a stub `fetch`.
