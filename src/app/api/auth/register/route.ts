import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import User from '@/models/user';

const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string().email('Please provide a valid email address'),
  phone: z
    .string()
    .regex(
      /^(\+92|0)[0-9]{10}$/,
      'Phone must be a valid Pakistani number (e.g. 03001234567)'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),
});

export async function POST(request: NextRequest) {
  // ── 1. Parse body ──────────────────────────────────────────
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  // ── 2. Validate ────────────────────────────────────────────
  const parsed = registerSchema.safeParse(rawBody);
  if (!parsed.success) {
    const details: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join('.') || 'form';
      if (!details[field]) details[field] = [];
      details[field].push(issue.message);
    }
    return NextResponse.json(
      { success: false, error: 'Validation failed', details },
      { status: 422 }
    );
  }

  const { name, email, phone, password } = parsed.data;

  // ── 3. Check duplicate ─────────────────────────────────────
  await dbConnect();
  const existing = await User.findByEmail(email);
  if (existing) {
    return NextResponse.json(
      { success: false, error: 'An account with this email already exists. Please log in.' },
      { status: 409 }
    );
  }

  // ── 4. Hash password ───────────────────────────────────────
  const passwordHash = await bcrypt.hash(password, 12);

  // ── 5. Create user ─────────────────────────────────────────
  try {
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.replace(/[\s\-()]/g, ''),
      passwordHash,
      role: 'patient',
    });
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully! You can now log in.',
        data: { name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('[POST /api/auth/register]', error);
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
