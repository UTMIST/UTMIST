import { render, screen } from '@testing-library/react';

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

import SponsorsPage from '@/app/(frontend)/sponsors/page';

describe('Sponsors Page', () => {
  it('renders one sponsor card per tier from the data file', () => {
    render(<SponsorsPage />);
    const cards = screen.getAllByTestId('sponsor-card');
    expect(cards).toHaveLength(2);
  });
});
