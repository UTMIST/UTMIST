import { render, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@/shared/lib', () => ({
  validatePhoneNumber: jest.fn(() => true),
  validatePostalCode: jest.fn(() => true),
}));

import ApplicationForm from '@/app/(frontend)/apply/page';

describe('Apply Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset?.();
    global.alert = jest.fn();
  });

  it('updates first and last name fields when typed into', () => {
    const { container } = render(<ApplicationForm />);
    const first = container.querySelector('#firstName') as HTMLInputElement;
    const last = container.querySelector('#lastName') as HTMLInputElement;

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

  it('submits the form data via POST /api/apply', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({ ok: true });
    const { container } = render(<ApplicationForm />);

    fireEvent.change(container.querySelector('#firstName')!, { target: { value: 'Ada' } });
    fireEvent.change(container.querySelector('#email')!, { target: { value: 'a@b.com' } });
    fireEvent.click(container.querySelector('button[type="submit"]')!);

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
