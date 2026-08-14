import { render, screen } from '@testing-library/react';

jest.mock('@/features/public-site/components/peopleGrid', () => ({
  __esModule: true,
  default: ({ people }: { people: Array<{ name: string }> }) => (
    <div data-testid="people-grid">{people.length}</div>
  ),
}));

jest.mock('@/features/public-site/components/lambda', () => ({
  __esModule: true,
  default: () => <div data-testid="lambda-section" />,
}));

jest.mock('@/features/public-site/components/workshops', () => ({
  __esModule: true,
  default: () => <div data-testid="workshops" />,
}));

jest.mock('@/features/public-site/data/eigenai', () => ({
  founderPanelSpeakers: [{ name: 'Founder A' }],
  researchPanelSpeakers: [{ name: 'Researcher A' }],
  keynoteSpeakers: [{ name: 'Keynote A' }],
  speakerSession: [{ name: 'Speaker A' }, { name: 'Speaker B' }, { name: 'Speaker C' }],
}));

describe('EigenAI Page', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-key';
  });

  it('renders hero, intro, and skill-level sections', async () => {
    const { default: EigenAIPage } = await import('@/app/eigenai/page');
    render(<EigenAIPage />);
    expect(screen.getByRole('heading', { name: 'EigenAI' })).toBeInTheDocument();
    expect(screen.getByText(/What is EigenAI\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/EigenAI is built for AI practitioners of all skill levels/i)
    ).toBeInTheDocument();
  });

  it('renders the keynote, panel, and speaker people grids', async () => {
    const { default: EigenAIPage } = await import('@/app/eigenai/page');
    render(<EigenAIPage />);
    const grids = screen.getAllByTestId('people-grid');
    expect(grids.length).toBeGreaterThan(0);
  });

  it('renders the Lambda and Workshops sections', async () => {
    const { default: EigenAIPage } = await import('@/app/eigenai/page');
    render(<EigenAIPage />);
    expect(screen.getByTestId('lambda-section')).toBeInTheDocument();
    expect(screen.getByTestId('workshops')).toBeInTheDocument();
  });

  it('throws an explicit error when the Google Maps API key is missing', async () => {
    jest.resetModules();
    const previous = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const { default: EigenAIPage } = await import('@/app/eigenai/page');
    expect(() => render(<EigenAIPage />)).toThrow(
      /Google Maps API key is not defined/
    );

    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = previous;
  });
});
