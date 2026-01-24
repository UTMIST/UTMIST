import { NextRequest, NextResponse } from 'next/server';
import type { Applicant } from '../../../types/admin';
<<<<<<< HEAD
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

    // Build query with joins to Jobs and user tables
    let query = supabase
      .from('Applicants')
      .select(`
        id,
        created_at,
        answers,
        interview_status,
        acceptance_status,
        interview_time,
        userID,
        jobID,
        Jobs!inner(id, job_title, questions),
        user!inner(id, name, email, organization, year)
      `);

    // Apply filters
    if (name) {
      query = query.ilike('user.name', `%${name}%`);
    }
    if (role) {
      query = query.ilike('Jobs.job_title', `%${role}%`);
    }
    if (applicationStatus && applicationStatus !== 'All') {
      if (applicationStatus === 'Pending/Waitlisted') {
        query = query.or('acceptance_status.eq.PENDING,acceptance_status.eq.WAITLISTED');
      } else {
        query = query.eq('acceptance_status', applicationStatus.toUpperCase());
      }
    }
    if (interviewStatus && interviewStatus !== 'All') {
      query = query.eq('interview_status', interviewStatus);
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('Applicants')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting count:', countError);
      return NextResponse.json({ error: 'Failed to get applicant count' }, { status: 500 });
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching applicants:', error);
      return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 });
    }

    // Transform data to match the Applicant interface
    const transformedApplicants: Applicant[] = (data || []).map((item: any) => ({
      id: item.id,
      name: item.user?.name || 'N/A',
      role: item.Jobs?.job_title || 'N/A',
      questions: Array.isArray(item.Jobs?.questions) 
        ? item.Jobs.questions.map((q: any, idx: number) => ({
            question: q.question || q,
            answer: item.answers?.[idx]?.answer || item.answers?.[idx] || 'N/A'
          }))
        : [],
      interviewStatus: item.interview_status || 'N/A',
      applicationStatus: item.acceptance_status || 'N/A',
      notes: '', // Add notes field if needed in database
      email: item.user?.email || 'N/A',
      phone: '', // Add phone field if needed in database
      school: item.user?.organization || 'N/A',
      major: '', // Add major field if needed in database
      year: item.user?.year || 'N/A',
    }));

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      applications: transformedApplicants,
      total,
      page,
      totalPages,
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
=======
import applicantData from "@/assets/applicants.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || '';
  const role = searchParams.get('role') || '';
  const applicationStatus = searchParams.get('applicationStatus') || 'All';
  const interviewStatus = searchParams.get('interviewStatus') || 'All';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  let filteredApplicants: Applicant[] = applicantData;

  // Filtering logic
  if (name) {
    filteredApplicants = filteredApplicants.filter(a => a.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (role) {
    filteredApplicants = filteredApplicants.filter(a => a.role.toLowerCase().includes(role.toLowerCase()));
  }
  if (applicationStatus && applicationStatus !== 'All') {
    if (applicationStatus === 'Pending/Waitlisted') {
      filteredApplicants = filteredApplicants.filter(a => a.applicationStatus === 'Pending' || a.applicationStatus === 'Waitlisted');
    } else {
      filteredApplicants = filteredApplicants.filter(a => a.applicationStatus === applicationStatus);
    }
  }
  if (interviewStatus && interviewStatus !== 'All') {
    filteredApplicants = filteredApplicants.filter(a => a.interviewStatus === interviewStatus);
  }

  const total = filteredApplicants.length;
  const totalPages = Math.ceil(total / limit);

  // Pagination logic
  const paginatedApplicants = filteredApplicants.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    applications: paginatedApplicants,
    total,
    page,
    totalPages,
  }, { status: 200 });
>>>>>>> main
}