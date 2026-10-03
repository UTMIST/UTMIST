import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockGetUpcoming = jest.fn();
const mockGetPast = jest.fn();
const mockGetFeatured = jest.fn();
const mockEvaluateFlag = jest.fn();

jest.mock('@/features/events/api/events', () => ({
  __esModule: true,
  getUpcomingEvents: () => mockGetUpcoming(),
  getPastEvents: () => mockGetPast(),
  getFeaturedEvents: () => mockGetFeatured(),
}));

jest.mock('@/features/events/components/event-item', () => ({
  EventItem: ({ event }: { event: { id: string; title: string } }) => (
    <div data-testid="event-item" data-event-id={event.id} />
  ),
}));

jest.mock('@/features/events/components/search-bar', () => ({
  SearchBar: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <input
      data-testid="search-bar"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

jest.mock('@/features/events/components/tag-filter', () => ({
  TagFilter: () => <div data-testid="tag-filter" />,
}));

jest.mock('@/features/events/components/event-card', () => ({
  EventCard: ({ title, branding }: { title: string; branding?: string }) => (
    <div data-testid="event-card" data-branding={branding} data-title={title} />
  ),
}));

jest.mock('@/shared/ui/heroSection', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="hero">{title}</div>,
}));

jest.mock('@/shared/lib/server', () => ({
  evaluateFlag: (...args: unknown[]) => mockEvaluateFlag(...args),
}));

import EventsPage from '@/app/(frontend)/events/page';

describe('Events Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEvaluateFlag.mockResolvedValue(false);
  });

  it.each([false, true])('keeps EigenAI branding when the redesign flag is %s', async (enabled) => {
    mockEvaluateFlag.mockResolvedValue(enabled);
    mockGetUpcoming.mockResolvedValue([
      { id: 'u1', title: 'Upcoming One', location: 'BA', description: 'd', tags: ['ml'] },
    ]);
    mockGetPast.mockResolvedValue([
      {
        id: 'p1',
        title: 'Past One',
        instructor: 'Jane',
        overview: 'o',
        learningGoals: ['g'],
        tags: ['nlp'],
      },
    ]);
    mockGetFeatured.mockResolvedValue([
      {
        title: 'Featured Hackathon',
        url: 'https://e.com',
        background: '#fff',
        branding: 'eigenai',
      },
    ]);

    render(<EventsPage />);

    await waitFor(() => expect(screen.getAllByTestId('event-item')).toHaveLength(2));
    expect(screen.getByTestId('event-card')).toHaveAttribute('data-branding', 'eigenai');
    expect(mockEvaluateFlag).not.toHaveBeenCalled();
  });

  it('filters upcoming events by search query', async () => {
    mockGetUpcoming.mockResolvedValue([
      { id: 'u1', title: 'Workshop A', location: 'X', description: 'd', tags: [] },
      { id: 'u2', title: 'Hackathon B', location: 'Y', description: 'd', tags: [] },
    ]);
    mockGetPast.mockResolvedValue([]);
    mockGetFeatured.mockResolvedValue([]);

    render(<EventsPage />);
    await waitFor(() => expect(screen.getAllByTestId('event-item')).toHaveLength(2));

    const searchBars = screen.getAllByTestId('search-bar');
    fireEvent.change(searchBars[0], { target: { value: 'hackathon' } });

    await waitFor(() => {
      const items = screen.getAllByTestId('event-item');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveAttribute('data-event-id', 'u2');
    });
  });
});
