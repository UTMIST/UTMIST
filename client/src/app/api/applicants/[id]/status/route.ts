import { NextRequest, NextResponse } from 'next/server';
import type { ApplicantStatusUpdate, ApplicantStatusResponse } from '../../../../../types/applicant';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApplicantStatusResponse>> {
  try {
    const { id } = params;
    const body: ApplicantStatusUpdate = await req.json();
    const { status, email } = body;

    // Validate the status
    const validStatuses = ['pending', 'accepted', 'rejected', 'waitlisted'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid status. Must be one of: pending, accepted, rejected, waitlisted'
      }, { status: 400 });
    }

    // Validate the ID format (should be either email or UID)
    if (!id || typeof id !== 'string' || (!id.includes('@') && id.length < 3)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid applicant ID. Must be a valid UID or email address'
      }, { status: 400 });
    }

    // TODO: Replace with actual database update

    console.log(`Updating applicant ${id} status to ${status}`);

    // Send status update email
    let emailSent = false;
    if (email) {
      try {
        console.log(`Sending ${status} notification email to ${email}`);
        // emailSent = await sendStatusUpdateEmail(email, status, undefined, notes);
        
        if (emailSent) {
          console.log(`Status update email sent successfully to ${email}`);
        } else {
          console.warn(`Failed to send status update email to ${email}`);
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the entire request if email fails
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Applicant status updated to ${status} successfully`,
      applicantId: id,
      status: status,
      emailSent: emailSent
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating applicant status:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update applicant status'
    }, { status: 500 });
  }
}
