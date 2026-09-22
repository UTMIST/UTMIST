// Unit test for the real Vercel Flags adapter. The `flags/next` + `@flags-sdk/vercel`
// SDK is mocked so no key/network is involved: `flag()` returns a controllable
// stub callable, letting us assert the adapter's name→flag mapping and that the
// unknown-flag path yields `undefined` (which the evaluator turns into default-off).

import { flag } from 'flags/next';

import { createVercelFlagAdapter } from '@/shared/lib/flags/vercel';
import type { EvaluationContext } from '@/shared/lib/flags/types';

// The factory keeps its stub internal (no outer-scope reference, which would hit
// the temporal dead zone when Jest hoists these mocks above the imports).
jest.mock('flags/next', () => ({
  __esModule: true,
  flag: jest.fn(() => jest.fn()),
}));

jest.mock('@flags-sdk/vercel', () => ({
  __esModule: true,
  createVercelAdapter: jest.fn(() => ({})),
}));

// Building the adapter with an arbitrary key declares its flags via the mocked
// `flag()`; the declared flag stub is whatever that first call returned.
const vercelFlagAdapter = createVercelFlagAdapter('test-key');
const mockDeclaredFlag = (flag as jest.Mock).mock.results[0].value as jest.Mock;

const anonymous: EvaluationContext = { cohort: 'public' };

describe('vercelFlagAdapter', () => {
  beforeEach(() => {
    mockDeclaredFlag.mockReset();
  });

  it('returns undefined for an unknown flag name (→ default off upstream)', async () => {
    await expect(
      vercelFlagAdapter.evaluate('does-not-exist', anonymous),
    ).resolves.toBeUndefined();
    expect(mockDeclaredFlag).not.toHaveBeenCalled();
  });

  it('delegates a known flag to its declared Vercel flag — on', async () => {
    mockDeclaredFlag.mockResolvedValue(true);
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).resolves.toBe(true);
  });

  it('delegates a known flag to its declared Vercel flag — off', async () => {
    mockDeclaredFlag.mockResolvedValue(false);
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).resolves.toBe(false);
  });

  it('propagates a rejection for the evaluator wrapper to turn into default-off', async () => {
    mockDeclaredFlag.mockRejectedValue(new Error('provider unavailable'));
    await expect(
      vercelFlagAdapter.evaluate('Eigen-AI-Redesign', anonymous),
    ).rejects.toThrow('provider unavailable');
  });
});
