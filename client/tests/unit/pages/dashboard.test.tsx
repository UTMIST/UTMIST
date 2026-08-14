import { render, screen, fireEvent, waitFor } from '@testing-library/react';

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

import DashboardPage from '@/app/dashboard/page';

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading state while user data is being fetched', () => {
    mockGetCurrentUser.mockImplementation(() => new Promise(() => {}));
    render(<DashboardPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('redirects to /auth when no user is authenticated', async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    render(<DashboardPage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/auth'));
  });

  it('renders the dashboard with the user profile when authenticated', async () => {
    mockGetCurrentUser.mockResolvedValue({ id: '1', email: 'jane@example.com', name: 'Jane' });
    mockGetCurrentUserProfile.mockResolvedValue({
      id: '1',
      name: 'Jane Doe',
      organization: 'UofT',
    });
    render(<DashboardPage />);

    expect(await screen.findByText(/welcome back, jane doe/i)).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('UofT')).toBeInTheDocument();
    expect(screen.getByText(/authenticated/i)).toBeInTheDocument();
  });

  it('logs out and redirects to /auth when Sign Out is clicked', async () => {
    mockGetCurrentUser.mockResolvedValue({ id: '1', email: 'a@b.com', name: 'A' });
    mockGetCurrentUserProfile.mockResolvedValue({ id: '1', name: 'A', organization: '' });
    mockLogout.mockResolvedValue(undefined);
    render(<DashboardPage />);

    fireEvent.click(await screen.findByRole('button', { name: /sign out/i }));
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/auth');
    });
  });

  it('navigates to /profile when the profile card is clicked', async () => {
    mockGetCurrentUser.mockResolvedValue({ id: '1', email: 'a@b.com', name: 'A' });
    mockGetCurrentUserProfile.mockResolvedValue({ id: '1', name: 'A' });
    render(<DashboardPage />);

    const card = await screen.findByText('Your Profile');
    fireEvent.click(card.parentElement as HTMLElement);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/profile'));
  });
});
