import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // TODO: Implement actual contact form logic (send email, save to database, etc.)
    // For now, just log and return success
    console.log('Contact form submission:', { name, email, message });

    return NextResponse.json({ ok: true, message: 'Message sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
