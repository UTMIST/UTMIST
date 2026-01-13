/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

// Mock the Supabase client module before importing (using relative path since @ alias may not resolve in mocks)
jest.mock('../../../src/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Import after mocking (can use @ alias for imports)
import { GET } from '@/app/api/applicants/route';
import { createClient } from '@/lib/supabase/server';

// Mock Next.js headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => []),
    set: jest.fn(),
  })),
}));

describe('GET /api/applicants', () => {
  let mockSupabaseClient: any;
  let mockRequest: NextRequest;
  let mockApplicantsQuery: any;
  let mockJobsQuery: any;
  let mockUsersQuery: any;

  // Helper to create a query builder
  const createQueryBuilder = () => {
    const builder: any = {
      select: jest.fn(function() { return this; }),
      eq: jest.fn(function() { return this; }),
      ilike: jest.fn(),
      in: jest.fn(function() { return this; }), // in() should return builder for chaining
      range: jest.fn(function() { return this; }),
      order: jest.fn(),
    };
    return builder;
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create separate query builders for different tables
    mockApplicantsQuery = createQueryBuilder();
    mockJobsQuery = createQueryBuilder();
    mockUsersQuery = createQueryBuilder();

    // Create a mock Supabase client that returns different query builders based on table
    mockSupabaseClient = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn((table: string) => {
        if (table === 'Applicants') return mockApplicantsQuery;
        if (table === 'Jobs') return mockJobsQuery;
        if (table === 'user') return mockUsersQuery;
        return createQueryBuilder();
      }),
    };

    // Mock createClient to return our mock client
    (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);

    // Create a mock NextRequest
    mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    } as unknown as NextRequest;
  });

  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('should return 401 when getUser returns an error', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'JWT expired' },
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should proceed when user is authenticated', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock successful query with empty results - order() is the final method
      mockApplicantsQuery.order.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('Applicants');
    });
  });

  describe('Filtering by jobID', () => {
    it('should filter applicants by exact jobID', async () => {
      const mockUser = { id: 'user-123' };
      const jobID = 'job-uuid-123';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockApplicants = [
        {
          id: 'app-1',
          jobID: jobID,
          userID: 'user-1',
          interview_status: 'PENDING',
          acceptance_status: 'PENDING',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      mockApplicantsQuery.order.mockResolvedValue({
        data: mockApplicants,
        error: null,
        count: 1,
      });

      // Mock job and user lookups
      mockJobsQuery.in.mockResolvedValue({
        data: [{ id: jobID, job_title: 'Software Engineer', description: 'Test job' }],
        error: null,
      });

      mockUsersQuery.in.mockResolvedValue({
        data: [{ id: 'user-1', email: 'applicant@example.com', name: 'John Doe' }],
        error: null,
      });

      mockRequest.nextUrl.searchParams.set('jobID', jobID);

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockApplicantsQuery.eq).toHaveBeenCalledWith('jobID', jobID);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].jobID).toBe(jobID);
    });
  });

  describe('Filtering by role (job_title search)', () => {
    it('should filter applicants by role using case-insensitive partial match', async () => {
      const mockUser = { id: 'user-123' };
      const role = 'Engineer';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock job search by role
      const matchingJobIds = ['job-1', 'job-2'];
      // The select().ilike() chain: select returns builder, ilike returns promise
      // Ensure select returns the builder so ilike can be chained
      mockJobsQuery.select.mockImplementation(function(this: any) { return this; });
      mockJobsQuery.ilike.mockResolvedValue({
        data: [
          { id: 'job-1' },
          { id: 'job-2' },
        ],
        error: null,
      });

      const mockApplicants = [
        {
          id: 'app-1',
          jobID: 'job-1',
          userID: 'user-1',
          interview_status: 'PENDING',
          acceptance_status: 'PENDING',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      mockApplicantsQuery.order.mockResolvedValue({
        data: mockApplicants,
        error: null,
        count: 1,
      });

      mockJobsQuery.in.mockResolvedValue({
        data: [{ id: 'job-1', job_title: 'Software Engineer', description: 'Test' }],
        error: null,
      });

      mockUsersQuery.in.mockResolvedValue({
        data: [{ id: 'user-1', email: 'applicant@example.com', name: 'John Doe' }],
        error: null,
      });

      mockRequest.nextUrl.searchParams.set('role', role);

      const response = await GET(mockRequest);
      const data = await response.json();


      expect(response.status).toBe(200);
      expect(mockJobsQuery.ilike).toHaveBeenCalledWith('job_title', `%${role}%`);
      expect(mockApplicantsQuery.in).toHaveBeenCalledWith('jobID', matchingJobIds);
    });

    it('should return empty results when no jobs match the role', async () => {
      const mockUser = { id: 'user-123' };
      const role = 'NonExistentRole';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockJobsQuery.ilike.mockResolvedValue({
        data: [],
        error: null,
      });

      mockRequest.nextUrl.searchParams.set('role', role);

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
      expect(data.pagination.total).toBe(0);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('Jobs'); // Only Jobs search, no Applicants query
    });

    it('should handle errors when searching for jobs by role', async () => {
      const mockUser = { id: 'user-123' };
      const role = 'Engineer';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockJobsQuery.ilike.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      mockRequest.nextUrl.searchParams.set('role', role);

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to filter by role');
      expect(data.details).toBe('Database error');
    });
  });

  describe('Filtering by interviewStatus', () => {
    it('should filter applicants by interview_status (uppercase)', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockApplicants = [
        {
          id: 'app-1',
          jobID: 'job-1',
          userID: 'user-1',
          interview_status: 'ACCEPTED',
          acceptance_status: 'PENDING',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      mockApplicantsQuery.order.mockResolvedValue({
        data: mockApplicants,
        error: null,
        count: 1,
      });

      mockJobsQuery.in.mockResolvedValue({
        data: [{ id: 'job-1', job_title: 'Engineer', description: 'Test' }],
        error: null,
      });

      mockUsersQuery.in.mockResolvedValue({
        data: [{ id: 'user-1', email: 'test@example.com', name: 'John' }],
        error: null,
      });

      mockRequest.nextUrl.searchParams.set('interviewStatus', 'accepted');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockApplicantsQuery.eq).toHaveBeenCalledWith('interview_status', 'ACCEPTED');
      expect(data.data[0].interview_status).toBe('ACCEPTED');
    });

    it('should normalize lowercase interviewStatus to uppercase', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockApplicantsQuery.order.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      mockRequest.nextUrl.searchParams.set('interviewStatus', 'pending');

      await GET(mockRequest);

      expect(mockApplicantsQuery.eq).toHaveBeenCalledWith('interview_status', 'PENDING');
    });
  });

  describe('Filtering by acceptanceStatus', () => {
    it('should filter applicants by acceptance_status', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockApplicants = [
        {
          id: 'app-1',
          jobID: 'job-1',
          userID: 'user-1',
          interview_status: 'PENDING',
          acceptance_status: 'ACCEPTED',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      mockApplicantsQuery.order.mockResolvedValue({
        data: mockApplicants,
        error: null,
        count: 1,
      });

      mockJobsQuery.in.mockResolvedValue({
        data: [{ id: 'job-1', job_title: 'Engineer', description: 'Test' }],
        error: null,
      });

      mockUsersQuery.in.mockResolvedValue({
        data: [{ id: 'user-1', email: 'test@example.com', name: 'John' }],
        error: null,
      });

      mockRequest.nextUrl.searchParams.set('acceptanceStatus', 'ACCEPTED');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockApplicantsQuery.eq).toHaveBeenCalledWith('acceptance_status', 'ACCEPTED');
      expect(data.data[0].acceptance_status).toBe('ACCEPTED');
    });
  });

  describe('Pagination', () => {
    it('should apply default pagination (page 1, limit 20)', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockApplicantsQuery.order.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      await GET(mockRequest);

      expect(mockApplicantsQuery.range).toHaveBeenCalledWith(0, 19);
    });

    it('should apply custom pagination parameters', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockApplicantsQuery.order.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      mockRequest.nextUrl.searchParams.set('page', '2');
      mockRequest.nextUrl.searchParams.set('limit', '10');

      await GET(mockRequest);

      expect(mockApplicantsQuery.range).toHaveBeenCalledWith(10, 19);
    });

    it('should enforce maximum limit of 100', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockApplicantsQuery.order.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      mockRequest.nextUrl.searchParams.set('limit', '200');

      await GET(mockRequest);

      expect(mockApplicantsQuery.range).toHaveBeenCalledWith(0, 99);
    });

    it('should return correct pagination metadata', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockApplicants = Array.from({ length: 5 }, (_, i) => ({
        id: `app-${i}`,
        jobID: 'job-1',
        userID: 'user-1',
        interview_status: 'PENDING',
        acceptance_status: 'PENDING',
        created_at: '2024-01-01T00:00:00Z',
      }));

      mockApplicantsQuery.order.mockResolvedValue({
        data: mockApplicants,
        error: null,
        count: 25, // Total count
      });

      mockJobsQuery.in.mockResolvedValue({ data: [], error: null });
      mockUsersQuery.in.mockResolvedValue({ data: [], error: null });

      mockRequest.nextUrl.searchParams.set('page', '1');
      mockRequest.nextUrl.searchParams.set('limit', '10');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3, // Math.ceil(25/10)
      });
    });
  });

  describe('Ordering', () => {
    it('should order results by created_at descending', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockApplicantsQuery.order.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      await GET(mockRequest);

      expect(mockApplicantsQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });
  });

  describe('Data enrichment with Jobs and Users', () => {
    it('should enrich applicants with job and user data', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockApplicants = [
        {
          id: 'app-1',
          jobID: 'job-1',
          userID: 'user-1',
          interview_status: 'PENDING',
          acceptance_status: 'PENDING',
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'app-2',
          jobID: 'job-2',
          userID: 'user-2',
          interview_status: 'ACCEPTED',
          acceptance_status: 'PENDING',
          created_at: '2024-01-02T00:00:00Z',
        },
      ];

      const mockJobs = [
        { id: 'job-1', job_title: 'Software Engineer', description: 'Build apps' },
        { id: 'job-2', job_title: 'Data Scientist', description: 'Analyze data' },
      ];

      const mockUsers = [
        { id: 'user-1', email: 'john@example.com', name: 'John Doe' },
        { id: 'user-2', email: 'jane@example.com', name: 'Jane Smith' },
      ];

      mockApplicantsQuery.order.mockResolvedValue({
        data: mockApplicants,
        error: null,
        count: 2,
      });

      mockJobsQuery.in.mockResolvedValue({
        data: mockJobs,
        error: null,
      });

      mockUsersQuery.in.mockResolvedValue({
        data: mockUsers,
        error: null,
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.data[0].jobs).toEqual(mockJobs[0]);
      expect(data.data[0].user).toEqual({ email: 'john@example.com', name: 'John Doe' });
      expect(data.data[1].jobs).toEqual(mockJobs[1]);
      expect(data.data[1].user).toEqual({ email: 'jane@example.com', name: 'Jane Smith' });
    });

    it('should handle missing job or user data gracefully', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockApplicants = [
        {
          id: 'app-1',
          jobID: 'job-1',
          userID: 'user-1',
          interview_status: 'PENDING',
          acceptance_status: 'PENDING',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      mockApplicantsQuery.order.mockResolvedValue({
        data: mockApplicants,
        error: null,
        count: 1,
      });

      // Jobs lookup returns empty, Users lookup returns data
      mockJobsQuery.in.mockResolvedValue({
        data: [],
        error: null,
      });

      mockUsersQuery.in.mockResolvedValue({
        data: [{ id: 'user-1', email: 'test@example.com', name: 'John' }],
        error: null,
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data[0].jobs).toBeNull();
      expect(data.data[0].user).toEqual({ email: 'test@example.com', name: 'John' });
    });

    it('should handle errors in job/user lookups gracefully', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockApplicants = [
        {
          id: 'app-1',
          jobID: 'job-1',
          userID: 'user-1',
          interview_status: 'PENDING',
          acceptance_status: 'PENDING',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      mockApplicantsQuery.order.mockResolvedValue({
        data: mockApplicants,
        error: null,
        count: 1,
      });

      // Jobs lookup returns error, Users lookup succeeds
      mockJobsQuery.in.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      mockUsersQuery.in.mockResolvedValue({
        data: [{ id: 'user-1', email: 'test@example.com', name: 'John' }],
        error: null,
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      // Should still return 200, but with null job data
      expect(response.status).toBe(200);
      expect(data.data[0].jobs).toBeNull();
      expect(data.data[0].user).toBeDefined();
    });
  });

  describe('Empty results', () => {
    it('should return empty array when no applicants found', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockApplicantsQuery.order.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
      expect(data.pagination.total).toBe(0);
      expect(data.pagination.totalPages).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should handle database errors when fetching applicants', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockApplicantsQuery.order.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
        count: null,
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch applicants');
      expect(data.details).toBe('Database connection failed');
    });

    it('should handle unexpected errors', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Simulate an unexpected error (e.g., null reference)
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('Combined filters', () => {
    it('should apply multiple filters simultaneously', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockApplicants = [
        {
          id: 'app-1',
          jobID: 'job-1',
          userID: 'user-1',
          interview_status: 'ACCEPTED',
          acceptance_status: 'PENDING',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      mockApplicantsQuery.order.mockResolvedValue({
        data: mockApplicants,
        error: null,
        count: 1,
      });

      mockJobsQuery.in.mockResolvedValue({
        data: [{ id: 'job-1', job_title: 'Engineer', description: 'Test' }],
        error: null,
      });

      mockUsersQuery.in.mockResolvedValue({
        data: [{ id: 'user-1', email: 'test@example.com', name: 'John' }],
        error: null,
      });

      mockRequest.nextUrl.searchParams.set('interviewStatus', 'ACCEPTED');
      mockRequest.nextUrl.searchParams.set('acceptanceStatus', 'PENDING');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      // Verify both filters were applied
      expect(mockApplicantsQuery.eq).toHaveBeenCalledWith('interview_status', 'ACCEPTED');
      expect(mockApplicantsQuery.eq).toHaveBeenCalledWith('acceptance_status', 'PENDING');
      expect(data.data[0].interview_status).toBe('ACCEPTED');
      expect(data.data[0].acceptance_status).toBe('PENDING');
    });

    it('should prioritize jobID over role when both are provided', async () => {
      const mockUser = { id: 'user-123' };
      const jobID = 'specific-job-id';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockApplicantsQuery.order.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      mockJobsQuery.in.mockResolvedValue({ data: [], error: null });
      mockUsersQuery.in.mockResolvedValue({ data: [], error: null });

      mockRequest.nextUrl.searchParams.set('jobID', jobID);
      mockRequest.nextUrl.searchParams.set('role', 'Engineer');

      await GET(mockRequest);

      // Should use jobID directly, not search by role
      expect(mockJobsQuery.ilike).not.toHaveBeenCalled();
      expect(mockApplicantsQuery.eq).toHaveBeenCalledWith('jobID', jobID);
    });
  });
});
