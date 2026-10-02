import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@/features/recruitment/components/ApplicantRow', () => ({
  __esModule: true,
  default: ({ applicant }: { applicant: { id: string; name: string } }) => (
    <tr data-testid="applicant-row">
      <td>{applicant.name}</td>
    </tr>
  ),
}));

// The route's page.tsx is a server component that enforces the admin guard;
// these tests cover the client dashboard it renders.
import ApplicantsDashboard from '@/features/recruitment/components/ApplicantsPageClient';

describe('Applicants Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders applicant rows for each result returned', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        applications: [
          { id: '1', name: 'Alice', interviewStatus: 'Pending' },
          { id: '2', name: 'Bob', interviewStatus: 'Scheduled' },
        ],
        totalPages: 1,
        page: 1,
      }),
    });

    render(<ApplicantsDashboard />);
    await waitFor(() => expect(screen.getAllByTestId('applicant-row')).toHaveLength(2));
  });

  it('passes name and role search params to the API on Apply Filters', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ applications: [], totalPages: 1, page: 1 }),
    });
    (global.fetch as jest.Mock) = fetchMock;

    const { container } = render(<ApplicantsDashboard />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    fireEvent.change(container.querySelector('#nameSearch')!, { target: { value: 'Alice' } });
    fireEvent.change(container.querySelector('#roleSearch')!, { target: { value: 'Dev' } });
    fireEvent.click(container.querySelector('button')!);

    await waitFor(() => {
      const lastCall = fetchMock.mock.calls.at(-1)?.[0] as string;
      expect(lastCall).toContain('name=Alice');
      expect(lastCall).toContain('role=Dev');
    });
  });

  it('disables the Previous button on the first page', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ applications: [], totalPages: 3, page: 1 }),
    });
    const { container } = render(<ApplicantsDashboard />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const paginationButtons = container.querySelectorAll('table + div button');
    const prev = paginationButtons[0];
    expect(prev).toBeDisabled();
  });
});
