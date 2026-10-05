import { render, fireEvent, waitFor } from '@testing-library/react';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), prefetch: jest.fn() }),
}));

const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockGetCurrentUser = jest.fn();
const mockResendConfirmation = jest.fn();
const mockResetPassword = jest.fn();

jest.mock('@/shared/lib/client', () => ({
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

import AuthPage from '@/app/(frontend)/auth/page';

describe('Auth Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue(null);
  });

  it('switches from login to registration mode', async () => {
    const { container } = render(<AuthPage />);
    await waitFor(() => expect(mockGetCurrentUser).toHaveBeenCalled());

    fireEvent.click(container.querySelector('button:not([type])')!);
    expect(container.querySelector('#name')).toBeInTheDocument();
    expect(container.querySelector('#confirmPassword')).toBeInTheDocument();
  });

  it('does not submit an invalid email address', async () => {
    const { container } = render(<AuthPage />);
    await waitFor(() => expect(mockGetCurrentUser).toHaveBeenCalled());
    fireEvent.change(container.querySelector('#email')!, { target: { value: 'not-an-email' } });
    fireEvent.change(container.querySelector('#password')!, { target: { value: 'pass' } });
    fireEvent.click(container.querySelector('button[type="submit"]')!);
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls login and redirects to /profile on successful login', async () => {
    mockLogin.mockResolvedValue({ user: { id: '1' } });
    const { container } = render(<AuthPage />);
    await waitFor(() => expect(mockGetCurrentUser).toHaveBeenCalled());
    fireEvent.change(container.querySelector('#email')!, { target: { value: 'a@b.com' } });
    fireEvent.change(container.querySelector('#password')!, { target: { value: 'password' } });
    fireEvent.click(container.querySelector('button[type="submit"]')!);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('a@b.com', 'password');
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('opens the password-reset controls', async () => {
    const { container } = render(<AuthPage />);
    await waitFor(() => expect(mockGetCurrentUser).toHaveBeenCalled());
    const resetToggle = container.querySelector('form button[type="button"]')!;

    fireEvent.click(resetToggle);
    expect(container.querySelectorAll('form button[type="button"]')).toHaveLength(3);
  });

  it('redirects already-authenticated users to /profile', async () => {
    mockGetCurrentUser.mockResolvedValue({ id: 'u1', email: 'x@y.com' });
    render(<AuthPage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/profile'));
  });
});
