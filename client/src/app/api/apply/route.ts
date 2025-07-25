import { NextRequest, NextResponse } from 'next/server';
import type { ApplicationFormData } from '../../../types/apply';
import { validateEmail, validatePhoneNumber, validatePostalCode } from '../../../utils/validation';

export async function POST(req: NextRequest) {
  try {
    const body: ApplicationFormData = await req.json();
    const { personalInfo, locationInfo, educationInfo, whyJoin } = body;

    console.log(educationInfo, whyJoin);

    // Validate personalInfo
    if (!personalInfo || !personalInfo.firstName || !personalInfo.lastName || !personalInfo.email || !personalInfo.areaCode || !personalInfo.phoneNumber) {
      return NextResponse.json({ error: 'Missing required personal information.' }, { status: 400 });
    }
    const emailError = validateEmail(personalInfo.email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }
    const country = locationInfo?.country || (personalInfo.areaCode === '+1' ? 'Canada/USA' : '');
    if (!validatePhoneNumber(personalInfo.phoneNumber, country)) {
      return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 });
    }

    // Validate locationInfo
    if (!locationInfo || !locationInfo.country || !locationInfo.address || !locationInfo.city || !locationInfo.postalCode || !locationInfo.provinceOrState) {
      return NextResponse.json({ error: 'Missing required contact information.' }, { status: 400 });
    }
    if (!validatePostalCode(locationInfo.postalCode, locationInfo.country)) {
      return NextResponse.json({ error: 'Invalid postal code.' }, { status: 400 });
    }

    // Validate educationInfo
    if (!educationInfo || !educationInfo.school || !educationInfo.educationLevel || !educationInfo.fieldOfStudy || !educationInfo.graduationMonth || !educationInfo.graduationYear) {
      return NextResponse.json({ error: 'Missing required education information.' }, { status: 400 });
    }

    // Validate whyJoin
    if (!whyJoin || typeof whyJoin !== 'string' || whyJoin.trim().length === 0) {
      return NextResponse.json({ error: 'Missing or invalid response for "Why do you want to join?"' }, { status: 400 });
    }

    // If all validations pass, proceed (e.g., save to DB)
    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 });
  }
}
