import { render } from '@testing-library/react';

const syntheticImpact = {
  heading: 'Synthetic intro',
  statistics: [{ number: '7+', description: 'Synthetic statistic' }],
};

const mockRedesignEnabled = jest.fn();
jest.mock('@/features/public-site/lib/hero-light-renderer', () => ({
  ...jest.requireActual('@/features/public-site/lib/hero-light-renderer'),
  createHeroLightRenderer: () => null,
}));
jest.mock('@/shared/lib/server', () => ({
  isWebRedesignEnabled: () => mockRedesignEnabled(),
}));

const mockReadHomeImpact = jest.fn();
const mockImpact = jest.fn();
jest.mock('@/features/public-site/lib/home-impact', () => ({
  readHomeImpact: () => mockReadHomeImpact(),
}));
jest.mock('@/features/public-site/components/organization-impact', () => ({
  __esModule: true,
  default: (props: unknown) => {
    mockImpact(props);
    return <div data-testid="impact" />;
  },
}));

jest.mock('@/features/public-site/components/sponsors', () => ({
  __esModule: true,
  default: () => <div data-testid="sponsors" />,
}));

jest.mock('@/features/public-site/components/events', () => ({
  __esModule: true,
  default: () => <div data-testid="events" />,
}));

jest.mock('@/features/public-site/components/valueprops', () => ({
  __esModule: true,
  default: () => <div data-testid="valueprops" />,
}));

jest.mock('@/features/public-site/components/startupsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="startups-section" />,
}));

jest.mock('@/features/public-site/components/faq', () => ({
  __esModule: true,
  default: () => <div data-testid="faq" />,
}));

import Home from '@/app/(frontend)/page';

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReadHomeImpact.mockResolvedValue(syntheticImpact);
    mockRedesignEnabled.mockResolvedValue(false);
  });

  it('links its calls to action to their destinations', async () => {
    const { container } = render(await Home());

    expect(container.querySelector('a[href="/careers"]')).toBeInTheDocument();
    expect(container.querySelector('a[href^="mailto:"]')).toBeInTheDocument();
  });

  it('selects the redesigned page and keeps existing destinations when enabled', async () => {
    mockRedesignEnabled.mockResolvedValue(true);
    const { container, getByText } = render(await Home());
    expect(container.querySelector('[data-homepage="redesign"]')).toBeInTheDocument();
    expect(getByText(syntheticImpact.heading)).toBeInTheDocument();
    expect(container.querySelector('a[href="/careers"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="mailto:utorontomist@gmail.com"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/startups"]')).toBeInTheDocument();
    expect(mockImpact).not.toHaveBeenCalled();
    expect(mockReadHomeImpact).toHaveBeenCalledTimes(1);
  });

  it('keeps the legacy page when the flag is off', async () => {
    const { container } = render(await Home());
    expect(container.querySelector('[data-homepage="redesign"]')).not.toBeInTheDocument();
    expect(mockImpact).toHaveBeenCalledWith({ content: syntheticImpact });
  });

  it('passes the content reader result to the reusable impact section', async () => {
    const edited = { heading: 'Synthetic changed intro', statistics: [{ number: '7+', description: 'Synthetic stat' }] };
    mockReadHomeImpact.mockResolvedValue(edited);
    render(await Home());
    expect(mockImpact).toHaveBeenCalledWith({ content: edited });
  });
});
