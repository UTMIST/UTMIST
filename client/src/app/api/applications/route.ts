import { NextRequest, NextResponse } from 'next/server';
import type { Applicant } from '../../../types/admin';
import applicantData from "@/assets/applicants.json";
import { getAdminUser } from '@/lib/auth/guards';

export async function GET(req: NextRequest) {
  // Applicant records are PII. Middleware only checks that *someone* is signed
  // in, so the admin check has to happen here.
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

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
}