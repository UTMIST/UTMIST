// Server-side example: flags evaluate deterministically against the fixture
// adapter, with no provider. Proves the #286 default-off / unknown-user /
// failure-off contract (#372 DoD: examples can be built without the provider).
//
// Imports the flags module directly rather than the `@/shared/lib/server`
// barrel, which transitively pulls in `@supabase/ssr` and `googleapis` that
// Jest cannot parse (same reason as tests/unit/auth-guards.test.ts).

import { evaluateFlag } from '@/shared/lib/flags/server';
import type { EvaluationContext } from '@/shared/lib/flags/types';

const anonymous: EvaluationContext = { cohort: 'public' };
const member: EvaluationContext = { userId: 'u1', cohort: 'member' };

describe('evaluateFlag (fixture-backed)', () => {
  afterEach(() => {
    jest.dontMock('@/shared/lib/flags/fixtures');
    jest.resetModules();
  });

  it('returns the seeded value for a known, enabled flag', async () => {
    await expect(evaluateFlag('showDemoBanner', anonymous)).resolves.toBe(true);
  });

  it('defaults off for an unknown flag name', async () => {
    await expect(evaluateFlag('does-not-exist', member)).resolves.toBe(false);
  });

  it('returns the seeded value for a known, disabled flag', async () => {
    await expect(evaluateFlag('disabledExample', member)).resolves.toBe(false);
  });

  it('keeps a member-only flag off for an unknown / signed-out user', async () => {
    // betaFeature requires the `member` cohort.
    await expect(evaluateFlag('betaFeature', anonymous)).resolves.toBe(false);
  });

  it('treats a missing context as an unknown (public) user', async () => {
    await expect(evaluateFlag('betaFeature')).resolves.toBe(false);
  });

  it('enables a member-only flag for a member', async () => {
    await expect(evaluateFlag('betaFeature', member)).resolves.toBe(true);
  });

  it('returns false when the adapter throws (failure-off)', async () => {
    jest.resetModules();
    jest.doMock('@/shared/lib/flags/fixtures', () => ({
      fixtureFlagAdapter: {
        evaluate: () => {
          throw new Error('provider unavailable');
        },
      },
      fixtureBetaStore: { get: async () => null, set: async () => ({ ok: true, optedIn: false }) },
    }));

    const { evaluateFlag: evaluateWithBrokenAdapter } = await import(
      '@/shared/lib/flags/server'
    );
    await expect(
      evaluateWithBrokenAdapter('showDemoBanner', anonymous),
    ).resolves.toBe(false);
  });
});
