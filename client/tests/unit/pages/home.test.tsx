import { render, screen } from '@testing-library/react';

jest.mock('@/features/public-site/components/cards/hero-card', () => ({
  __esModule: true,
  default: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="hero-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

jest.mock('@/features/public-site/components/sponsors', () => ({
  __esModule: true,
  default: () => <div data-testid="sponsors" />,
}));

jest.mock('@/features/public-site/components/stats', () => ({
  __esModule: true,
  default: () => <div data-testid="stats" />,
}));

jest.mock('@/features/public-site/components/events', () => ({
  __esModule: true,
  default: () => <div data-testid="events" />,
}));

jest.mock('@/features/public-site/components/valueprops', () => ({
  __esModule: true,
  default: () => <div data-testid="valueprops" />,
}));

jest.mock('@/features/public-site/components/startupsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="startups-section" />,
}));

jest.mock('@/features/public-site/components/faq', () => ({
  __esModule: true,
  default: () => <div data-testid="faq" />,
}));

import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the hero title and subtitle', () => {
    render(<Home />);
    expect(screen.getByText('Clear The MIST')).toBeInTheDocument();
    expect(
      screen.getByText(/University of Toronto Machine Intelligence Student Team/i)
    ).toBeInTheDocument();
  });

  it('renders Join Us and Contact Us call-to-action links', () => {
    render(<Home />);
    const joinLink = screen.getByRole('link', { name: /join us/i });
    expect(joinLink).toHaveAttribute('href', '/careers');

    const contactLink = screen.getByRole('link', { name: /contact us/i });
    expect(contactLink).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });

  it('renders the Who We Are and Our Mission hero cards', () => {
    render(<Home />);
    expect(screen.getByText('Who We Are')).toBeInTheDocument();
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
  });

  it('renders all major homepage sections', () => {
    render(<Home />);
    expect(screen.getByTestId('sponsors')).toBeInTheDocument();
    expect(screen.getByTestId('stats')).toBeInTheDocument();
    expect(screen.getByTestId('events')).toBeInTheDocument();
    expect(screen.getByTestId('valueprops')).toBeInTheDocument();
    expect(screen.getByTestId('startups-section')).toBeInTheDocument();
    expect(screen.getByTestId('faq')).toBeInTheDocument();
  });
});
