# Client Testing Guide

This guide explains how the UTMIST client test suite is organized and how to add new tests.

## Stack

- **Test runner:** Jest 30 (`jest`, `jest-environment-jsdom`)
- **Component testing:** React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`)
- **TypeScript:** `ts-jest` via the `next/jest` preset
- **Configuration:** [`client/jest.config.js`](../../client/jest.config.js) and [`client/jest.setup.js`](../../client/jest.setup.js)

## Running tests

```bash
cd UTMIST/client

npm test                  # run all tests once
npm run test:watch        # re-run on file changes
npm run test:coverage     # with v8 coverage report
npm run test:unit         # only tests/unit
npm run test:integration  # only tests/integration

# subset by path or test name:
npx jest tests/unit/pages              # all page-level behavior suites
npx jest tests/unit/pages/auth         # one file (path substring match)
npx jest -t "redirects to /auth"       # by test-name regex
```

## Directory layout

```
client/tests/
├── unit/
│   ├── pages/             # one *.test.tsx file per route in src/app
│   └── validation.test.ts # utility-level unit tests
├── integration/
│   └── auth.test.ts       # end-to-end-style flow tests
└── utils/
    └── test-utils.ts      # shared mocks, fixtures, helpers
```

Tests are discovered by the pattern `tests/**/*.(test|spec).(js|jsx|ts|tsx)` (see `jest.config.js`). New page tests must go in `tests/unit/pages/`.

## Globals already mocked for you

[`jest.setup.js`](../../client/jest.setup.js) auto-applies these to every test:

- `next/navigation` — `useRouter`, `useSearchParams`, `usePathname` return jest mocks. **Override per file** if you need to inspect calls (see "Auth flows" below).
- `next/image` — replaced with a plain `<img>` so tests do not need a real loader.
- `global.fetch` — set to `jest.fn()`; rebind it per test as needed.
- `process.env.NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — populated with test values.
- `console.error` — suppresses the noisy `ReactDOM.render is deprecated` warning only.

## Path alias

The `@/` alias is mapped to `client/src/` via `moduleNameMapper` in `jest.config.js`. Use it the same way as in app code:

```ts
import HomePage from '@/app/page';
import { login } from '@/shared/lib/client';
```

## Standard page-test template

Every page test in `tests/unit/pages/` follows this shape:

```tsx
import { render, fireEvent, waitFor } from '@testing-library/react';

const mockSave = jest.fn();

// Import the page under test after any mocks.
import MyPage from '@/app/my-route/page';

describe('My Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits the form data', async () => {
    const { container } = render(<MyPage onSave={mockSave} />);
    fireEvent.click(container.querySelector('button[type="submit"]')!);
    await waitFor(() => expect(mockSave).toHaveBeenCalled());
  });
});
```

Rules of thumb:

- **Test behavior, not presentation.** Do not assert exact page copy, headings,
  labels, CSS classes, colors, spacing, typography, gradients, layout,
  decorative elements, or snapshots whose purpose is visual/content parity.
- **Use stable control identity for behavior tests.** Prefer form field IDs,
  input names, destination URLs, ARIA state such as `aria-expanded`, and
  purpose-built test IDs on mocked boundaries. Accessible-name queries are
  appropriate when the accessible name itself is the contract; do not use
  them merely to locate a control by mutable marketing copy.
- **Mock heavy or leaf components** (carousels, people grids, third-party widgets) so a page test only fails when the page behavior itself breaks. Real, simple sub-components can be left unmocked.
- **One `describe` block per page**, named after the page.
- **`it('does X')` not `it('should do X')`** — match the existing suite's voice.
- **Mock external IO at the boundary**: `fetch`, Supabase clients, `next/navigation`, route-local `./api/*` modules.
- **Mocking a single shared UI component**: mock the underlying file
  directly (`@/shared/ui/heroSection`, `@/shared/ui/dropdown`, …) rather than
  a whole barrel. Jest intercepts by resolved module path, so mocking the file
  that backs one barrel re-export is enough — mocking the barrel itself would
  mean re-exporting every other component too. Page code still imports from
  the barrels (`import { HeroSection } from '@/shared/ui'`,
  `import { Dropdown } from '@/shared/ui/client'`); only the test's
  `jest.mock()` call uses the deep path.
- **Know which UI barrel the page imports**: `@/shared/ui` holds server-safe
  primitives (Button, Input, Textarea, Footer, HeroSection) and pulls in no
  Supabase or other browser-only code — pages that only use primitives need no
  Supabase-related mocks. `@/shared/ui/client` is the chrome barrel (Navbar,
  select/dropdown); importing anything from it loads
  navbar.tsx → `@/shared/lib/client` → supabase-js → the ESM-only `isows`
  package, which Jest cannot parse. Tests for pages that import from
  `@/shared/ui/client` must stub that boundary first:

  ```tsx
  jest.mock('@/shared/lib/client', () => ({
    useUser: () => ({ user: null, loading: false }),
  }));
  ```

