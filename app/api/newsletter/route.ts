import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // TODO: Implement actual newsletter subscription logic
    // For now, just return success
    console.log('Newsletter subscription:', email);

    return NextResponse.json({ ok: true, message: 'Subscribed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
