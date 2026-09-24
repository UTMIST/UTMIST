/** @jest-environment node */
// Contract test: the Vercel adapter against the **real** `@vercel/flags-core`
// SDK (#447), not a hand-written stub. `vercel-adapter.test.ts` mocks the client
// and asserts the adapter's handling of result shapes we *assume* the SDK
// returns; this file checks those assumptions — the `reason: "error"` shape for
// a missing definition, when the SDK tags a read `STALE`, how paused and reused
// environments resolve — so an SDK change that breaks the failure-off policy
// fails here.
//
// No SDK key or network is involved: `createClient` is wrapped to inject a local
// datafile, a stub `fetch` (the SDK's only network path) and the mode under
// test, while evaluation itself runs the real SDK code. The version is pinned in
// package.json, so a bump that changes these behaviours surfaces in this file.

import type { FlagsClient } from '@vercel/flags-core';
import { getVercelOidcToken } from '@vercel/oidc';

import { createVercelFlagAdapter } from '@/shared/lib/flags/vercel';
import type { EvaluationContext } from '@/shared/lib/flags/types';

type ClientOptions = Record<string, unknown>;

// Options the wrapped `createClient` merges in for the next adapter built, and
// every client created, so each test can shut its client down. `mock`-prefixed
// so the hoisted `jest.mock` factory may reference them.
let mockClientOptions: ClientOptions = {};
const mockClients: FlagsClient[] = [];

jest.mock('@vercel/oidc', () => ({ getVercelOidcToken: jest.fn() }));
const mockOidcToken = jest.mocked(getVercelOidcToken);

jest.mock('@vercel/flags-core', () => {
  const actual = jest.requireActual('@vercel/flags-core');
  return {
    ...actual,
    createClient: (sdkKey?: string) => {
      const client = actual.createClient(sdkKey, mockClientOptions);
      mockClients.push(client);
      return client;
    },
  };
});

const EIGEN = 'Eigen-AI-Redesign';
const anonymous: EvaluationContext = { cohort: 'public' };

/**
 * The SDK's only network path. Ingest (usage events) succeeds quietly; any
 * definitions request (stream or datafile fetch) fails, simulating an outage.
 */
const offlineFetch = jest.fn(async (input: RequestInfo | URL) => {
  if (String(input).endsWith('/v1/ingest')) return new Response('{}');
  throw new Error('network disabled in tests');
});

/** A packed datafile holding one flag definition, evaluated as `environment`. */
function datafile(
  definition: Record<string, unknown> | undefined,
  environment = 'development',
) {
  return {
    projectId: 'prj_test',
    environment,
    configUpdatedAt: 1,
    revision: 1,
    definitions: definition ? { [EIGEN]: definition } : {},
  };
}

/** Build the adapter with the real SDK in the given mode. */
function adapterWith(options: ClientOptions) {
  mockClientOptions = { fetch: offlineFetch, waitUntil: () => {}, ...options };
  return createVercelFlagAdapter();
}

/** The build step reads the provided datafile as fresh (`HIT`/`MISS`). */
function buildStepAdapter(definition: Record<string, unknown> | undefined, env?: string) {
  return adapterWith({ buildStep: true, datafile: datafile(definition, env) });
}

// The SDK logs its (expected) stream timeouts and fallbacks; keep output clean.
beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  mockOidcToken.mockReset().mockRejectedValue(new Error('No request token'));
});

afterEach(async () => {
  await Promise.all(mockClients.splice(0).map((c) => c.shutdown()));
  offlineFetch.mockClear();
  jest.restoreAllMocks();
});

