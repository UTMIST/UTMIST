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

import {
  getAdminUser,
  getCurrentUser,
  requireAdmin,
  requireUser,
} from '@/shared/lib/auth/guards';

const signedOut = () => mockGetUser.mockResolvedValue({ data: { user: null } });

const signedInAs = (profile: Record<string, unknown> | null, error: unknown = null) => {
  mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
  mockSingle.mockResolvedValue({ data: profile, error });
};

describe('auth guards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdminUser', () => {
    it('returns null when nobody is signed in', async () => {
      signedOut();
      await expect(getAdminUser()).resolves.toBeNull();
    });

    it('returns null for a signed-in non-admin', async () => {
      signedInAs({ id: 'u1', admin: false });
      await expect(getAdminUser()).resolves.toBeNull();
    });

    it('returns null when the admin flag is absent entirely', async () => {
      signedInAs({ id: 'u1' });
      await expect(getAdminUser()).resolves.toBeNull();
    });

    it('returns null when the profile lookup errors', async () => {
      signedInAs(null, { message: 'boom' });
      await expect(getAdminUser()).resolves.toBeNull();
    });

    it('returns the profile for an admin', async () => {
      signedInAs({ id: 'u1', admin: true });
      await expect(getAdminUser()).resolves.toEqual({ id: 'u1', admin: true });
    });
  });

  describe('getCurrentUser', () => {
    it('returns null when nobody is signed in', async () => {
      signedOut();
      await expect(getCurrentUser()).resolves.toBeNull();
    });

    it('returns the profile of a signed-in non-admin', async () => {
      signedInAs({ id: 'u1', admin: false });
      await expect(getCurrentUser()).resolves.toEqual({ id: 'u1', admin: false });
    });
  });

  describe('requireAdmin', () => {
    it('redirects to /auth when nobody is signed in', async () => {
      signedOut();
      await expect(requireAdmin()).rejects.toThrow('__REDIRECT__:/auth');
      expect(mockRedirect).toHaveBeenCalledWith('/auth');
    });

    it('redirects to /auth for a signed-in non-admin', async () => {
      signedInAs({ id: 'u1', admin: false });
      await expect(requireAdmin()).rejects.toThrow('__REDIRECT__:/auth');
    });

    it('redirects to /auth when the profile lookup errors', async () => {
      signedInAs(null, { message: 'boom' });
      await expect(requireAdmin()).rejects.toThrow('__REDIRECT__:/auth');
    });

    it('returns the profile for an admin', async () => {
      signedInAs({ id: 'u1', admin: true });
      await expect(requireAdmin()).resolves.toEqual({ id: 'u1', admin: true });
    });
  });

  describe('requireUser', () => {
    it('redirects to /auth when nobody is signed in', async () => {
      signedOut();
      await expect(requireUser()).rejects.toThrow('__REDIRECT__:/auth');
    });

    it('allows a signed-in non-admin through', async () => {
      signedInAs({ id: 'u1', admin: false });
      await expect(requireUser()).resolves.toEqual({ id: 'u1', admin: false });
    });
  });
});
