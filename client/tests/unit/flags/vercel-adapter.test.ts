// Unit test for the real Vercel Flags adapter. `@vercel/flags-core` is mocked so
// no key/network is involved: `createClient()` returns a stub whose `evaluate`
// we control, letting us assert the adapter's name→flag mapping, the
// unknown-flag path (`undefined`, which the evaluator turns into default-off),
// and the failure-off policy for errors and stale (disconnected) reads.

import { createClient } from '@vercel/flags-core';

import { createVercelFlagAdapter } from '@/shared/lib/flags/vercel';
import type { EvaluationContext } from '@/shared/lib/flags/types';

// The factory keeps its stub internal (no outer-scope reference, which would hit
// the temporal dead zone when Jest hoists this mock above the imports).
jest.mock('@vercel/flags-core', () => ({
  __esModule: true,
  createClient: jest.fn(() => ({ evaluate: jest.fn() })),
}));

// Building the adapter creates its client via the mocked
// `createClient()`; the client stub is whatever that first call returned.
const vercelFlagAdapter = createVercelFlagAdapter();
const mockEvaluate = (createClient as jest.Mock).mock.results[0].value
  .evaluate as jest.Mock;

const anonymous: EvaluationContext = { cohort: 'public' };

/** A successful evaluation result carrying the given provider cache status. */
function evaluation(value: boolean, cacheStatus: 'HIT' | 'MISS' | 'STALE') {
  return {
    value,
    reason: 'fallthrough',
    variantId: null,
    metrics: {
      cacheStatus,
      connectionState: cacheStatus === 'STALE' ? 'disconnected' : 'connected',
      mode: cacheStatus === 'STALE' ? 'offline' : 'streaming',
    },
  };
}

describe('vercelFlagAdapter', () => {
  beforeEach(() => {
    mockEvaluate.mockReset();
  });

  it('returns undefined for an unknown flag name (→ default off upstream)', async () => {
    await expect(
      vercelFlagAdapter.evaluate('does-not-exist', anonymous),
    ).resolves.toBeUndefined();
    expect(mockEvaluate).not.toHaveBeenCalled();
  });

  it('evaluates a known flag with a false default — on', async () => {
    mockEvaluate.mockResolvedValue(evaluation(true, 'HIT'));
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).resolves.toBe(true);
    expect(mockEvaluate).toHaveBeenCalledWith('Eigen-AI-Redesign', false);
  });

  it('evaluates a known flag — off', async () => {
    mockEvaluate.mockResolvedValue(evaluation(false, 'HIT'));
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).resolves.toBe(false);
  });

  it('treats a first, freshly fetched read (MISS) as fresh', async () => {
    mockEvaluate.mockResolvedValue(evaluation(true, 'MISS'));
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).resolves.toBe(true);
  });

  it('turns an evaluation error off (e.g. a missing definition)', async () => {
    mockEvaluate.mockResolvedValue({
      value: false,
      reason: 'error',
      errorCode: 'FLAG_NOT_FOUND',
      errorMessage: 'Definition not found',
      variantId: null,
    });
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).resolves.toBe(false);
  });

  it('stays off for an error result even if it carries a true value', async () => {
    mockEvaluate.mockResolvedValue({
      value: true,
      reason: 'error',
      errorMessage: 'evaluation failed',
      variantId: null,
    });
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).resolves.toBe(false);
  });

  it('only a boolean `true` enables the flag (truthy values stay off)', async () => {
    for (const value of ['true', 1, {}, null, undefined]) {
      mockEvaluate.mockResolvedValueOnce({ ...evaluation(true, 'HIT'), value });
      await expect(
        vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
      ).resolves.toBe(false);
    }
  });

  // `metrics` is optional in the SDK's result type; without it there is no
  // stale signal, so the value is taken as-is.
  it('uses the value when the result carries no metrics', async () => {
    mockEvaluate.mockResolvedValue({ value: true, reason: 'fallthrough', variantId: null });
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).resolves.toBe(true);
  });

  it('looks flag names up exactly (no case or whitespace folding)', async () => {
    for (const name of ['eigen-ai-redesign', ' Eigen-AI-Redesign', 'Eigen-AI-Redesign ']) {
      await expect(vercelFlagAdapter.evaluate(name, anonymous)).resolves.toBeUndefined();
    }
    expect(mockEvaluate).not.toHaveBeenCalled();
  });

  it('builds one SDK client per adapter with automatic OIDC authentication', () => {
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(createClient).toHaveBeenCalledWith(undefined);
  });

  it('propagates a rejection for the evaluator wrapper to turn into default-off', async () => {
    mockEvaluate.mockRejectedValue(new Error('provider unavailable'));
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).rejects.toThrow('provider unavailable');
  });

  // Regression (#447 review): once an enabled definition is cached, the SDK keeps
  // serving it after the provider disconnects — resolving `true` tagged STALE
  // rather than throwing. The adapter must go off, and come back on reconnect.
  it('goes off when a warmed enabled definition turns stale, and recovers on reconnect', async () => {
    mockEvaluate.mockResolvedValueOnce(evaluation(true, 'HIT'));
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).resolves.toBe(true);

    mockEvaluate.mockResolvedValueOnce(evaluation(true, 'STALE'));
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).resolves.toBe(false);

    mockEvaluate.mockResolvedValueOnce(evaluation(true, 'HIT'));
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).resolves.toBe(true);
  });

  it('supports the standard FLAGS credential without custom environment-specific names', () => {
    const originalFlags = process.env.FLAGS;
    try {
      process.env.FLAGS = 'standard-credential';
      createVercelFlagAdapter();
      expect(createClient).toHaveBeenLastCalledWith('standard-credential');
    } finally {
      if (originalFlags === undefined) delete process.env.FLAGS;
      else process.env.FLAGS = originalFlags;
    }
  });
});
