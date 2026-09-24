// Live deployments authenticate automatically; offline dev/CI use fixtures.
// Mock the adapter so these tests never access credentials or the network.
const ORIGINAL_ENV = process.env;

function setEnv(vars: Record<string, string> = {}) {
  process.env = { ...ORIGINAL_ENV };
  for (const key of ['VERCEL', 'VERCEL_ENV', 'VERCEL_OIDC_TOKEN', 'FLAGS', 'FLAGS_SECRET']) {
    delete process.env[key];
  }
  Object.assign(process.env, { NODE_ENV: 'test', ...vars });
}

async function loadServer(evaluate = jest.fn(async () => true)) {
  const createVercelFlagAdapter = jest.fn(() => ({ evaluate }));
  jest.doMock('@/shared/lib/flags/vercel', () => ({ createVercelFlagAdapter }));
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  return { evaluateFlag, createVercelFlagAdapter, evaluate };
}

describe('flag adapter selection by environment', () => {
  beforeEach(() => {
    jest.resetModules();
    setEnv();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.dontMock('@/shared/lib/flags/vercel');
  });

  it.each(['development', 'preview', 'production'])(
    'uses automatic authentication on Vercel %s without custom SDK keys',
    async (environment) => {
      setEnv({ VERCEL_ENV: environment, NODE_ENV: 'production' });
      const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

      await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(true);
      expect(createVercelFlagAdapter).toHaveBeenCalledWith();
    },
  );

  it('selects the live adapter when OIDC is request-scoped, not in process.env', async () => {
    setEnv({ VERCEL: '1', NODE_ENV: 'production' });
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(true);
    expect(createVercelFlagAdapter).toHaveBeenCalledWith();
  });

  it.each<Record<string, string>>([
    { VERCEL_OIDC_TOKEN: 'local-oidc-token' },
    { FLAGS: 'standard-sdk-credential' },
  ])('uses live flags with locally configured credentials: %j', async (credentials) => {
    setEnv(credentials);
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(true);
    expect(createVercelFlagAdapter).toHaveBeenCalledWith();
  });

  it('honors the provider value in production instead of forcing flags off', async () => {
    setEnv({ VERCEL_ENV: 'production', NODE_ENV: 'production' });
    const evaluate = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const { evaluateFlag } = await loadServer(evaluate);

    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(true);
  });

  it('uses fixtures in offline development even when only FLAGS_SECRET exists', async () => {
    setEnv({ FLAGS_SECRET: 'toolbar-secret', FLAGS: '', VERCEL_OIDC_TOKEN: '' });
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    await expect(evaluateFlag('showDemoBanner')).resolves.toBe(true);
    expect(createVercelFlagAdapter).not.toHaveBeenCalled();
  });

  it('keeps unconfigured production builds off rather than using fixtures', async () => {
    setEnv({ NODE_ENV: 'production', FLAGS_SECRET: 'toolbar-secret' });
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    await expect(evaluateFlag('showDemoBanner')).resolves.toBe(false);
    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    expect(createVercelFlagAdapter).not.toHaveBeenCalled();
  });

  it('builds one adapter for concurrent requests without evaluating at construction', async () => {
    setEnv({ VERCEL_ENV: 'preview' });
    const { evaluateFlag, createVercelFlagAdapter, evaluate } = await loadServer();
    expect(createVercelFlagAdapter).not.toHaveBeenCalled();
    expect(evaluate).not.toHaveBeenCalled();

    const results = await Promise.all(
      Array.from({ length: 20 }, () => evaluateFlag('Eigen-AI-Redesign')),
    );
    expect(results.every(Boolean)).toBe(true);
    expect(createVercelFlagAdapter).toHaveBeenCalledTimes(1);
    expect(evaluate).toHaveBeenCalledTimes(20);
  });

  it('keeps flags off if adapter construction fails, without falling back to fixtures', async () => {
    setEnv({ VERCEL_ENV: 'preview' });
    const createVercelFlagAdapter = jest.fn(() => { throw new Error('SDK unavailable'); });
    jest.doMock('@/shared/lib/flags/vercel', () => ({ createVercelFlagAdapter }));
    const { evaluateFlag } = await import('@/shared/lib/flags/server');

    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    await expect(evaluateFlag('showDemoBanner')).resolves.toBe(false);
    expect(createVercelFlagAdapter).toHaveBeenCalledTimes(1);
  });

  it('defaults off on missing values or failed authentication and recovers on later requests', async () => {
    setEnv({ VERCEL_ENV: 'preview' });
    const evaluate = jest.fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('OIDC unavailable'))
      .mockResolvedValueOnce(true);
    const { evaluateFlag } = await loadServer(evaluate);

    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(true);
  });

  it('passes the anonymous public context when none is given', async () => {
    setEnv({ VERCEL_ENV: 'preview' });
    const { evaluateFlag, evaluate } = await loadServer();

    await evaluateFlag('Eigen-AI-Redesign');
    expect(evaluate).toHaveBeenCalledWith('Eigen-AI-Redesign', { cohort: 'public' });
  });
});
