import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockPush = jest.fn();
const mockGetUser = jest.fn();
const mockUpdateUser = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/shared/lib/client', () => ({
  supabase: {
    auth: {
      getUser: () => mockGetUser(),
      updateUser: (...args: unknown[]) => mockUpdateUser(...args),
    },
  },
}));

import ResetPasswordPage from '@/app/(frontend)/auth/reset-password/page';

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

  it('rejects an empty password', async () => {
    const { container } = render(<ResetPasswordPage />);
    await waitFor(() => expect(mockGetUser).toHaveBeenCalled());
    fireEvent.click(container.querySelector('button[type="submit"]')!);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('rejects a password that is too short', async () => {
    const { container } = render(<ResetPasswordPage />);
    await waitFor(() => expect(mockGetUser).toHaveBeenCalled());
    fireEvent.change(container.querySelector('#password')!, {
      target: { value: 'short' },
    });
    fireEvent.change(container.querySelector('#confirmPassword')!, {
      target: { value: 'short' },
    });
    fireEvent.click(container.querySelector('button[type="submit"]')!);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('rejects mismatched passwords', async () => {
    const { container } = render(<ResetPasswordPage />);
    await waitFor(() => expect(mockGetUser).toHaveBeenCalled());
    fireEvent.change(container.querySelector('#password')!, {
      target: { value: 'longenough123' },
    });
    fireEvent.change(container.querySelector('#confirmPassword')!, {
      target: { value: 'mismatchhere' },
    });
    fireEvent.click(container.querySelector('button[type="submit"]')!);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('calls updateUser on a valid submit', async () => {
    mockUpdateUser.mockResolvedValue({ error: null });
    const { container } = render(<ResetPasswordPage />);
    await waitFor(() => expect(mockGetUser).toHaveBeenCalled());

    fireEvent.change(container.querySelector('#password')!, {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.change(container.querySelector('#confirmPassword')!, {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.click(container.querySelector('button[type="submit"]')!);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'StrongPass123!' });
    });
    await waitFor(() => expect(container.querySelector('form')).not.toBeInTheDocument());
  });

  it('navigates back to /auth from the form', async () => {
    const { container } = render(<ResetPasswordPage />);
    await waitFor(() => expect(mockGetUser).toHaveBeenCalled());
    fireEvent.click(container.querySelector('button[type="button"]')!);
    expect(mockPush).toHaveBeenCalledWith('/auth');
  });
});
