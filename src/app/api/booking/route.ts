import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { fullName, email, phone, preferredService, preferredDate, preferredTime, message } = body;

    // Basic server-side validation
    if (!fullName || !email || !phone || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    // In a production app, here you would trigger EmailJS, SendGrid, or save to a database.
    console.log('[WE DESIGN SMILES] New Appointment Booking:', {
      fullName,
      email,
      phone,
      preferredService,
      preferredDate,
      preferredTime,
      message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! We'll contact you soon to confirm your appointment.",
        bookingRef: `WDS-${Math.floor(100000 + Math.random() * 900000)}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process reservation request' },
      { status: 500 }
    );
  }
}
