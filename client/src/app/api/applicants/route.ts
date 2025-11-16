import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/applicants
 * 
 * Fetches applicants with optional filtering by job_title and interview_status, and pagination support.
 * 
 * Query Parameters:
 * - jobID: Filter by exact job ID (UUID) - takes precedence over role if both provided
 * - role: Search by job_title (case-insensitive partial match) from Jobs table
 * - status: Filter by interview_status (from Applicants table)
 * - acceptanceStatus: Filter by acceptance_status (from Applicants table)
 * - page: Page number for pagination (default: 1)
 * - limit: Number of results per page (default: 20, max: 100)
 * 
 * Returns:
 * {
 *   data: Applicant[],
 *   pagination: {
 *     page: number,
 *     limit: number,
 *     total: number,
 *     totalPages: number
 *   }
 * }
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const jobID = searchParams.get('jobID'); // Exact match by job ID (UUID)
    const role = searchParams.get('role'); // String search by job_title
    const status = searchParams.get('status'); // This filters by interview_status
    const acceptanceStatus = searchParams.get('acceptanceStatus'); // This filters by acceptance_status
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = (page - 1) * limit;

    // If filtering by jobID (exact match), use it directly
    // If filtering by role (job_title search), get job IDs that match the search
    let jobIds: string[] | null = null;
    
    if (jobID) {
      // Direct jobID filter - use exact match
      jobIds = [jobID];
    } else if (role) {
      // Search by job_title using case-insensitive partial matching
      const { data: jobsData, error: jobsError } = await supabase
        .from('Jobs')
        .select('id')
        .ilike('job_title', `%${role}%`); // Case-insensitive partial match

      if (jobsError) {
        console.error('Error fetching jobs by job_title:', jobsError);
        return NextResponse.json(
          { error: 'Failed to filter by role', details: jobsError.message },
          { status: 500 }
        );
      }

      jobIds = jobsData?.map(job => job.id) || [];
      if (jobIds.length === 0) {
        // No jobs match the role, return empty result
        return NextResponse.json({
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        });
      }
    }

    // Build the query for Applicants table
    let query = supabase
      .from('Applicants')
      .select('*', { count: 'exact' });

    // Apply filters
    if (jobIds) {
      // Filter by job IDs (either from jobID parameter or role search)
      // Note: If your foreign key column is named differently (e.g., 'job_id'), update this
      if (jobIds.length === 1) {
        query = query.eq('jobID', jobIds[0]);
      } else {
        query = query.in('jobID', jobIds);
      }
    }

    if (status) {
      // Filter by interview_status in Applicants table
      // Normalize to uppercase to match enum values (PENDING, ACCEPTED, etc.)
      const normalizedStatus = status.toUpperCase();
      query = query.eq('interview_status', normalizedStatus);
    }

    if (acceptanceStatus) {
      // Filter by acceptance_status in Applicants table
      // Normalize to uppercase to match enum values
      const normalizedAcceptanceStatus = acceptanceStatus.toUpperCase();
      query = query.eq('acceptance_status', normalizedAcceptanceStatus);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Order by created_at descending (newest first)
    query = query.order('created_at', { ascending: false });

    // Execute query
    const { data: applicants, error, count } = await query;

    if (error) {
      console.error('Error fetching applicants:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applicants', details: error.message },
        { status: 500 }
      );
    }

    // If no applicants, return empty result
    if (!applicants || applicants.length === 0) {
      return NextResponse.json({
        data: [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      });
    }

    // Get unique job IDs and user IDs from applicants
    const uniqueJobIds = [...new Set(applicants.map(app => app.jobID).filter(Boolean))];
    const uniqueUserIds = [...new Set(applicants.map(app => app.userID).filter(Boolean))];

    // Fetch job details for all unique job IDs
    let jobsMap: Record<string, any> = {};
    if (uniqueJobIds.length > 0) {
      const { data: jobsData, error: jobsError } = await supabase
        .from('Jobs')
        .select('id, job_title, description')
        .in('id', uniqueJobIds);

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        // Continue without job data rather than failing
      } else if (jobsData) {
        // Create a map for quick lookup
        jobsMap = jobsData.reduce((acc, job) => {
          acc[job.id] = job;
          return acc;
        }, {} as Record<string, any>);
      }
    }

    // Fetch user details for all unique user IDs
    let usersMap: Record<string, any> = {};
    if (uniqueUserIds.length > 0) {
      const { data: usersData, error: usersError } = await supabase
        .from('user')
        .select('id, email, name')
        .in('id', uniqueUserIds);

      if (usersError) {
        console.error('Error fetching users:', usersError);
        // Continue without user data rather than failing
      } else if (usersData) {
        // Create a map for quick lookup (keep id for mapping, but exclude from final object)
        usersMap = usersData.reduce((acc, user) => {
          const { id, ...userWithoutId } = user;
          acc[id] = userWithoutId; // Store without id
          return acc;
        }, {} as Record<string, any>);
      }
    }

    // Combine applicants with their job and user data
    const dataWithJobsAndUsers = applicants.map(applicant => ({
      ...applicant,
      jobs: applicant.jobID ? jobsMap[applicant.jobID] || null : null,
      user: applicant.userID ? usersMap[applicant.userID] || null : null,
    }));

    // Calculate pagination metadata
    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: dataWithJobsAndUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/applicants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

