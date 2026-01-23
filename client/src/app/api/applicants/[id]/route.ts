import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicantId } = await params;
    const supabase = await createClient();

    // Fetch the specific applicant with related data
    const { data: applicant, error: applicantError } = await supabase
      .from('Applicants')
      .select('*')
      .eq('id', applicantId)
      .single();


    if (applicantError) {
      return NextResponse.json({ 
        error: 'Failed to fetch applicant', 
        details: applicantError.message 
      }, { status: 500 });
    }

    if (!applicant) {
      return NextResponse.json({ 
        error: 'Applicant not found' 
      }, { status: 404 });
    }

    // Fetch related user and job data
    const [userData, jobData] = await Promise.all([
      supabase.from('user').select('*').eq('id', applicant.userID).single(),
      supabase.from('Jobs').select('*').eq('id', applicant.jobID).single(),
    ]);


    const applicantData = {
      id: applicant.id,
      name: userData.data?.name || 'N/A',
      role: jobData.data?.job_title || 'N/A',
      questions: applicant.answers || {},
      interviewStatus: applicant.interview_status || 'Not Scheduled',
      applicationStatus: applicant.acceptance_status || 'Pending',
      notes: applicant.notes,
      email: userData.data?.email || 'N/A',
      school: userData.data?.organization || 'Uoft',
      year: userData.data?.year || 'N/A',
      interview_time: applicant.interview_time,
    };

    return NextResponse.json({ applicant: applicantData }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicantId } = await params;
    const { notes } = await req.json();

    const supabase = await createClient();

    // Update the notes in the Applicants table
    const { error: updateError } = await supabase
      .from('Applicants')
      .update({ notes })
      .eq('id', applicantId);

    if (updateError) {
      return NextResponse.json({ 
        error: 'Failed to update notes', 
        details: updateError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Notes updated successfully',
      notes 
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
