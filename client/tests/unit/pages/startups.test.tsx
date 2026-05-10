import { render, screen } from '@testing-library/react';
import StartupsPage from '@/app/startups/page';

describe('Startups Page', () => {
  it('renders the MISTic R&D hero title', () => {
    render(<StartupsPage />);
    expect(screen.getByRole('heading', { name: /MISTic R&D/i })).toBeInTheDocument();
  });

  it('renders the Startups @ UTMIST sub-section', () => {
    render(<StartupsPage />);
    expect(screen.getByRole('heading', { name: /Startups @ UTMIST/i })).toBeInTheDocument();
  });

  it('renders all three featured startups', () => {
    render(<StartupsPage />);
    expect(screen.getByText('Caid')).toBeInTheDocument();
    expect(screen.getByText('BuildSafe')).toBeInTheDocument();
    expect(screen.getByText('ClearSite.ai')).toBeInTheDocument();
  });

  it('renders the Our Partners section with both partners', () => {
    render(<StartupsPage />);
    expect(screen.getByRole('heading', { name: /Our Partners/i })).toBeInTheDocument();
    expect(screen.getByText('Front Row Ventures')).toBeInTheDocument();
    expect(screen.getByText('Forum Ventures')).toBeInTheDocument();
  });
});
