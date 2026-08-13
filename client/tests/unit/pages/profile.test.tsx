import { render, screen, waitFor } from '@testing-library/react';

const mockPush = jest.fn();
const mockGetCurrentUser = jest.fn();
const mockGetCurrentUserProfile = jest.fn();
const mockLogout = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/shared/lib/auth/client', () => ({
  getCurrentUser: () => mockGetCurrentUser(),
  logout: () => mockLogout(),
}));

jest.mock('@/shared/lib/auth/user', () => ({
  getCurrentUserProfile: () => mockGetCurrentUserProfile(),
}));

jest.mock('@/components/profile/ProfileCard', () => ({
  __esModule: true,
  default: ({ userProfile }: { userProfile: { name: string } }) => (
    <div data-testid="profile-card">{userProfile.name}</div>
  ),
}));

jest.mock('@/components/profile/ProfileEditForm', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-edit-form" />,
}));

jest.mock('@/components/profile/SocialCard', () => ({
  __esModule: true,
  default: () => <div data-testid="social-card" />,
}));

jest.mock('@/components/profile/QRCodeCard', () => ({
  __esModule: true,
  default: () => <div data-testid="qr-card" />,
}));

jest.mock('@/components/profile/ResumeCard', () => ({
  __esModule: true,
  default: () => <div data-testid="resume-card" />,
}));

jest.mock('@/components/profile/AdminCard', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-card" />,
}));

import ProfilePage from '@/app/profile/page';

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading state initially', () => {
    mockGetCurrentUser.mockImplementation(() => new Promise(() => {}));
    render(<ProfilePage />);
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it('redirects to /auth if no user is authenticated', async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    render(<ProfilePage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/auth'));
  });

  it('renders profile cards once data has loaded', async () => {
    mockGetCurrentUser.mockResolvedValue({ id: '1', email: 'a@b.com' });
    mockGetCurrentUserProfile.mockResolvedValue({
      id: '1',
      name: 'Jane',
      admin: false,
      linkedin: 'jd',
      github: 'jd',
      twitter: 'jd',
      year: 2026,
    });
    render(<ProfilePage />);

    expect(await screen.findByTestId('profile-card')).toHaveTextContent('Jane');
    expect(screen.getByTestId('social-card')).toBeInTheDocument();
    expect(screen.getByTestId('resume-card')).toBeInTheDocument();
    expect(screen.getByTestId('qr-card')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-card')).not.toBeInTheDocument();
  });

  it('renders the AdminCard when the profile has admin privileges', async () => {
    mockGetCurrentUser.mockResolvedValue({ id: '1' });
    mockGetCurrentUserProfile.mockResolvedValue({ id: '1', name: 'Admin', admin: true });
    render(<ProfilePage />);
    expect(await screen.findByTestId('admin-card')).toBeInTheDocument();
  });

  it('renders an error UI if loading the profile throws', async () => {
    mockGetCurrentUser.mockRejectedValue(new Error('boom'));
    render(<ProfilePage />);
    expect(await screen.findByText(/error loading profile/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});
