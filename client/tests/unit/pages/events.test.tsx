import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockGetUpcoming = jest.fn();
const mockGetPast = jest.fn();
const mockGetFeatured = jest.fn();

jest.mock('@/features/events/api/events', () => ({
  __esModule: true,
  getUpcomingEvents: () => mockGetUpcoming(),
  getPastEvents: () => mockGetPast(),
  getFeaturedEvents: () => mockGetFeatured(),
}));

jest.mock('@/features/events/components/event-item', () => ({
  EventItem: ({ event }: { event: { id: string; title: string } }) => (
    <div data-testid="event-item">{event.title}</div>
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
  EventCard: ({ title }: { title: string }) => <div data-testid="event-card">{title}</div>,
}));

jest.mock('@/shared/ui/heroSection', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="hero">{title}</div>,
}));

import EventsPage from '@/app/events/page';

describe('Events Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays the loading state while events are being fetched', () => {
    mockGetUpcoming.mockImplementation(() => new Promise(() => {}));
    mockGetPast.mockImplementation(() => new Promise(() => {}));
    mockGetFeatured.mockImplementation(() => new Promise(() => {}));
    render(<EventsPage />);
    expect(screen.getByText(/loading events/i)).toBeInTheDocument();
  });

  it('renders upcoming, past, and featured events after loading', async () => {
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
      { title: 'Featured Hackathon', url: 'https://e.com', background: '#fff' },
    ]);

    render(<EventsPage />);

    expect(await screen.findByText('Upcoming One')).toBeInTheDocument();
    expect(screen.getByText('Past One')).toBeInTheDocument();
    expect(screen.getByText('Featured Hackathon')).toBeInTheDocument();
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
      expect(items[0]).toHaveTextContent('Hackathon B');
    });
  });

  it('shows a placeholder message when there are no upcoming events', async () => {
    mockGetUpcoming.mockResolvedValue([]);
    mockGetPast.mockResolvedValue([]);
    mockGetFeatured.mockResolvedValue([]);

    render(<EventsPage />);
    expect(await screen.findByText(/more events are in the works/i)).toBeInTheDocument();
  });
});