describe('Vercel adapter × real @vercel/flags-core', () => {
  it.each(['development', 'preview', 'production'])(
    'authenticates inside the request with OIDC and evaluates the %s datafile',
    async (environment) => {
      const fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        if (String(input).endsWith('/v1/ingest')) return new Response('{}');
        // Keep the provider stream open until shutdown, so reads are fresh.
        const body = new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(JSON.stringify({
              type: 'datafile',
              data: datafile({
                variants: [false, true],
                environments: { development: 1, preview: 1, production: 0 },
              }, environment),
            }) + '\n'));
            init?.signal?.addEventListener('abort', () => controller.close(), { once: true });
          },
        });
        return new Response(body);
      });
      const adapter = adapterWith({
        buildStep: false,
        stream: { initTimeoutMs: 1000 },
        polling: false,
        fetch,
      });

      // The client can be constructed before a request has an OIDC token.
      expect(mockOidcToken).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
      mockOidcToken.mockResolvedValue(`test-${environment}-oidc`);

      await expect(adapter.evaluate(EIGEN, anonymous)).resolves.toBe(environment !== 'production');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/stream'),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: `Bearer test-${environment}-oidc` }),
        }),
      );
    },
  );

  describe('fresh reads', () => {
    it('is on when the environment serves the `true` variant', async () => {
      const adapter = buildStepAdapter({
        variants: [false, true],
        environments: { development: 1, preview: 0, production: 0 },
      });
      await expect(adapter.evaluate(EIGEN, anonymous)).resolves.toBe(true);
    });

    it('is off when the environment serves the `false` variant', async () => {
      const adapter = buildStepAdapter({
        variants: [false, true],
        environments: { development: 0 },
      });
      await expect(adapter.evaluate(EIGEN, anonymous)).resolves.toBe(false);
    });

    it('evaluates the environment the datafile is for, not another one', async () => {
      const definition = {
        variants: [false, true],
        environments: { development: 1, preview: 0, production: 0 },
      };
      await expect(
        buildStepAdapter(definition, 'preview').evaluate(EIGEN, anonymous),
      ).resolves.toBe(false);
      await expect(
        buildStepAdapter(definition, 'production').evaluate(EIGEN, anonymous),
      ).resolves.toBe(false);
    });

    it('follows an environment that reuses another environment’s config', async () => {
      const adapter = buildStepAdapter(
        {
          variants: [false, true],
          environments: { development: 1, preview: { reuse: 'development' } },
        },
        'preview',
      );
      await expect(adapter.evaluate(EIGEN, anonymous)).resolves.toBe(true);
    });
  });

  describe('failure-off', () => {
    it('is off when the declared flag has no definition (real FLAG_NOT_FOUND)', async () => {
      const adapter = buildStepAdapter(undefined);
      await expect(adapter.evaluate(EIGEN, anonymous)).resolves.toBe(false);
    });

    it('is off when the flag has no config for this environment', async () => {
      const adapter = buildStepAdapter({
        variants: [false, true],
        environments: { production: 1 },
      });
      await expect(adapter.evaluate(EIGEN, anonymous)).resolves.toBe(false);
    });

    it('is off when the served variant is truthy but not boolean `true`', async () => {
      for (const variant of ['true', 1, { enabled: true }]) {
        const adapter = buildStepAdapter({
          variants: [false, variant],
          environments: { development: 1 },
        });
        await expect(adapter.evaluate(EIGEN, anonymous)).resolves.toBe(false);
      }
    });

    // At runtime without a live stream the SDK serves the provided datafile
    // tagged STALE rather than throwing — the case the adapter's stale check
    // exists for. An enabled definition must still read as off.
    it('is off for an enabled definition served STALE (no live connection)', async () => {
      const adapter = adapterWith({
        buildStep: false,
        stream: false,
        polling: false,
        datafile: datafile({ variants: [false, true], environments: { development: 1 } }),
      });
      await expect(adapter.evaluate(EIGEN, anonymous)).resolves.toBe(false);
    });

    // No stream, no provided datafile, and no bundled definitions (embedding is
    // disabled, so `@vercel/flags-definitions` is absent). The SDK does not
    // reject here: it resolves an error result, which the adapter turns off.
    it('is off when the provider is unreachable and nothing is cached', async () => {
      const adapter = adapterWith({
        buildStep: false,
        stream: { initTimeoutMs: 50 },
        polling: false,
      });
      await expect(adapter.evaluate(EIGEN, anonymous)).resolves.toBe(false);
    });
  });

  it('never calls the SDK for an undeclared flag', async () => {
    const adapter = buildStepAdapter({
      variants: [false, true],
      environments: { development: 1 },
    });
    // Defined in the datafile but not declared in the adapter → still unknown.
    await expect(adapter.evaluate('CMS-Access', anonymous)).resolves.toBeUndefined();
  });
});
