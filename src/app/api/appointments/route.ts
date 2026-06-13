import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { appointmentSchema } from '@/lib/appointmentSchema';
import { createAppointment, getAppointments } from '@/lib/appointmentService';
import type { AppointmentFilters, PaginationOptions } from '@/types/appointment';

// ============================================================
// GET /api/appointments
// Query params: status, location, gender, dateFrom, dateTo,
//               search, page, limit, sortBy, sortOrder
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const filters: AppointmentFilters = {
      ...(searchParams.get('status') && {
        status: searchParams.get('status') as AppointmentFilters['status'],
      }),
      ...(searchParams.get('location') && {
        location: searchParams.get('location') as AppointmentFilters['location'],
      }),
      ...(searchParams.get('gender') && {
        gender: searchParams.get('gender') as AppointmentFilters['gender'],
      }),
      ...(searchParams.get('dateFrom') && { dateFrom: searchParams.get('dateFrom')! }),
      ...(searchParams.get('dateTo') && { dateTo: searchParams.get('dateTo')! }),
      ...(searchParams.get('search') && { search: searchParams.get('search')! }),
    };

    const pagination: PaginationOptions = {
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      ...(searchParams.get('sortBy') && {
        sortBy: searchParams.get('sortBy') as PaginationOptions['sortBy'],
      }),
      ...(searchParams.get('sortOrder') && {
        sortOrder: searchParams.get('sortOrder') as PaginationOptions['sortOrder'],
      }),
    };

    const result = await getAppointments(filters, pagination);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/appointments]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/appointments
// Body validated with Zod schema (same schema as the frontend)
// ============================================================

export async function POST(request: NextRequest) {
  // ── 1. Parse body ─────────────────────────────────────────
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  // ── 2. Zod validation ─────────────────────────────────────
  const parsed = appointmentSchema.safeParse(rawBody);
  if (!parsed.success) {
    const details = formatZodErrors(parsed.error);
    return NextResponse.json(
      { success: false, error: 'Validation failed', details },
      { status: 422 }
    );
  }

  // ── 3. Save to MongoDB ────────────────────────────────────
  try {
    const appointment = await createAppointment(parsed.data);
    return NextResponse.json(
      {
        success: true,
        data: appointment.toObject(),
        message: 'Appointment booked successfully. We will confirm within 24 hours.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('[POST /api/appointments]', error);

    // Mongoose ValidationError fallback
    if (isMongooseValidationError(error)) {
      const details = formatMongooseErrors(error);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create appointment. Please try again.' },
      { status: 500 }
    );
  }
}

// ============================================================
// Helpers
// ============================================================

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const details: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = issue.path.join('.') || 'form';
    if (!details[field]) details[field] = [];
    details[field].push(issue.message);
  }
  return details;
}

function isMongooseValidationError(
  error: unknown
): error is { name: string; errors: Record<string, { message: string }> } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'ValidationError' &&
    'errors' in error
  );
}

function formatMongooseErrors(error: {
  errors: Record<string, { message: string }>;
}): Record<string, string[]> {
  const details: Record<string, string[]> = {};
  for (const [field, err] of Object.entries(error.errors)) {
    details[field] = [err.message];
  }
  return details;
}
