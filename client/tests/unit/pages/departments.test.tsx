import { render, screen } from '@testing-library/react';

jest.mock('@/components/memberList', () => ({
  PersonCard: ({ name, bio, email }: { name: string; bio: string; email: string }) => (
    <div data-testid="person-card">
      <h3>{name}</h3>
      <p>{bio}</p>
      <a href={`mailto:${email}`}>{email}</a>
    </div>
  ),
}));

import DepartmentsPage from '@/app/departments/page';

describe('Departments Page', () => {
  it('renders a PersonCard with the expected props', () => {
    render(<DepartmentsPage />);
    expect(screen.getByTestId('person-card')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ambrose Ling' })).toBeInTheDocument();
    expect(screen.getByText(/space it can hold/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'myEmail@mail.com' })).toHaveAttribute(
      'href',
      'mailto:myEmail@mail.com'
    );
  });
});
