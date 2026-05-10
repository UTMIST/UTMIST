import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), prefetch: jest.fn() }),
}));

const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockGetCurrentUser = jest.fn();
const mockResendConfirmation = jest.fn();
const mockResetPassword = jest.fn();

jest.mock('@/utils/auth', () => ({
  login: (...args: unknown[]) => mockLogin(...args),
  register: (...args: unknown[]) => mockRegister(...args),
  getCurrentUser: () => mockGetCurrentUser(),
  resendConfirmation: (...args: unknown[]) => mockResendConfirmation(...args),
  resetPassword: (...args: unknown[]) => mockResetPassword(...args),
  AUTH_ERRORS: {
    EMAIL_ALREADY_TAKEN: 'EMAIL_ALREADY_TAKEN',
    EMAIL_NEEDS_CONFIRMATION: 'EMAIL_NEEDS_CONFIRMATION',
  },
}));

import AuthPage from '@/app/auth/page';

describe('Auth Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue(null);
  });

  it('renders the login form by default', async () => {
    render(<AuthPage />);
    expect(await screen.findByRole('heading', { name: 'Log In' })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('switches to registration mode when "Create an account" is clicked', async () => {
    render(<AuthPage />);
    fireEvent.click(await screen.findByRole('button', { name: /create an account/i }));
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('shows email validation error when submitting with invalid email', async () => {
    render(<AuthPage />);
    await screen.findByRole('heading', { name: 'Log In' });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('calls login and redirects to /profile on successful login', async () => {
    mockLogin.mockResolvedValue({ user: { id: '1' } });
    render(<AuthPage />);
    await screen.findByRole('heading', { name: 'Log In' });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('a@b.com', 'password');
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('shows the forgot password panel when the link is clicked', async () => {
    render(<AuthPage />);
    fireEvent.click(await screen.findByRole('button', { name: /forgot your password/i }));
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('redirects already-authenticated users to /profile', async () => {
    mockGetCurrentUser.mockResolvedValue({ id: 'u1', email: 'x@y.com' });
    render(<AuthPage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/profile'));
  });
});
