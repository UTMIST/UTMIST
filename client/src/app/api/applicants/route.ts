import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
   
    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 });
  }
}
