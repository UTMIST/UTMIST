import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@/components/admin/ApplicantRow', () => ({
  __esModule: true,
  default: ({ applicant }: { applicant: { id: string; name: string } }) => (
    <tr data-testid="applicant-row">
      <td>{applicant.name}</td>
    </tr>
  ),
}));

// The route's page.tsx is a server component that enforces the admin guard;
// these tests cover the client dashboard it renders.
import ApplicantsDashboard from '@/app/applicants/ApplicantsPageClient';

describe('Applicants Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the empty state when the API returns no applications', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ applications: [], totalPages: 1, page: 1 }),
    });

    render(<ApplicantsDashboard />);
    expect(await screen.findByText(/no applications found/i)).toBeInTheDocument();
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
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('passes name and role search params to the API on Apply Filters', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ applications: [], totalPages: 1, page: 1 }),
    });
    (global.fetch as jest.Mock) = fetchMock;

    render(<ApplicantsDashboard />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    fireEvent.change(screen.getByLabelText(/search name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/search role/i), { target: { value: 'Dev' } });
    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));

    await waitFor(() => {
      const lastCall = fetchMock.mock.calls.at(-1)?.[0] as string;
      expect(lastCall).toContain('name=Alice');
      expect(lastCall).toContain('role=Dev');
    });
  });

  it('shows an error message when the API request fails', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    render(<ApplicantsDashboard />);
    expect(await screen.findByText(/api error: 500/i)).toBeInTheDocument();
  });

  it('disables the Previous button on the first page', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ applications: [], totalPages: 3, page: 1 }),
    });
    render(<ApplicantsDashboard />);

    const prev = await screen.findByRole('button', { name: /previous/i });
    expect(prev).toBeDisabled();
  });
});
