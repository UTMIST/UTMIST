import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ApplicantStatusUpdate, ApplicantStatusResponse } from '../../../../../types/applicant';

/**
 * PATCH /api/applicants/:id/status
 * 
 * Updates an applicant's acceptance status in the database.
 * 
 * @param req - Next.js request object
 * @param params - Route parameters containing the applicant ID (UUID)
 * @returns JSON response with update status
 * 
 * Request body:
 * {
 *   status: 'ACCEPTED' | 'REJECTED' | 'WAITLISTED'
 * }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApplicantStatusResponse>> {
  try {
    const { id } = await params;
    const body: ApplicantStatusUpdate = await req.json();
    const { status } = body;

    // Validate the status (must match database enum values)
    const validStatuses = ['ACCEPTED', 'REJECTED', 'WAITLISTED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid status. Must be one of: ACCEPTED, REJECTED, WAITLISTED'
      }, { status: 400 });
    }

    // Validate the ID format (should be a UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || typeof id !== 'string' || !uuidRegex.test(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid applicant ID. Must be a valid UUID'
      }, { status: 400 });
    }

    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 });
    }

    // Update the applicant's acceptance_status in the database
    // Status is already in uppercase enum format (ACCEPTED, REJECTED, WAITLISTED)
    const { data: updatedApplicant, error: updateError } = await supabase
      .from('Applicants')
      .update({ acceptance_status: status })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating applicant status:', updateError);
      
      // Check if applicant not found
      if (updateError.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          message: 'Applicant not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: false,
        message: 'Failed to update applicant status',
        details: updateError.message
      }, { status: 500 });
    }

    if (!updatedApplicant) {
      return NextResponse.json({
        success: false,
        message: 'Applicant not found'
      }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Applicant status updated to ${status} successfully`,
      applicantId: id,
      status: status
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error updating applicant status:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
