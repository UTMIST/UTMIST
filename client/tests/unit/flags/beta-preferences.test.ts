// Beta-preference contract: deterministic reads (boolean | null) and typed
// write results, incl. the "denied preference changes" case the #372 DoD
// requires. Covers both the fixture store directly and the server wrappers.

import {
  createFixtureBetaStore,
  fixtureBetaStore,
} from '@/shared/lib/flags/fixtures';
import {
  getBetaPreference,
  setBetaPreference,
} from '@/shared/lib/flags/server';

describe('createFixtureBetaStore', () => {
  it('reads seeded preferences as true / false, and null when none stored', async () => {
    const store = createFixtureBetaStore();
    await expect(store.get('user-opted-in')).resolves.toBe(true);
    await expect(store.get('user-opted-out')).resolves.toBe(false);
    await expect(store.get('nobody')).resolves.toBeNull();
  });

  it('lets a member set their own preference', async () => {
    const store = createFixtureBetaStore();
    await expect(store.set('user-x', 'user-x', true)).resolves.toEqual({
      ok: true,
      optedIn: true,
    });
    await expect(store.get('user-x')).resolves.toBe(true);
  });

  it('denies editing another user\'s preference', async () => {
    const store = createFixtureBetaStore();
    await expect(store.set('user-x', 'user-y', true)).resolves.toEqual({
      ok: false,
      reason: 'denied',
    });
    // The target's preference is untouched.
    await expect(store.get('user-y')).resolves.toBeNull();
  });

  it('rejects an unauthenticated write', async () => {
    const store = createFixtureBetaStore();
    await expect(store.set(null, 'user-y', true)).resolves.toEqual({
      ok: false,
      reason: 'unauthenticated',
    });
    await expect(store.set(undefined, 'user-y', true)).resolves.toEqual({
      ok: false,
      reason: 'unauthenticated',
    });
  });

  it('lets an admin edit another user\'s preference', async () => {
    const store = createFixtureBetaStore();
    await expect(store.set('user-admin', 'user-z', false)).resolves.toEqual({
      ok: true,
      optedIn: false,
    });
    await expect(store.get('user-z')).resolves.toBe(false);
  });

  it('isolates state between instances', async () => {
    const store = createFixtureBetaStore();
    await store.set('user-x', 'user-x', true);
    await expect(createFixtureBetaStore().get('user-x')).resolves.toBeNull();
  });
});

describe('server beta-preference wrappers (default fixture binding)', () => {
  it('reads a seeded preference and null for an unknown user', async () => {
    await expect(getBetaPreference('user-opted-in')).resolves.toBe(true);
    await expect(getBetaPreference('unknown-user')).resolves.toBeNull();
  });

  it('allows a self-edit and denies a cross-user edit', async () => {
    await expect(setBetaPreference('self', 'self', true)).resolves.toEqual({
      ok: true,
      optedIn: true,
    });
    await expect(setBetaPreference('self', 'other', true)).resolves.toEqual({
      ok: false,
      reason: 'denied',
    });
  });

  it('rejects an unauthenticated write through the wrapper', async () => {
    await expect(setBetaPreference(null, 'other', true)).resolves.toEqual({
      ok: false,
      reason: 'unauthenticated',
    });
  });

  it('exposes the shared default store as a BetaPreferenceStore', async () => {
    await expect(fixtureBetaStore.get('user-opted-out')).resolves.toBe(false);
  });
});
