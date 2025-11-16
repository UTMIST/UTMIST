import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/applicants
 * 
 * Fetches applicants with optional filtering by job_title and interview_status, and pagination support.
 * 
 * Query Parameters:
 * - role: Filter by job_title (from Jobs table) - note: parameter name is 'role' but filters by job_title
 * - status: Filter by interview_status (from Applicants table)
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
    const role = searchParams.get('role'); // This filters by job_title
    const status = searchParams.get('status'); // This filters by interview_status
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = (page - 1) * limit;

    // If filtering by role (job_title), first get job IDs that match the job_title
    let jobIds: string[] | null = null;
    if (role) {
      const { data: jobsData, error: jobsError } = await supabase
        .from('Jobs')
        .select('id')
        .eq('job_title', role);

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
      // Filter by job IDs that match the role
      // Note: If your foreign key column is named differently (e.g., 'job_id'), update this
      query = query.in('jobID', jobIds);
    }

    if (status) {
      // Filter by interview_status in Applicants table
      query = query.eq('interview_status', status);
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

