import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Availability from '@/models/availability';

// ============================================================
// GET /api/admin/availability
// Fetch blocked dates/custom schedules
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const location = searchParams.get('location');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;

    await dbConnect();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (location) {
      query.location = location;
    }

    const configs = await Availability.find(query)
      .sort({ date: 1 })
      .limit(limit)
      .exec();

    return NextResponse.json({
      success: true,
      data: configs.map((c) => c.toObject()),
    });
  } catch (error) {
    console.error('[GET /api/admin/availability]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch availability configurations' },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/admin/availability
// Upsert availability configuration (Block a date)
// ============================================================
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Authenticate admin role
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, location, isBlocked, blockedReason, workingHours } = body;

    if (!date || !location) {
      return NextResponse.json(
        { success: false, error: 'Date and location are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Upsert (findOneAndUpdate with upsert: true)
    const config = await Availability.findOneAndUpdate(
      { date, location },
      {
        date,
        location,
        isBlocked: isBlocked ?? true,
        blockedReason: blockedReason || '',
        workingHours: workingHours || { start: '09:00', end: '17:00' },
      },
      { upsert: true, new: true, runValidators: true }
    ).exec();

    return NextResponse.json({
      success: true,
      message: isBlocked ? 'Date blocked successfully' : 'Custom schedule set successfully',
      data: config.toObject(),
    });
  } catch (error) {
    console.error('[POST /api/admin/availability]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save availability configuration' },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/admin/availability?id=xxx
// Unblock a date / Delete custom schedule
// ============================================================
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Authenticate admin role
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const deleted = await Availability.findByIdAndDelete(id).exec();

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Configuration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Date unblocked successfully',
    });
  } catch (error) {
    console.error('[DELETE /api/admin/availability]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete availability configuration' },
      { status: 500 }
    );
  }
}
