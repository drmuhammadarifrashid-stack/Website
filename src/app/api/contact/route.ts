import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/contact';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 });
    }

    const contact = await Contact.create({ name, email, phone: phone || '', subject, message });
    return NextResponse.json({ success: true, id: contact._id }, { status: 201 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('x-admin-password');
    if (auth !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('GET contacts error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
