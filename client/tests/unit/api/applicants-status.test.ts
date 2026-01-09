/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { PATCH } from '../../../src/app/api/applicants/[id]/status/route';

// Mock the Supabase client module (using relative path since @ alias may not resolve in mocks)
jest.mock('../../../src/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Mock Next.js headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => []),
    set: jest.fn(),
  })),
}));

import { createClient } from '../../../src/lib/supabase/server';

describe('PATCH /api/applicants/:id/status', () => {
  let mockSupabaseClient: any;
  let mockRequest: NextRequest;
  let mockUpdateQuery: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create a mock query builder for update operations
    mockUpdateQuery = {
      eq: jest.fn(function(this: any) { return this; }),
      select: jest.fn(function(this: any) { return this; }),
      single: jest.fn(),
    };

    // Create a mock update function that returns the query builder
    const mockUpdate = jest.fn(() => mockUpdateQuery);

    // Create a mock Supabase client
    mockSupabaseClient = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(() => ({
        update: mockUpdate,
      })),
    };

    // Mock createClient to return our mock client
    (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);

    // Create a mock NextRequest
    mockRequest = {
      json: jest.fn(),
    } as unknown as NextRequest;
  });

  describe('Request validation', () => {
    it('should return 400 for invalid status', async () => {
      const mockUser = { id: 'user-123' };
      const invalidStatus = 'invalid-status';
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (mockRequest.json as jest.Mock).mockResolvedValue({
        status: invalidStatus,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Invalid status');
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('should return 400 for missing status', async () => {
      const mockUser = { id: 'user-123' };
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (mockRequest.json as jest.Mock).mockResolvedValue({});

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Invalid status');
    });

    it('should return 400 for invalid UUID format', async () => {
      const mockUser = { id: 'user-123' };
      const invalidId = 'not-a-uuid';
      const validStatus = 'accepted';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (mockRequest.json as jest.Mock).mockResolvedValue({
        status: validStatus,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: invalidId }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Invalid applicant ID');
      expect(data.message).toContain('UUID');
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('should return 400 for empty ID', async () => {
      const mockUser = { id: 'user-123' };
      const validStatus = 'accepted';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (mockRequest.json as jest.Mock).mockResolvedValue({
        status: validStatus,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: '' }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const validStatus = 'accepted';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      (mockRequest.json as jest.Mock).mockResolvedValue({
        status: validStatus,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Authentication required');
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('should return 401 when getUser returns an error', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const validStatus = 'accepted';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'JWT expired' },
      });

      (mockRequest.json as jest.Mock).mockResolvedValue({
        status: validStatus,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Authentication required');
    });

    it('should proceed when user is authenticated', async () => {
      const mockUser = { id: 'user-123' };
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const validStatus = 'accepted';

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (mockRequest.json as jest.Mock).mockResolvedValue({
        status: validStatus,
      });

      const mockUpdatedApplicant = {
        id: validUUID,
        acceptance_status: 'ACCEPTED',
        userID: 'user-456',
        jobID: 'job-123',
      };

      mockUpdateQuery.single.mockResolvedValue({
        data: mockUpdatedApplicant,
        error: null,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.status).toBe(validStatus);
      expect(data.applicantId).toBe(validUUID);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('Applicants');
    });
  });

  describe('Status updates', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    const mockUser = { id: 'user-123' };

    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
    });

    it('should successfully update status to accepted', async () => {
      const status = 'accepted';
      const mockUpdatedApplicant = {
        id: validUUID,
        acceptance_status: 'ACCEPTED',
        userID: 'user-456',
        jobID: 'job-123',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue({ status });
      mockUpdateQuery.single.mockResolvedValue({
        data: mockUpdatedApplicant,
        error: null,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.status).toBe(status);
      expect(mockUpdateQuery.eq).toHaveBeenCalledWith('id', validUUID);
      expect(mockUpdateQuery.select).toHaveBeenCalled();
      expect(mockUpdateQuery.single).toHaveBeenCalled();
    });

    it('should successfully update status to rejected', async () => {
      const status = 'rejected';
      const mockUpdatedApplicant = {
        id: validUUID,
        acceptance_status: 'REJECTED',
        userID: 'user-456',
        jobID: 'job-123',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue({ status });
      mockUpdateQuery.single.mockResolvedValue({
        data: mockUpdatedApplicant,
        error: null,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.status).toBe(status);
    });

    it('should successfully update status to waitlisted', async () => {
      const status = 'waitlisted';
      const mockUpdatedApplicant = {
        id: validUUID,
        acceptance_status: 'WAITLISTED',
        userID: 'user-456',
        jobID: 'job-123',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue({ status });
      mockUpdateQuery.single.mockResolvedValue({
        data: mockUpdatedApplicant,
        error: null,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.status).toBe(status);
    });

    it('should successfully update status to pending', async () => {
      const status = 'pending';
      const mockUpdatedApplicant = {
        id: validUUID,
        acceptance_status: 'PENDING',
        userID: 'user-456',
        jobID: 'job-123',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue({ status });
      mockUpdateQuery.single.mockResolvedValue({
        data: mockUpdatedApplicant,
        error: null,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.status).toBe(status);
    });

    it('should normalize status to uppercase in database', async () => {
      const status = 'accepted';
      const mockUpdatedApplicant = {
        id: validUUID,
        acceptance_status: 'ACCEPTED',
        userID: 'user-456',
        jobID: 'job-123',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue({ status });
      mockUpdateQuery.single.mockResolvedValue({
        data: mockUpdatedApplicant,
        error: null,
      });

      await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });

      // Verify that the update was called
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('Applicants');
      expect(mockUpdateQuery.eq).toHaveBeenCalledWith('id', validUUID);
    });
  });

  describe('Error handling', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    const mockUser = { id: 'user-123' };

    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
    });

    it('should return 404 when applicant not found (PGRST116)', async () => {
      const status = 'accepted';

      (mockRequest.json as jest.Mock).mockResolvedValue({ status });
      mockUpdateQuery.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Applicant not found');
    });

    it('should return 404 when updatedApplicant is null', async () => {
      const status = 'accepted';

      (mockRequest.json as jest.Mock).mockResolvedValue({ status });
      mockUpdateQuery.single.mockResolvedValue({
        data: null,
        error: null,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Applicant not found');
    });

    it('should return 500 for database errors', async () => {
      const status = 'accepted';

      (mockRequest.json as jest.Mock).mockResolvedValue({ status });
      mockUpdateQuery.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST301', message: 'Database connection failed' },
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Failed to update applicant status');
      expect(data.details).toBe('Database connection failed');
    });

    it('should handle unexpected errors', async () => {
      const status = 'accepted';

      (mockRequest.json as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Internal server error');
    });

    it('should handle JSON parsing errors', async () => {
      (mockRequest.json as jest.Mock).mockRejectedValue(new Error('Invalid JSON'));

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Internal server error');
    });
  });

  describe('Database update verification', () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    const mockUser = { id: 'user-123' };

    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
    });

    it('should call update with correct parameters', async () => {
      const status = 'accepted';
      const mockUpdatedApplicant = {
        id: validUUID,
        acceptance_status: 'ACCEPTED',
        userID: 'user-456',
        jobID: 'job-123',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue({ status });
      mockUpdateQuery.single.mockResolvedValue({
        data: mockUpdatedApplicant,
        error: null,
      });

      await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });

      // Verify the query chain was called correctly
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('Applicants');
      expect(mockUpdateQuery.eq).toHaveBeenCalledWith('id', validUUID);
      expect(mockUpdateQuery.select).toHaveBeenCalled();
      expect(mockUpdateQuery.single).toHaveBeenCalled();
    });

    it('should return correct response structure on success', async () => {
      const status = 'accepted';
      const mockUpdatedApplicant = {
        id: validUUID,
        acceptance_status: 'ACCEPTED',
        userID: 'user-456',
        jobID: 'job-123',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue({ status });
      mockUpdateQuery.single.mockResolvedValue({
        data: mockUpdatedApplicant,
        error: null,
      });

      const response = await PATCH(mockRequest, {
        params: Promise.resolve({ id: validUUID }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('applicantId', validUUID);
      expect(data).toHaveProperty('status', status);
      expect(data.message).toContain('successfully');
    });
  });
});
