import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@/shared/lib/validation', () => ({
  validatePhoneNumber: jest.fn(() => true),
  validatePostalCode: jest.fn(() => true),
}));

import ApplicationForm from '@/app/apply/page';

describe('Apply Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset?.();
    global.alert = jest.fn();
  });

  it('renders all form sections', () => {
    render(<ApplicationForm />);
    expect(screen.getByRole('heading', { name: /apply here/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /personal information/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /contact information/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^education$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /why join UTMIST/i })).toBeInTheDocument();
    expect(screen.getByText(/Resume Upload/i)).toBeInTheDocument();
  });

  it('updates first and last name fields when typed into', () => {
    render(<ApplicationForm />);
    const first = screen.getByLabelText(/first name/i) as HTMLInputElement;
    const last = screen.getByLabelText(/last name/i) as HTMLInputElement;

    fireEvent.change(first, { target: { value: 'Ada' } });
    fireEvent.change(last, { target: { value: 'Lovelace' } });

    expect(first.value).toBe('Ada');
    expect(last.value).toBe('Lovelace');
  });

  it('formats the phone number as the user types', () => {
    const { container } = render(<ApplicationForm />);
    const phone = container.querySelector('#phoneNumber') as HTMLInputElement;
    expect(phone).not.toBeNull();

    fireEvent.change(phone, { target: { value: '4165550123' } });
    expect(phone.value).toBe('416-555-0123');
  });

  it('shows an email validation error for invalid emails on blur', () => {
    render(<ApplicationForm />);
    const email = screen.getByLabelText(/^email$/i) as HTMLInputElement;
    fireEvent.change(email, { target: { value: 'not-valid' } });
    fireEvent.blur(email);
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('submits the form data via POST /api/apply', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({ ok: true });
    render(<ApplicationForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/apply',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });
});
