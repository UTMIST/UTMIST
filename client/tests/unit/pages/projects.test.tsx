import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@/components/carousel', () => ({
  ProjectCarousel: ({ projects }: { projects: Array<{ title: string }> }) => (
    <div data-testid="project-carousel">{projects.length}</div>
  ),
}));

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

jest.mock('@/assets/projects.json', () => [
  {
    name: 'Generative Project',
    description: 'A generative AI project',
    type: 'genai',
    github: 'https://github.com/x/y',
    readMoreLink: '#',
  },
  {
    name: 'Vision Project',
    description: 'A computer vision experiment',
    type: 'cvpr',
    github: '',
    readMoreLink: '#',
  },
]);

import ProjectsPage from '@/app/projects/page';

describe('Projects Page', () => {
  it('renders the Projects hero', () => {
    render(<ProjectsPage />);
    expect(screen.getByTestId('hero')).toHaveTextContent('Projects');
  });

  it('renders all project titles in the See All Projects grid', () => {
    render(<ProjectsPage />);
    expect(screen.getAllByText('Generative Project').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vision Project').length).toBeGreaterThan(0);
  });

  it('filters the See-All grid based on the search input', () => {
    render(<ProjectsPage />);

    // Pre-filter: both projects appear in the See-All grid
    expect(screen.getAllByText('Generative Project').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Vision Project').length).toBeGreaterThanOrEqual(1);

    const search = screen.getByPlaceholderText(/search projects/i);
    fireEvent.change(search, { target: { value: 'generative' } });

    // After filtering, only Generative Project remains visible in the grid
    expect(screen.getAllByText('Generative Project').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Vision Project')).not.toBeInTheDocument();
  });

  it('renders one carousel per project type that has projects', () => {
    render(<ProjectsPage />);
    const carousels = screen.getAllByTestId('project-carousel');
    expect(carousels.length).toBeGreaterThanOrEqual(2);
  });
});
