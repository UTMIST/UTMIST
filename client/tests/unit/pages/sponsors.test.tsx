import { render, screen } from '@testing-library/react';

// The @/shared/ui barrel eagerly re-exports navbar.tsx, which imports
// @/shared/lib/client (real Supabase browser client). That transitively pulls
// in the ESM-only `isows` package, which Jest cannot parse. This page never
// renders Navbar, so a minimal stub is enough to keep the barrel's module
// graph from loading the real Supabase client at import time.
jest.mock('@/shared/lib/client', () => ({
  useUser: () => ({ user: null, loading: false }),
}));

jest.mock('@/shared/ui/heroSection', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="hero">{title}</div>,
}));

jest.mock('@/features/public-site/components/cards/sponsor-card', () => ({
  __esModule: true,
  default: ({ category, price }: { category: string; price: string }) => (
    <div data-testid="sponsor-card">
      <h3>{category}</h3>
      <span>{price}</span>
    </div>
  ),
}));

jest.mock('@/features/public-site/components/cards/contact-us-card', () => ({
  __esModule: true,
  default: () => <div data-testid="contact-us-card" />,
}));

jest.mock('@/assets/sponsors.json', () => [
  { category: 'Gold', price: '$5000', perks: ['Logo on website'] },
  { category: 'Silver', price: '$2000', perks: ['Mention in newsletter'] },
]);

import SponsorsPage from '@/app/sponsors/page';

describe('Sponsors Page', () => {
  it('renders the Sponsor Us section', () => {
    render(<SponsorsPage />);
    expect(screen.getByRole('heading', { name: /sponsor us/i })).toBeInTheDocument();
  });

  it('renders one sponsor card per tier from the data file', () => {
    render(<SponsorsPage />);
    const cards = screen.getAllByTestId('sponsor-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('Gold')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
  });

  it('renders the contact-us section', () => {
    render(<SponsorsPage />);
    expect(screen.getByTestId('contact-us-card')).toBeInTheDocument();
  });
});
