import { render, screen, fireEvent } from '@testing-library/react';

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

jest.mock('@/features/public-site/components/peopleGrid', () => ({
  __esModule: true,
  default: ({ people }: { people: Array<{ name: string }> }) => (
    <div data-testid="people-grid">{people.length}</div>
  ),
}));

jest.mock('@/features/public-site/data/ml-fundamentals', () => ({
  programDirectors: [{ name: 'Director A' }],
  academicsTeam: [{ name: 'Academic A' }, { name: 'Academic B' }],
  techWritersTeam: [{ name: 'Writer A' }],
}));

import MLFundamentals from '@/app/ml-fundamentals/page';

describe('ML Fundamentals Page', () => {
  it('renders both Phase 1 and Phase 2 schedule sections', () => {
    render(<MLFundamentals />);
    expect(screen.getByText(/Phase 1: Workshop Schedule/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 2: Project/i)).toBeInTheDocument();
  });

  it('renders all eight Phase 1 weeks', () => {
    render(<MLFundamentals />);
    expect(screen.getByText(/Introduction to Machine Learning/i)).toBeInTheDocument();
    expect(screen.getByText(/Deep Learning & Modern Architectures/i)).toBeInTheDocument();
  });

  it('opens the workshop modal when a Slides button is clicked', () => {
    render(<MLFundamentals />);
    const slideButtons = screen.getAllByRole('button', { name: /slides/i });
    fireEvent.click(slideButtons[0]);
    expect(screen.getAllByText(/Introduction to Machine Learning/i).length).toBeGreaterThan(1);
  });

  it('toggles an FAQ open and shows its answer', () => {
    render(<MLFundamentals />);
    const faq = screen.getByText(/what prerequisites do I need/i);
    fireEvent.click(faq);
    expect(
      screen.getByText(/basic knowledge of python programming/i)
    ).toBeInTheDocument();
  });

  it('renders three people-grid sections for the team', () => {
    render(<MLFundamentals />);
    const grids = screen.getAllByTestId('people-grid');
    expect(grids).toHaveLength(3);
  });
});
