import { render, screen } from '@testing-library/react';

// This page imports Dropdown from the @/shared/ui/client chrome barrel, which
// also re-exports navbar.tsx → @/shared/lib/client (real Supabase browser
// client) → the ESM-only `isows` package, which Jest cannot parse. The page
// never renders Navbar, so a minimal stub keeps the chrome barrel's module
// graph from loading the real Supabase client at import time.
jest.mock('@/shared/lib/client', () => ({
  useUser: () => ({ user: null, loading: false }),
}));

jest.mock('@/shared/ui/dropdown', () => ({
  Dropdown: ({
    label,
    placeholder,
    helperText,
    error,
    disabled,
  }: {
    label?: string;
    placeholder?: string;
    helperText?: string;
    error?: string;
    disabled?: boolean;
  }) => (
    <div data-testid="dropdown" data-disabled={disabled ? 'true' : 'false'}>
      {label && <label>{label}</label>}
      <span>{placeholder}</span>
      {helperText && <small>{helperText}</small>}
      {error && <p role="alert">{error}</p>}
    </div>
  ),
}));

import DropdownDemoPage from '@/app/dev/dropdown/page';

describe('Dev Dropdown Demo Page', () => {
  it('renders the page heading and intro copy', () => {
    render(<DropdownDemoPage />);
    expect(
      screen.getByRole('heading', { name: /dropdown component preview/i })
    ).toBeInTheDocument();
  });

  it('renders three demo dropdowns (controlled, uncontrolled, disabled)', () => {
    render(<DropdownDemoPage />);
    const dropdowns = screen.getAllByTestId('dropdown');
    expect(dropdowns).toHaveLength(3);
  });

  it('shows the controlled selection initially as ai2', () => {
    render(<DropdownDemoPage />);
    expect(screen.getByText(/Selected value: ai2/i)).toBeInTheDocument();
  });

  it('renders the disabled dropdown with its error message', () => {
    render(<DropdownDemoPage />);
    expect(
      screen.getByText(/feature locked until profile is completed/i)
    ).toBeInTheDocument();
    const dropdowns = screen.getAllByTestId('dropdown');
    expect(dropdowns[2]).toHaveAttribute('data-disabled', 'true');
  });
});
