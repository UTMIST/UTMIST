import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light' }),
}));

jest.mock('react-chrono', () => ({
  Chrono: ({ items }: { items: Array<{ title?: string; cardTitle?: string }> }) => (
    <div data-testid="chrono">
      {items.map((item, i) => (
        <div key={i}>{item.cardTitle || item.title}</div>
      ))}
    </div>
  ),
}));

jest.mock('@/components/cards/ai2-new-feature-card', () => ({
  AI2Card: ({ title }: { title: string }) => <div data-testid="ai2-card">{title}</div>,
}));

jest.mock('@/components/peopleGrid', () => ({
  __esModule: true,
  default: ({ people }: { people: Array<{ name: string }> }) => (
    <div data-testid="people-grid">{people.length}</div>
  ),
}));

jest.mock('@/app/ai2/data', () => ({
  specialThanks: [{ name: 'Past Organizer' }],
  aiSquaredDetails: [
    { image: '/cube.png', title: 'Step 1', text: 'Sign up' },
    { image: '/cube.png', title: 'Step 2', text: 'Build agent' },
  ],
  newFeatures: [
    { title: 'Feature A', desc: 'Description A', img: '/a.png' },
    { title: 'Feature B', desc: 'Description B', img: '/b.png' },
  ],
  kickOff: [{ title: 'Kickoff Event', cardTitle: 'Kickoff Card' }],
  finalsBracket: [{ title: 'Finals', cardTitle: 'Finals Card' }],
  agentDevelopment: [{ title: 'Dev', cardTitle: 'Development Card' }],
  ai2Logo: '/ai2.png',
  sponsorsLogos: [
    { name: 'Sponsor1', tier: 'Gold', image: '/s1.png', url: 'https://s1.com' },
  ],
  ai2speakers: [
    { name: 'Speaker 1' },
    { name: 'Speaker 2' },
    { name: 'Speaker 3' },
    { name: 'Speaker 4' },
  ],
  panelSpeakers: [{ name: 'Panel Speaker' }],
}));

import AI2Page from '@/app/ai2/page';

describe('AI2 Page', () => {
  it('renders hero title and apply button', () => {
    render(<AI2Page />);
    expect(
      screen.getByRole('heading', { level: 1, name: /^AI Squared$/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Apply!/i })).toBeInTheDocument();
  });

  it('renders the How it Works steps', () => {
    render(<AI2Page />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
  });

  it('renders the new feature cards', () => {
    render(<AI2Page />);
    const cards = screen.getAllByTestId('ai2-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
  });

  it('defaults to the November 2 (Expo) timeline tab', () => {
    render(<AI2Page />);
    expect(screen.getByText('Expo')).toBeInTheDocument();
  });

  it('switches the timeline when a different date button is clicked', () => {
    render(<AI2Page />);
    fireEvent.click(screen.getByRole('button', { name: 'October 25' }));
    expect(screen.getByText('Kickoff')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'October 25 - November 1' }));
    expect(screen.getByText('Agent Development')).toBeInTheDocument();
  });

  it('renders sponsors and speakers sections', () => {
    render(<AI2Page />);
    expect(screen.getByText('Sponsor1')).toBeInTheDocument();
    expect(screen.getByText(/Speakers Session/i)).toBeInTheDocument();
    expect(screen.getByText(/Panel Speakers/i)).toBeInTheDocument();
  });
});