## Cookbooks

### Mocking `next/navigation` to assert redirects

```tsx
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// ...
await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/auth'));
```

For `useParams` (dynamic routes like `applicants/[profile]`):

```tsx
const mockUseParams = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => mockUseParams(),
}));

mockUseParams.mockReturnValue({ profile: 'a1' });
```

### Mocking `fetch`

```tsx
(global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ items: [] }),
});

// later, assert request shape:
expect(global.fetch).toHaveBeenCalledWith(
  '/api/apply',
  expect.objectContaining({ method: 'POST' })
);
```

### Mocking Supabase

Client components get Supabase through the `@/shared/lib/client` barrel, not
a deep import — mock the barrel, providing only what the component under
test actually calls:

```tsx
const mockGetUser = jest.fn();
const mockUpdateUser = jest.fn();

jest.mock('@/shared/lib/client', () => ({
  supabase: {
    auth: {
      getUser: () => mockGetUser(),
      updateUser: (...args: unknown[]) => mockUpdateUser(...args),
    },
  },
}));
```

For server components that use `createClient()` from `@/shared/lib/server`,
see "Server components" below. Tests that exercise `shared/lib` itself
(rather than a feature that consumes it) are the one place a deep path is
correct instead of a barrel — see the "Server components" example, which
mocks `@/shared/lib/supabase/server` directly because the `@/shared/lib/server`
barrel also re-exports `googleapis`/`@supabase/ssr` code Jest can't parse.

### Auth flows (`@/shared/lib/client`)

```tsx
const mockLogin = jest.fn();
const mockGetCurrentUser = jest.fn();

jest.mock('@/shared/lib/client', () => ({
  login: (...args: unknown[]) => mockLogin(...args),
  getCurrentUser: () => mockGetCurrentUser(),
  AUTH_ERRORS: {
    EMAIL_ALREADY_TAKEN: 'EMAIL_ALREADY_TAKEN',
    EMAIL_NEEDS_CONFIRMATION: 'EMAIL_NEEDS_CONFIRMATION',
  },
}));
```

Set `mockGetCurrentUser.mockResolvedValue(null)` in `beforeEach` so unauthenticated is the default; opt into the authenticated case per test.

### JSON data fixtures

Pages frequently `import data from '@/assets/something.json'`. Mock the import to a small, predictable fixture:

```tsx
jest.mock('@/assets/careers.json', () => [
  { title: 'SWE', department: 'Eng', division: 'AI', applicationLink: 'https://x.com' },
]);
```

### Server (async) components

Server components like
[`src/features/recruitment/pages/admin.tsx`](../../client/src/features/recruitment/pages/admin.tsx)
(re-exported as the shell at `src/app/(frontend)/admin/page.tsx`) are `async function`s
that `await requireAdmin()` (or another guard from `@/shared/lib/server`,
which calls `redirect()` internally when the check fails). Test them by:

1. Mocking the Supabase call the guard makes, and `redirect`, so you can
   assert the redirect path without a real database.
2. Calling the page directly and rendering the resolved JSX.

```tsx
const mockRedirect = jest.fn((path: string) => {
  throw new Error(`__REDIRECT__:${path}`);
});

jest.mock('next/navigation', () => ({
  redirect: (path: string) => mockRedirect(path),
}));

const mockGetUser = jest.fn();
const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

jest.mock('@/shared/lib/supabase/server', () => ({
  createClient: jest.fn(async () => ({
    auth: { getUser: () => mockGetUser() },
    from: mockFrom,
  })),
}));

// The `@/shared/lib/server` barrel also re-exports `./supabase/middleware` and
// `./storage/google-drive`, which pull in `@supabase/ssr`'s realtime client and
// `googleapis`. Jest can't parse those transitively, so replace the barrel with
// the real guards implementation (using the mock above) instead of loading it —
// this deep path into `shared/lib` internals is the accepted exception, used
// only when testing code that consumes `shared/lib/server` this directly.
jest.mock('@/shared/lib/server', () => jest.requireActual('@/shared/lib/auth/guards'));

// Redirect path assertion:
await expect(AdminPage()).rejects.toThrow('__REDIRECT__:/auth');

// Render path:
const node = await AdminPage();
render(node);
```

### Modules that throw at import time (env-var checks)

`eigenai/page.tsx` throws if `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is unset. To exercise both branches:

```tsx
beforeAll(() => {
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-key';
});

// happy path
const { default: EigenAIPage } = await import('@/app/eigenai/page');

