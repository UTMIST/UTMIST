import { NextRequest, NextResponse } from 'next/server';
import type { ApplicationFormData, PersonalInformation, ContactInformation, EducationInformation } from '../../../types/apply';

function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function validatePhoneNumber(number: string, country: string) {
  const digits = number.replace(/\D/g, '');
  switch (country) {
    case 'Canada':
    case 'United States':
    case 'Canada/USA':
      return /^\d{10}$/.test(digits);
    case 'United Kingdom':
      return /^\d{10,11}$/.test(digits);
    case 'India':
      return /^\d{10}$/.test(digits);
    case 'Australia':
      return /^\d{9}$/.test(digits);
    case 'Japan':
      return /^\d{10,11}$/.test(digits);
    case 'China':
      return /^\d{11}$/.test(digits);
    default:
      return /^\d{6,}$/.test(digits);
  }
}

function validatePostalCode(postalCode: string, country: string) {
  if (country === 'Canada') {
    return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postalCode);
  } else if (country === 'United States') {
    return /^\d{5}(-\d{4})?$/.test(postalCode);
  } else {
    return postalCode.length > 0;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ApplicationFormData = await req.json();
    const { personalInfo, locationInfo, educationInfo, whyJoin } = body;

    // Validate personalInfo
    if (!personalInfo || !personalInfo.firstName || !personalInfo.lastName || !personalInfo.email || !personalInfo.areaCode || !personalInfo.phoneNumber) {
      return NextResponse.json({ error: 'Missing required personal information.' }, { status: 400 });
    }
    if (!validateEmail(personalInfo.email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    let country = locationInfo?.country || (personalInfo.areaCode === '+1' ? 'Canada/USA' : '');
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
