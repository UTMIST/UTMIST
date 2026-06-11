import { render, screen } from '@testing-library/react';

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

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(async () => ({
    auth: { getUser: () => mockGetUser() },
    from: mockFrom,
  })),
}));

jest.mock('@/app/admin/AdminPageClient', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-client">Admin Client</div>,
}));

jest.mock('@/app/admin/AddCalendly', () => ({
  __esModule: true,
  default: ({ userId, calendly }: { userId: string; calendly: string }) => (
    <div data-testid="add-calendly">
      {userId}-{calendly}
    </div>
  ),
}));

import AdminPage from '@/app/admin/page';

describe('Admin Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to /auth when there is no logged-in user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    await expect(AdminPage()).rejects.toThrow('__REDIRECT__:/auth');
    expect(mockRedirect).toHaveBeenCalledWith('/auth');
  });

  it('redirects to /auth when the user is not an admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSingle.mockResolvedValue({ data: { id: 'u1', admin: false }, error: null });
    await expect(AdminPage()).rejects.toThrow('__REDIRECT__:/auth');
  });

  it('redirects when the database query returns an error', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSingle.mockResolvedValue({ data: null, error: { message: 'fail' } });
    await expect(AdminPage()).rejects.toThrow('__REDIRECT__:/auth');
  });

  it('renders the admin client and calendly form for admin users', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSingle.mockResolvedValue({
      data: { id: 'u1', admin: true, calendly: 'https://calendly.com/me' },
      error: null,
    });

    const node = await AdminPage();
    render(node);

    expect(screen.getByTestId('admin-client')).toBeInTheDocument();
    expect(screen.getByTestId('add-calendly')).toHaveTextContent(
      'u1-https://calendly.com/me'
    );
  });

  it('passes an empty calendly string when one is not present in the user row', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u2' } } });
    mockSingle.mockResolvedValue({
      data: { id: 'u2', admin: true, calendly: null },
      error: null,
    });

    const node = await AdminPage();
    render(node);

    expect(screen.getByTestId('add-calendly')).toHaveTextContent('u2-');
  });
});
