import { render, screen, fireEvent } from '@testing-library/react';

const mockUseParams = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => mockUseParams(),
}));

jest.mock('@/assets/applicants.json', () => [
  {
    id: 'a1',
    name: 'Ada Lovelace',
    role: 'ML Engineer',
    interviewStatus: 'Pending',
    applicationStatus: 'Pending',
    email: 'ada@test.com',
    phone: '416-000-0000',
    school: 'UofT',
    major: 'CS',
    year: '3',
  },
  {
    id: 'a2',
    name: 'Bob Smith',
    role: 'Researcher',
    interviewStatus: 'Scheduled',
    applicationStatus: 'Waitlisted',
    email: 'bob@test.com',
    phone: '416-111-1111',
    school: 'York',
    major: 'Math',
    year: '4',
  },
]);

// The route's page.tsx is a server component that enforces the admin guard;
// these tests cover the client profile view it renders.
import ApplicantProfile from '@/features/recruitment/components/ApplicantProfileClient';

describe('Applicant Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the applicant\'s details when the id matches', () => {
    mockUseParams.mockReturnValue({ profile: 'a1' });
    render(<ApplicantProfile />);

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('ML Engineer')).toBeInTheDocument();
    expect(screen.getByText(/Interview Status: Pending/i)).toBeInTheDocument();
    expect(screen.getByText(/Application Status: Pending/i)).toBeInTheDocument();
    expect(screen.getByText('ada@test.com')).toBeInTheDocument();
  });

  it('shows a "not found" state when the id does not match any applicant', () => {
    mockUseParams.mockReturnValue({ profile: 'does-not-exist' });
    render(<ApplicantProfile />);
    expect(screen.getByText(/applicant not found/i)).toBeInTheDocument();
  });

  it('hides the schedule interview button once the interview is scheduled', () => {
    mockUseParams.mockReturnValue({ profile: 'a2' });
    render(<ApplicantProfile />);
    expect(
      screen.queryByRole('button', { name: /schedule interview/i })
    ).not.toBeInTheDocument();
  });

  it('updates the notes field when typed into', () => {
    mockUseParams.mockReturnValue({ profile: 'a1' });
    render(<ApplicantProfile />);

    const textarea = screen.getByPlaceholderText(/type your notes here/i) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Strong candidate' } });
    expect(textarea.value).toBe('Strong candidate');
  });

  it('renders the Back link to /applicants', () => {
    mockUseParams.mockReturnValue({ profile: 'a1' });
    render(<ApplicantProfile />);
    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/applicants');
  });
});
