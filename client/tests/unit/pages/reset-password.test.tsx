import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockPush = jest.fn();
const mockGetUser = jest.fn();
const mockUpdateUser = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: () => mockGetUser(),
      updateUser: (...args: unknown[]) => mockUpdateUser(...args),
    },
  },
}));

import ResetPasswordPage from '@/app/auth/reset-password/page';

describe('Reset Password Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: { id: '1' } } });
  });

  it('redirects to /auth?error=reset_expired when the user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    render(<ResetPasswordPage />);
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith('/auth?error=reset_expired')
    );
  });

  it('renders the password reset form', async () => {
    render(<ResetPasswordPage />);
    expect(
      await screen.findByRole('heading', { name: /reset your password/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
  });

  it('shows a "Password is required" error when the password is empty', async () => {
    render(<ResetPasswordPage />);
    fireEvent.click(await screen.findByRole('button', { name: /update password/i }));
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('shows a length error when the password is too short', async () => {
    render(<ResetPasswordPage />);
    fireEvent.change(await screen.findByLabelText('New Password'), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('shows a mismatch error when the two password fields differ', async () => {
    render(<ResetPasswordPage />);
    fireEvent.change(await screen.findByLabelText('New Password'), {
      target: { value: 'longenough123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'mismatchhere' },
    });
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('calls updateUser and shows the success state on a valid submit', async () => {
    mockUpdateUser.mockResolvedValue({ error: null });
    render(<ResetPasswordPage />);

    fireEvent.change(await screen.findByLabelText('New Password'), {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'StrongPass123!' });
    });
    expect(await screen.findByText(/password reset successful/i)).toBeInTheDocument();
  });

  it('navigates back to /auth when "Back to Login" is clicked', async () => {
    render(<ResetPasswordPage />);
    fireEvent.click(await screen.findByRole('button', { name: /back to login/i }));
    expect(mockPush).toHaveBeenCalledWith('/auth');
  });
});
