import { render } from '@testing-library/react';

jest.mock('@/assets/careers.json', () => [
  {
    title: 'Software Engineer',
    department: 'Engineering',
    division: 'AI',
    applicationLink: 'https://apply.example.com/1',
  },
  {
    title: 'ML Researcher',
    department: 'Research',
    division: '',
    applicationLink: 'https://apply.example.com/2',
  },
]);

import CareersPage from '@/app/(frontend)/careers/page';

describe('Careers Page', () => {
  it('links each position to its application URL', () => {
    const { container } = render(<CareersPage />);
    const applyLinks = container.querySelectorAll('a[href^="https://apply.example.com/"]');

    expect(applyLinks).toHaveLength(2);
    expect(applyLinks[0]).toHaveAttribute('href', 'https://apply.example.com/1');
    expect(applyLinks[0]).toHaveAttribute('target', '_blank');
    expect(applyLinks[1]).toHaveAttribute('href', 'https://apply.example.com/2');
  });
});
