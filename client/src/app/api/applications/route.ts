import { NextRequest, NextResponse } from 'next/server';
import type { Applicant } from '../../../types/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') || '';
    const role = searchParams.get('role') || '';
    const applicationStatus = searchParams.get('applicationStatus') || 'All';
    const interviewStatus = searchParams.get('interviewStatus') || 'All';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('Applicants')
      .select('*');

    // Apply filters based on IDs after fetching related data
    const { data: allApplicants, error } = await query;

    if (error) {
      console.error('Error fetching applicants:', error);
      return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 });
    }

    // Fetch related user and job data for each applicant
    const applicantsWithDetails = await Promise.all(
      (allApplicants || []).map(async (applicant) => {
        const [userData, jobData] = await Promise.all([
          supabase.from('user').select('*').eq('id', applicant.userID).single(),
          supabase.from('Jobs').select('*').eq('id', applicant.jobID).single(),
        ]);

        return {
          id: applicant.id,
          name: userData.data?.name || 'N/A',
          role: jobData.data?.job_title || 'N/A',
          answers: applicant.answers || {},
          interviewStatus: applicant.interview_status || 'Not Scheduled',
          applicationStatus: applicant.acceptance_status || 'Pending',
          notes: applicant.notes || '',
          email: userData.data?.email || 'N/A',
          school: userData.data?.organization || 'N/A',
          year: userData.data?.year || 'N/A',
        };
      })
    );

    // Apply filters on transformed data
    let filteredApplicants = applicantsWithDetails;

    if (name) {
      filteredApplicants = filteredApplicants.filter(app => 
        app.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (role) {
      filteredApplicants = filteredApplicants.filter(app => 
        app.role.toLowerCase().includes(role.toLowerCase())
      );
    }
    if (applicationStatus && applicationStatus !== 'All') {
      if (applicationStatus === 'Pending/Waitlisted') {
        filteredApplicants = filteredApplicants.filter(app => 
          app.applicationStatus === 'PENDING' || app.applicationStatus === 'WAITLISTED'
        );
      } else {
        filteredApplicants = filteredApplicants.filter(app => 
          app.applicationStatus === applicationStatus.toUpperCase()
        );
      }
    }
    if (interviewStatus && interviewStatus !== 'All') {
      filteredApplicants = filteredApplicants.filter(app => 
        app.interviewStatus === interviewStatus
      );
    }

    const total = filteredApplicants.length;
    const totalPages = Math.ceil(total / limit);

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit;
    const paginatedApplicants = filteredApplicants.slice(from, to);

    return NextResponse.json({
      applications: paginatedApplicants,
      total,
      page,
      totalPages,
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}