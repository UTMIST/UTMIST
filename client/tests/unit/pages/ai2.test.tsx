import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('react-chrono', () => ({
  Chrono: ({ items }: { items: Array<{ title?: string }> }) => (
    <div data-testid="chrono" data-first-item={items[0]?.title} />
  ),
}));

jest.mock('@/features/public-site/components/cards/ai2-new-feature-card', () => ({
  AI2Card: ({ title }: { title: string }) => <div data-testid="ai2-card">{title}</div>,
}));

jest.mock('@/features/public-site/components/peopleGrid', () => ({
  __esModule: true,
  default: ({ people }: { people: Array<{ name: string }> }) => (
    <div data-testid="people-grid">{people.length}</div>
  ),
}));

jest.mock('@/features/public-site/data/ai2', () => ({
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

import AI2Page from '@/app/(frontend)/ai2/page';

describe('AI2 Page', () => {
  it('switches the timeline data when another date is selected', () => {
    render(<AI2Page />);
    const timelineButtons = screen.getAllByRole('button').slice(-3);
    const timeline = screen.getByTestId('chrono');

    expect(timeline).toHaveAttribute('data-first-item', 'Finals');
    fireEvent.click(timelineButtons[0]);
    expect(timeline).toHaveAttribute('data-first-item', 'Kickoff Event');
    fireEvent.click(timelineButtons[1]);
    expect(timeline).toHaveAttribute('data-first-item', 'Dev');
  });
});
