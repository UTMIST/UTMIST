import { NextRequest, NextResponse } from 'next/server';
import type { Applicant } from '../../../types/admin';
import applicantData from "@/assets/applicants.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nameEmail = searchParams.get('nameEmail') || '';
  const role = searchParams.get('role') || '';
  const applicationStatus = searchParams.get('applicationStatus') || 'All';
  const interviewStatus = searchParams.get('interviewStatus') || 'All';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  let filteredApplicants: Applicant[] = applicantData;

  // Filtering logic
  if (nameEmail) {
    filteredApplicants = filteredApplicants.filter(
        a => a.name.toLowerCase().includes(nameEmail.toLowerCase())
            || a.email.toLowerCase().includes(nameEmail.toLowerCase())
        );
  }
  if (role) {
    filteredApplicants = filteredApplicants.filter(a => a.role.toLowerCase().includes(role.toLowerCase()));
  }
  if (applicationStatus && applicationStatus !== 'All') {
      filteredApplicants = filteredApplicants.filter(a => a.applicationStatus === applicationStatus);
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