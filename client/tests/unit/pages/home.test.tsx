import { render } from '@testing-library/react';

jest.mock('@/features/public-site/components/sponsors', () => ({
  __esModule: true,
  default: () => <div data-testid="sponsors" />,
}));

jest.mock('@/features/public-site/components/stats', () => ({
  __esModule: true,
  default: () => <div data-testid="stats" />,
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
  it('links its calls to action to their destinations', () => {
    const { container } = render(<Home />);

    expect(container.querySelector('a[href="/careers"]')).toBeInTheDocument();
    expect(container.querySelector('a[href^="mailto:"]')).toBeInTheDocument();
  });
});
