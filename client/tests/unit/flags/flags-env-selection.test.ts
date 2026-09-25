// Which flag adapter `evaluateFlag` binds per environment (#447): the Vercel
// adapter with the `FLAGS` key on preview and development / local, never
// in production (all off, even with a key present), and the fixtures when no key
// is configured outside production.
//
// The Vercel adapter module is mocked so no SDK is loaded; each case re-imports
// `flags/server` with fresh modules because the adapter is resolved once per
// module instance.

const ORIGINAL_ENV = process.env;

/** Start from the original env minus any flag config, then apply `vars`. */
function setEnv(vars: Record<string, string>) {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.FLAGS;
  delete process.env.FLAGS_SECRET;
  delete process.env.FLAGS_KEY_DEV;
  delete process.env.FLAGS_KEY_PREVIEW;
  delete process.env.VERCEL_ENV;
  // Object.assign sidesteps the read-only `NODE_ENV` typing.
  Object.assign(process.env, vars);
}

async function loadServer() {
  const createVercelFlagAdapter = jest.fn(() => ({
    evaluate: async () => true,
  }));
  jest.doMock('@/shared/lib/flags/vercel', () => ({ createVercelFlagAdapter }));
  const { evaluateFlag } = await import('@/shared/lib/flags/server');
  return { evaluateFlag, createVercelFlagAdapter };
}

describe('flag adapter selection by environment', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.dontMock('@/shared/lib/flags/vercel');
  });

  it('uses the Vercel adapter with FLAGS on preview', async () => {
    setEnv({ VERCEL_ENV: 'preview', NODE_ENV: 'production', FLAGS: 'preview-key' });
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(true);
    expect(createVercelFlagAdapter).toHaveBeenCalledWith('preview-key');
  });

  it('uses the Vercel adapter with FLAGS in development / local', async () => {
    setEnv({ FLAGS: 'dev-key' });
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(true);
    expect(createVercelFlagAdapter).toHaveBeenCalledWith('dev-key');
  });

  it('keeps every flag off in production, even with a key present', async () => {
    setEnv({ VERCEL_ENV: 'production', NODE_ENV: 'production', FLAGS: 'some-key' });
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    // `showDemoBanner` is on in the fixtures, so `false` proves they're not bound.
    await expect(evaluateFlag('showDemoBanner')).resolves.toBe(false);
    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    expect(createVercelFlagAdapter).not.toHaveBeenCalled();
  });

  it('falls back to the fixtures without a key outside production', async () => {
    setEnv({});
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    await expect(evaluateFlag('showDemoBanner')).resolves.toBe(true);
    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(true);
    expect(createVercelFlagAdapter).not.toHaveBeenCalled();
  });

  // A preview deployment builds with NODE_ENV=production. Without a key it must
  // stay off rather than fall to the fixtures.
  it('keeps every flag off on a keyless preview', async () => {
    setEnv({ VERCEL_ENV: 'preview', NODE_ENV: 'production' });
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    await expect(evaluateFlag('showDemoBanner')).resolves.toBe(false);
    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    expect(createVercelFlagAdapter).not.toHaveBeenCalled();
  });

  // FLAGS_KEY_DEV / FLAGS_KEY_PREVIEW were renamed to FLAGS. A stale
  // `.env` or deployment still carrying only the old names must not enable the
  // live adapter.
  it('ignores the retired FLAGS_KEY_DEV / FLAGS_KEY_PREVIEW names', async () => {
    setEnv({ FLAGS_KEY_DEV: 'dev-key', FLAGS_KEY_PREVIEW: 'preview-key' });
    const { createVercelFlagAdapter, evaluateFlag } = await loadServer();

    await evaluateFlag('Eigen-AI-Redesign');
    expect(createVercelFlagAdapter).not.toHaveBeenCalled();
  });

  it('treats an empty key as unset (no adapter built with a blank key)', async () => {
    setEnv({ VERCEL_ENV: 'preview', NODE_ENV: 'production', FLAGS: '' });
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    expect(createVercelFlagAdapter).not.toHaveBeenCalled();
  });

  it('keeps flags off in a keyless production build without VERCEL_ENV', async () => {
    setEnv({ NODE_ENV: 'production' });
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    await expect(evaluateFlag('showDemoBanner')).resolves.toBe(false);
    expect(createVercelFlagAdapter).not.toHaveBeenCalled();
  });

  it('builds the adapter once, however many flags evaluate concurrently', async () => {
    setEnv({ FLAGS: 'dev-key' });
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    const results = await Promise.all(
      Array.from({ length: 20 }, () => evaluateFlag('Eigen-AI-Redesign')),
    );
    expect(results.every(Boolean)).toBe(true);
    await evaluateFlag('Eigen-AI-Redesign');
    expect(createVercelFlagAdapter).toHaveBeenCalledTimes(1);
  });

  it('reads the key once: a key changed after first use is not picked up', async () => {
    setEnv({ FLAGS: 'dev-key' });
    const { evaluateFlag, createVercelFlagAdapter } = await loadServer();

    await evaluateFlag('Eigen-AI-Redesign');
    process.env.FLAGS = 'rotated-key';
    await evaluateFlag('Eigen-AI-Redesign');
    expect(createVercelFlagAdapter).toHaveBeenCalledTimes(1);
    expect(createVercelFlagAdapter).toHaveBeenCalledWith('dev-key');
  });

  // The adapter promise is memoised, rejection included: if building the
  // adapter fails (e.g. the SDK throws on a malformed key), every flag stays off
  // for the life of the server instance rather than retrying per request.
  it('stays off for the instance lifetime when building the adapter throws', async () => {
    setEnv({ FLAGS: 'dev-key' });
    const createVercelFlagAdapter = jest.fn(() => {
      throw new Error('@vercel/flags-core: Invalid sdkKey');
    });
    jest.doMock('@/shared/lib/flags/vercel', () => ({ createVercelFlagAdapter }));
    const { evaluateFlag } = await import('@/shared/lib/flags/server');

    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    // Fixtures are not a fallback for a broken live adapter.
    await expect(evaluateFlag('showDemoBanner')).resolves.toBe(false);
    expect(createVercelFlagAdapter).toHaveBeenCalledTimes(1);
  });

  it('turns an adapter that resolves undefined or rejects into false', async () => {
    setEnv({ FLAGS: 'dev-key' });
    const evaluate = jest
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('provider unavailable'))
      .mockResolvedValueOnce(true);
    jest.doMock('@/shared/lib/flags/vercel', () => ({
      createVercelFlagAdapter: () => ({ evaluate }),
    }));
    const { evaluateFlag } = await import('@/shared/lib/flags/server');

    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(false);
    // A transient evaluation failure does not poison later evaluations.
    await expect(evaluateFlag('Eigen-AI-Redesign')).resolves.toBe(true);
  });

  it('passes the anonymous public context when none is given', async () => {
    setEnv({ FLAGS: 'dev-key' });
    const evaluate = jest.fn(async () => true);
    jest.doMock('@/shared/lib/flags/vercel', () => ({
      createVercelFlagAdapter: () => ({ evaluate }),
    }));
    const { evaluateFlag } = await import('@/shared/lib/flags/server');

    await evaluateFlag('Eigen-AI-Redesign');
    expect(evaluate).toHaveBeenCalledWith('Eigen-AI-Redesign', { cohort: 'public' });
  });
});
