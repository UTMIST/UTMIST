import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const samplePost = (id: number, overrides = {}) => ({
  title: `Blog ${id}`,
  date: '2024-01-01',
  description: 'desc',
  image: '/img.png',
  href: `/blog/${id}`,
  ...overrides,
});

const mockGetFeatured = jest.fn();
const mockGetRecent = jest.fn();
const mockGetArchive = jest.fn();

jest.mock('@/app/blog/api/blog', () => ({
  __esModule: true,
  getFeaturedPosts: () => mockGetFeatured(),
  getRecentPosts: () => mockGetRecent(),
  getArchivePosts: () => mockGetArchive(),
}));

jest.mock('@/components/cards/blog-card-large', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="blog-large">{title}</div>,
}));

jest.mock('@/components/cards/blog-card-small', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="blog-small">{title}</div>,
}));

jest.mock('@/components/cards/blog-list-item', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="blog-list-item">{title}</div>,
}));

jest.mock('@/components/heroSection', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="hero">{title}</div>,
}));

import BlogPage from '@/app/blog/page';

describe('Blog Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the loading indicator before posts load', () => {
    mockGetFeatured.mockImplementation(() => new Promise(() => {}));
    mockGetRecent.mockImplementation(() => new Promise(() => {}));
    mockGetArchive.mockImplementation(() => new Promise(() => {}));
    render(<BlogPage />);
    expect(screen.getByText(/loading blog content/i)).toBeInTheDocument();
  });

  it('renders featured, recent, and archive posts after they load', async () => {
    mockGetFeatured.mockResolvedValue([samplePost(1), samplePost(2), samplePost(3)]);
    mockGetRecent.mockResolvedValue([samplePost(4)]);
    mockGetArchive.mockResolvedValue([samplePost(5), samplePost(6)]);

    render(<BlogPage />);

    expect(await screen.findByTestId('blog-large')).toHaveTextContent('Blog 1');
    expect(screen.getAllByTestId('blog-small').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('blog-list-item').length).toBe(2);
  });

  it('filters archive results based on the search input', async () => {
    mockGetFeatured.mockResolvedValue([]);
    mockGetRecent.mockResolvedValue([]);
    mockGetArchive.mockResolvedValue([
      samplePost(1, { title: 'Intro to ML' }),
      samplePost(2, { title: 'Deep Learning' }),
    ]);

    render(<BlogPage />);

    await waitFor(() =>
      expect(screen.getAllByTestId('blog-list-item').length).toBe(2)
    );

    fireEvent.change(screen.getByPlaceholderText(/search articles/i), {
      target: { value: 'deep' },
    });

    await waitFor(() => {
      const items = screen.getAllByTestId('blog-list-item');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent('Deep Learning');
    });
  });

  it('shows a fallback message when no archive items match the search', async () => {
    mockGetFeatured.mockResolvedValue([]);
    mockGetRecent.mockResolvedValue([]);
    mockGetArchive.mockResolvedValue([samplePost(1, { title: 'Intro' })]);

    render(<BlogPage />);

    await waitFor(() => expect(screen.getAllByTestId('blog-list-item')).toHaveLength(1));

    fireEvent.change(screen.getByPlaceholderText(/search articles/i), {
      target: { value: 'nothing-matches' },
    });
    expect(await screen.findByText(/no articles found/i)).toBeInTheDocument();
  });
});
