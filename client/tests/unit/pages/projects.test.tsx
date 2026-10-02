import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@/features/public-site/components/carousel', () => ({
  ProjectCarousel: ({ projects }: { projects: Array<{ title: string }> }) => (
    <div data-testid="project-carousel">{projects.length}</div>
  ),
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

import ProjectsPage from '@/app/(frontend)/projects/page';

describe('Projects Page', () => {
  it('filters the See-All grid based on the search input', () => {
    const { container } = render(<ProjectsPage />);

    // Pre-filter: both projects appear in the See-All grid
    expect(screen.getAllByText('Generative Project').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Vision Project').length).toBeGreaterThanOrEqual(1);

    const search = container.querySelector('input')!;
    fireEvent.change(search, { target: { value: 'generative' } });

    // After filtering, only Generative Project remains visible in the grid
    expect(screen.getAllByText('Generative Project').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Vision Project')).not.toBeInTheDocument();
  });

});
