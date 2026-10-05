import { render, fireEvent, waitFor } from '@testing-library/react';

const mockPush = jest.fn();
const mockGetCurrentUser = jest.fn();
const mockLogout = jest.fn();
const mockGetCurrentUserProfile = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/shared/lib/client', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
  logout: () => mockLogout(),
  getCurrentUserProfile: () => mockGetCurrentUserProfile(),
}));

import DashboardPage from '@/app/(frontend)/dashboard/page';

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to /auth when no user is authenticated', async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    render(<DashboardPage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/auth'));
  });

  it('logs out and redirects to /auth when Sign Out is clicked', async () => {
    mockGetCurrentUser.mockResolvedValue({ id: '1', email: 'a@b.com', name: 'A' });
    mockGetCurrentUserProfile.mockResolvedValue({ id: '1', name: 'A', organization: '' });
    mockLogout.mockResolvedValue(undefined);
    const { container } = render(<DashboardPage />);

    await waitFor(() => expect(container.querySelector('header button')).toBeInTheDocument());
    fireEvent.click(container.querySelector('header button')!);
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/auth');
    });
  });

});
