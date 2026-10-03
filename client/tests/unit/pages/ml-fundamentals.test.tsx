import { render, fireEvent } from '@testing-library/react';

jest.mock('@/shared/ui/heroSection', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="hero">{title}</div>,
}));

jest.mock('@/features/public-site/components/peopleGrid', () => ({
  __esModule: true,
  default: ({ people }: { people: Array<{ name: string }> }) => (
    <div data-testid="people-grid">{people.length}</div>
  ),
}));

jest.mock('@/features/public-site/data/ml-fundamentals', () => ({
  programDirectors: [{ name: 'Director A' }],
  academicsTeam: [{ name: 'Academic A' }, { name: 'Academic B' }],
  techWritersTeam: [{ name: 'Writer A' }],
}));

import MLFundamentals from '@/app/(frontend)/ml-fundamentals/page';

describe('ML Fundamentals Page', () => {
  it('opens a workshop resource in a modal', () => {
    const { container } = render(<MLFundamentals />);
    const resourceButton = container.querySelector('button');

    expect(resourceButton).not.toBeNull();
    fireEvent.click(resourceButton!);
    expect(container.querySelector('iframe')).toBeInTheDocument();
  });
});
