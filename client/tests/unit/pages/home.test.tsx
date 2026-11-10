import { homePageContent } from "@/features/public-site/data/home-page";
import { render } from '@testing-library/react';

const syntheticImpact = {
  heading: 'Synthetic intro',
  statistics: [{ number: '7+', description: 'Synthetic statistic' }],
};

const mockRedesignEnabled = jest.fn();
jest.mock('@/features/public-site/lib/hero-light-renderer', () => ({
  createHeroLightRenderer: () => null,
}));
jest.mock('@/shared/lib/server', () => ({
  isWebRedesignEnabled: () => mockRedesignEnabled(),
}));

const mockReadHomeImpact = jest.fn();
const mockReadHomePage = jest.fn();
jest.mock("@/features/public-site/lib/home-page", () => ({ readHomePage: () => mockReadHomePage() }));
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
    mockReadHomePage.mockResolvedValue({ ...homePageContent, impact: syntheticImpact });
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
    expect(mockReadHomePage).toHaveBeenCalledTimes(1);
  });

  it('renders edited page sections, destinations, and asset-independent alt text', async () => {
    mockRedesignEnabled.mockResolvedValue(true);
    const edited: typeof homePageContent = JSON.parse(JSON.stringify(homePageContent));
    edited.hero.heading = 'Synthetic CMS title';
    edited.hero.links = [{ label: 'Synthetic CTA', href: '/projects' }];
    edited.about.caption = 'Synthetic photo caption';
    edited.mission.description = 'Synthetic mission';
    edited.sponsors.items[0].alt = 'Accessible name edited in CMS';
    edited.events.items[0].title = 'Synthetic event';
    edited.events.communityStatement = 'Synthetic community';
    edited.startups.benefits[0].description = 'Synthetic benefit';
    edited.faq.items[0].answer = 'Synthetic answer';
    mockReadHomePage.mockResolvedValue(edited);
    const { getByText, getByRole, getByAltText } = render(await Home());
    expect(getByRole('heading', { name: 'Synthetic CMS title' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Synthetic CTA' })).toHaveAttribute('href', '/projects');
    for (const copy of ['Synthetic photo caption', 'Synthetic mission', 'Synthetic event', 'Synthetic community', 'Synthetic benefit', 'Synthetic answer']) {
      expect(getByText(copy)).toBeInTheDocument();
    }
    expect(getByAltText('Accessible name edited in CMS')).toBeInTheDocument();
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
