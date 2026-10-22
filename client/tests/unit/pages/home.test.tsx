import { render } from '@testing-library/react';

const syntheticImpact = {
  heading: 'Synthetic intro',
  statistics: [{ number: '7+', description: 'Synthetic statistic' }],
};

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
  });

  it('links its calls to action to their destinations', async () => {
    const { container } = render(await Home());

    expect(container.querySelector('a[href="/careers"]')).toBeInTheDocument();
    expect(container.querySelector('a[href^="mailto:"]')).toBeInTheDocument();
  });

  it('passes the content reader result to the reusable impact section', async () => {
    const edited = { heading: 'Synthetic changed intro', statistics: [{ number: '7+', description: 'Synthetic stat' }] };
    mockReadHomeImpact.mockResolvedValue(edited);
    render(await Home());
    expect(mockImpact).toHaveBeenCalledWith({ content: edited });
  });
});
