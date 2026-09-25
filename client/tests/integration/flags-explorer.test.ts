/** @jest-environment node */
// Exercise the real Flags SDK crypto, discovery and override handling together
// with the real core evaluator. Only Next's request context and provider I/O
// are replaced; no credentials or external requests are used.
import type { CreateClientOptions, FlagsClient } from '@vercel/flags-core';
import { createAccessProof, encryptOverrides } from 'flags';
import { NextRequest } from 'next/server';

let mockRequest: NextRequest;
let mockClientOptions: CreateClientOptions;
const mockClients: FlagsClient[] = [];
const mockKeys: string[] = [];

jest.mock('next/headers', () => ({
  headers: async () => mockRequest.headers,
  cookies: async () => mockRequest.cookies,
}));

jest.mock('@vercel/flags-core', () => {
  const actual = jest.requireActual<typeof import('@vercel/flags-core')>('@vercel/flags-core');
  return {
    ...actual,
    createClient: (key: string) => {
      mockKeys.push(key);
      const client = actual.createClient(key, mockClientOptions);
      mockClients.push(client);
      return client;
    },
  };
});

const originalEnv = process.env;
const secret = Buffer.alloc(32, 7).toString('base64url');
const otherSecret = Buffer.alloc(32, 8).toString('base64url');
const flagKey = 'Eigen-AI-Redesign';

function setRequest(cookie?: string) {
  mockRequest = new NextRequest('http://localhost/eigenai', {
    headers: cookie ? { cookie: `vercel-flag-overrides=${cookie}` } : {},
  });
}

function discoveryRequest(proof?: string) {
  return new NextRequest('http://localhost/.well-known/vercel/flags', {
    headers: proof ? { authorization: `Bearer ${proof}` } : {},
  });
}

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv, VERCEL_ENV: 'preview', FLAGS: 'vf_server_test', FLAGS_SECRET: secret };
  Object.assign(process.env, { NODE_ENV: 'production' });
  mockKeys.length = 0;
  setRequest();
  mockClientOptions = {
    buildStep: true,
    datafile: {
      projectId: 'prj_test',
      environment: 'preview',
      configUpdatedAt: 1,
      revision: 1,
      definitions: { [flagKey]: { variants: [false, true], environments: { preview: 1 } } },
    },
    fetch: async () => { throw new Error('network disabled in tests'); },
    disableMetrics: true,
    waitUntil: () => {},
  };
});

afterEach(async () => {
  jest.useRealTimers();
  await Promise.all(mockClients.splice(0).map((client) => client.shutdown()));
  process.env = originalEnv;
});

it('authenticates the real provider with FLAGS while FLAGS_SECRET holds an Explorer secret', async () => {
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  await expect(evaluateFlag(flagKey)).resolves.toBe(true);
  expect(mockKeys).toEqual(['vf_server_test']);
});

it('evaluates the provider without an Explorer secret, ignoring override cookies', async () => {
  delete process.env.FLAGS_SECRET;
  setRequest(await encryptOverrides({ [flagKey]: false }, secret));
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  await expect(evaluateFlag(flagKey)).resolves.toBe(true);
});

it('does not treat FLAGS_SECRET alone as provider credentials', async () => {
  delete process.env.FLAGS;
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  await expect(evaluateFlag(flagKey)).resolves.toBe(false);
  expect(mockKeys).toEqual([]);
});

it('applies an authenticated override only to the request that carries it', async () => {
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  setRequest(await encryptOverrides({ [flagKey]: false }, secret));
  await expect(evaluateFlag(flagKey)).resolves.toBe(false);
  expect(mockKeys).toEqual([]);
  setRequest();
  await expect(evaluateFlag(flagKey)).resolves.toBe(true);
});

it('allows a signed preview opt-in with no provider key and leaves other requests off', async () => {
  delete process.env.FLAGS;
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  setRequest(await encryptOverrides({ [flagKey]: true }, secret));
  await expect(evaluateFlag(flagKey)).resolves.toBe(true);
  setRequest();
  await expect(evaluateFlag(flagKey)).resolves.toBe(false);
});

it('ignores malformed, wrong-secret and expired overrides and uses the provider', async () => {
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  for (const cookie of [
    'invalid-cookie',
    await encryptOverrides({ [flagKey]: false }, otherSecret),
    await encryptOverrides({ [flagKey]: false }, secret, '-1s'),
  ]) {
    setRequest(cookie);
    await expect(evaluateFlag(flagKey)).resolves.toBe(true);
  }
});

