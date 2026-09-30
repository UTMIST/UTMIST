import { render, screen } from '@testing-library/react';

describe('EigenAI existing page', () => {
  it('renders the confirmed event details and ticket link', async () => {
    const { default: EigenAIPage } = await import('@/features/public-site/pages/eigenai');
    render(<EigenAIPage />);
    expect(screen.getByRole('heading', { name: 'Eigen AI 2026' })).toBeInTheDocument();
    expect(
      screen.getByText(/Saturday October 3, 2026 and Sunday October 4, 2026/),
    ).toBeInTheDocument();
    expect(screen.getByText('252 Bloor St W, Toronto, ON M5S 1V6, Canada')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get tickets' })).toHaveAttribute(
      'href',
      'https://www.zeffy.com/en-CA/ticketing/eigenai--2026',
    );
  });

  it('renders both confirmed day schedules and unresolved labels', async () => {
    const { default: EigenAIPage } = await import('@/features/public-site/pages/eigenai');
    render(<EigenAIPage />);
    expect(screen.getByText(/Day 1 · Saturday October 3, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Day 2 · Sunday October 4, 2026/)).toBeInTheDocument();
    expect(screen.getByText('Engineering Project Showcase')).toBeInTheDocument();
    expect(screen.getAllByText('Name to be announced.')).toHaveLength(2);
  });

  it('preserves the flag-off schedule while the redesign content is updated', async () => {
    const { default: EigenAIPage } = await import('@/features/public-site/pages/eigenai');
    render(<EigenAIPage />);
    expect(screen.getByText('Sina Panel')).toBeInTheDocument();
    expect(screen.getByText('Stripe Panel')).toBeInTheDocument();
    expect(screen.getByText('1:45–2:45')).toBeInTheDocument();
    expect(screen.queryByText('1:30–2:30 PM')).not.toBeInTheDocument();
    expect(screen.queryByText('AI Agents Workshop')).not.toBeInTheDocument();
    expect(screen.queryByText('Naomi Walch')).not.toBeInTheDocument();
  });
});