// error path
jest.resetModules();
delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const { default: EigenAIPage } = await import('@/app/eigenai/page');
expect(() => render(<EigenAIPage />)).toThrow(/Google Maps API key is not defined/);
```

### ESM-only third-party libraries

`react-chrono`, `keen-slider`, `framer-motion`, etc. ship as ESM and may fail to transform under Jest. Mock them to thin stubs:

```tsx
jest.mock('react-chrono', () => ({
  Chrono: ({ items }: { items: Array<{ title?: string }> }) => (
    <div data-testid="chrono">{items.length}</div>
  ),
}));
```

## Querying conventions

Choose queries that express the behavior under test without coupling it to
mutable copy or styling. Useful options include:

1. Semantic roles and state (`getByRole('alert')`, `aria-expanded`) when the
   role or state is the behavior being validated.
2. Stable form attributes (`#email`, `[name="password"]`,
   `button[type="submit"]`) for interactions whose labels may change.
3. Stable destinations (`a[href="/profile"]`) for navigation behavior.
4. `getByTestId` for mocked child boundaries and state that has no suitable
   semantic selector.

Avoid `getByText`, heading names, placeholders, class selectors, and style
matchers when they only encode current content or presentation. Fixture values
may still be asserted when they prove filtering, ordering, or data propagation;
prefer exposing fixture identity through a mock attribute instead of rendering
and matching its text.

For asynchronous UI (after `useEffect` fetches), prefer `findBy*` and `waitFor`:

```tsx
await waitFor(() => expect(mockFetch).toHaveBeenCalled());
```

## What page tests should cover

Add a page test only when the page has meaningful behavior to protect, such as:

- **Data handling** — fetched or fixture data is filtered, ordered, transformed,
  or passed to a boundary correctly.
- **User interactions** — click, type, submit, toggle. One assertion per interaction is enough.
- **Navigation and access control** — redirects, destination URLs, permissions,
  and authenticated/unauthenticated branches.
- **Accessibility contracts** — semantic roles, focus management, keyboard
  behavior, and ARIA state (without pinning mutable label copy).
- **Async and error behavior** — loading transitions, failures, retries, and
  empty data only when asserting behavior rather than the wording shown.

Static pages do not need a test merely to prove their current sections, copy,
or card counts render. Bias toward few high-signal tests per page over
exhaustive coverage. Each test should fail for exactly one behavioral reason.

## Reference: existing examples

When in doubt, copy the closest existing test:

| If your page… | Look at… |
| --- | --- |
| is a client component that fetches on mount | [`blog.test.tsx`](../../client/tests/unit/pages/blog.test.tsx), [`events.test.tsx`](../../client/tests/unit/pages/events.test.tsx) |
| has a form with validation | [`apply.test.tsx`](../../client/tests/unit/pages/apply.test.tsx), [`reset-password.test.tsx`](../../client/tests/unit/pages/reset-password.test.tsx), [`auth.test.tsx`](../../client/tests/unit/pages/auth.test.tsx) |
| is auth-gated and redirects | [`dashboard.test.tsx`](../../client/tests/unit/pages/dashboard.test.tsx), [`profile.test.tsx`](../../client/tests/unit/pages/profile.test.tsx) |
| is an async server component | [`admin.test.tsx`](../../client/tests/unit/pages/admin.test.tsx) |
| uses a dynamic route param | [`applicants-profile.test.tsx`](../../client/tests/unit/pages/applicants-profile.test.tsx) |
| reads an env var at import time | [`eigenai.test.tsx`](../../client/tests/unit/pages/eigenai.test.tsx) |
| has a tabbed/modal interaction | [`ai2.test.tsx`](../../client/tests/unit/pages/ai2.test.tsx), [`ml-fundamentals.test.tsx`](../../client/tests/unit/pages/ml-fundamentals.test.tsx) |

## CI

[`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) runs `npm test` on every pull request, alongside lint and typecheck, before the build. A failing test blocks the merge.

The suite needs no secrets in CI — it provisions its own environment. `jest.setup.js` sets the Supabase variables, and `tests/unit/pages/eigenai.test.tsx` sets and unsets `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` itself to cover both branches. Injecting those values through the workflow would break that test.

For coverage thresholds, configure them under the `coverageThreshold` key in `jest.config.js`.

## Troubleshooting

- **`Cannot find module '@/…'`** — `moduleNameMapper` is missing from `jest.config.js`. The `@/` alias must be mapped explicitly; `next/jest` does not auto-map it.
- **`Found multiple elements`** — use a stable form attribute, destination, ARIA state, or mocked-boundary test ID that identifies the behavior without pinning page copy.
- **`Unable to fire a "change" event - please provide a DOM element`** — your DOM lookup returned `null`. Prefer `container.querySelector('#id')` or a stable input `name` over text and `parentElement` chains.
- **`act()` warnings** — wrap state-updating interactions in `await waitFor(...)` or use `findBy*` queries instead of `getBy*`.
- **A third-party module fails to parse** — it is probably ESM-only. Mock it with `jest.mock('package-name', () => ({ … }))`.