it.each([
  { label: 'on with the provider off', override: true, provider: false },
  { label: 'off with the provider on', override: false, provider: true },
  { label: 'on without a provider key', override: true, provider: undefined },
])('expires a previously accepted override: $label', async ({ override, provider }) => {
  const issuedAt = new Date('2026-09-25T12:00:00Z');
  jest.useFakeTimers({ now: issuedAt, doNotFake: ['nextTick', 'queueMicrotask'] });
  if (provider === undefined) delete process.env.FLAGS;
  mockClientOptions.datafile = {
    projectId: 'prj_test',
    environment: 'preview',
    configUpdatedAt: 1,
    revision: 1,
    definitions: { [flagKey]: { variants: [false, true], environments: { preview: provider ? 1 : 0 } } },
  };
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  const cookie = await encryptOverrides({ [flagKey]: override }, secret, '1s');
  setRequest(cookie);
  await expect(evaluateFlag(flagKey)).resolves.toBe(override);
  setRequest();
  await expect(evaluateFlag(flagKey)).resolves.toBe(provider ?? false);

  // Keep the same server modules alive, but create a new request after expiry.
  // A cookie-less request does not evict the SDK's last decrypted cookie.
  jest.setSystemTime(issuedAt.getTime() + 2000);
  for (let replay = 0; replay < 2; replay++) {
    setRequest(cookie);
    await expect(evaluateFlag(flagKey)).resolves.toBe(provider ?? false);
  }

  // Expiring an old cookie must not prevent a newly issued override working.
  setRequest(await encryptOverrides({ [flagKey]: override }, secret));
  await expect(evaluateFlag(flagKey)).resolves.toBe(override);
});

it('keeps production off even with valid provider credentials and a signed on override', async () => {
  process.env.VERCEL_ENV = 'production';
  setRequest(await encryptOverrides({ [flagKey]: true }, secret));
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  await expect(evaluateFlag(flagKey)).resolves.toBe(false);
  expect(mockKeys).toEqual([]);
});

it('rejects truthy non-boolean overrides and overrides of undeclared flags', async () => {
  setRequest(await encryptOverrides({ [flagKey]: 'true', unknown: true }, secret));
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  await expect(evaluateFlag(flagKey)).resolves.toBe(false);
  await expect(evaluateFlag('unknown')).resolves.toBe(false);
});

it('keeps a stale enabled provider definition off through the Flags SDK layer', async () => {
  Object.assign(mockClientOptions, { buildStep: false, stream: false, polling: false });
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  await expect(evaluateFlag(flagKey)).resolves.toBe(false);
});

it('returns discovery metadata only with a valid access proof and never contacts the provider', async () => {
  const { getFlagsDiscovery } = await import('@/shared/lib/flags/server');
  const response = await getFlagsDiscovery(discoveryRequest(await createAccessProof(secret)));
  expect(response.status).toBe(200);
  expect(response.headers.get('cache-control')).toBe('no-store');
  expect(response.headers.get('x-flags-sdk-version')).toBeTruthy();
  expect(await response.json()).toMatchObject({
    definitions: { [flagKey]: { defaultValue: false, options: [{ value: false }, { value: true }] } },
  });
  expect(mockKeys).toEqual([]);
});

it('rejects missing, malformed, wrong-secret and expired discovery proofs', async () => {
  const { getFlagsDiscovery } = await import('@/shared/lib/flags/server');
  for (const proof of [undefined, 'invalid-proof', await createAccessProof(otherSecret), await createAccessProof(secret, '-1s')]) {
    const response = await getFlagsDiscovery(discoveryRequest(proof));
    expect(response.status).toBe(401);
    expect(await response.json()).toBeNull();
  }
  expect(mockKeys).toEqual([]);
});

it('fails discovery closed when FLAGS_SECRET is absent or malformed', async () => {
  const { getFlagsDiscovery } = await import('@/shared/lib/flags/server');
  const proof = await createAccessProof(secret);
  delete process.env.FLAGS_SECRET;
  expect((await getFlagsDiscovery(discoveryRequest(proof))).status).toBe(401);
  process.env.FLAGS_SECRET = 'vf_server_not_an_explorer_secret';
  expect((await getFlagsDiscovery(discoveryRequest(proof))).status).toBe(401);
});
