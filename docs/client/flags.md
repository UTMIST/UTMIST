# Feature flags & beta preferences

The shared contract that feature teams evaluate flags and read/write member
beta-opt-in preferences against, plus the deterministic **fixtures** that stand
in for the real provider until it lands.

This is the F3.8 (#372) deliverable under epic
[F3](https://github.com/UTMIST/UTMIST/issues/271). The provider decision and the
integration contract are [#286](https://github.com/UTMIST/UTMIST/issues/286):
**Vercel Flags** (`flags` + `@flags-sdk/vercel`) for flag storage, **Supabase**
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
as the real adapters, so going live is a change to **one seam** — the two
bindings at the top of `flags/server.ts`:

```ts
const adapter: FlagAdapter = fixtureFlagAdapter;      // ← Vercel Flags adapter (#287/#447)
const betaStore: BetaPreferenceStore = fixtureBetaStore; // ← Supabase-backed store (#289)
```

To replace a fixture:

1. **Flags** — [#287](https://github.com/UTMIST/UTMIST/issues/287) /
   [#447](https://github.com/UTMIST/UTMIST/issues/447) implement `FlagAdapter`
   over Vercel Flags (`flags` + `@flags-sdk/vercel`, server-only, OIDC auth) and
   repoint `adapter`. The failure-off wrapper stays, so the SDK's cached/embedded
   fallback cannot silently defeat default-off.
2. **Beta preferences** —
   [#289](https://github.com/UTMIST/UTMIST/issues/289) implements
   `BetaPreferenceStore` over Supabase with row-level policies enforcing "a user
   can only edit their own preference" (the `denied` case) and repoints
   `betaStore`.

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

These double as the runnable "examples can be built without the provider" proof.
Import the flags modules directly (not the `@/shared/lib/server` barrel, which
transitively pulls in `@supabase/ssr` and `googleapis` that Jest cannot parse —
see [`tests/unit/auth-guards.test.ts`](../../client/tests/unit/auth-guards.test.ts)).
