import { render, screen } from '@testing-library/react';

jest.mock('@/shared/ui/heroSection', () => ({
  __esModule: true,
  default: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
}));

jest.mock('@/assets/careers.json', () => [
  {
    title: 'Software Engineer',
    department: 'Engineering',
    division: 'AI',
    applicationLink: 'https://apply.example.com/1',
  },
  {
    title: 'ML Researcher',
    department: 'Research',
    division: '',
    applicationLink: 'https://apply.example.com/2',
  },
]);

import CareersPage from '@/app/careers/page';

describe('Careers Page', () => {
  it('renders the page hero with title and subtitle', () => {
    render(<CareersPage />);
    expect(screen.getByRole('heading', { name: /careers/i })).toBeInTheDocument();
    expect(screen.getByText(/help shape the future of AI and ML/i)).toBeInTheDocument();
  });

  it('renders the Open Positions header', () => {
    render(<CareersPage />);
    expect(screen.getByRole('heading', { name: /open positions/i })).toBeInTheDocument();
  });

  it('renders one card per position from the data file', () => {
    render(<CareersPage />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('ML Researcher')).toBeInTheDocument();
  });

  it('renders Apply Now links pointing at the position application URLs', () => {
    render(<CareersPage />);
    const applyLinks = screen.getAllByRole('link', { name: /apply now/i });
    expect(applyLinks).toHaveLength(2);
    expect(applyLinks[0]).toHaveAttribute('href', 'https://apply.example.com/1');
    expect(applyLinks[0]).toHaveAttribute('target', '_blank');
  });

  it('shows the division separator dot only when a division is present', () => {
    render(<CareersPage />);
    expect(screen.getAllByText('•').length).toBe(1);
  });
});
