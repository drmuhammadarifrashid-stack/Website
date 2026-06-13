import { NextResponse } from 'next/server';
import { getAppointmentStats } from '@/lib/appointmentService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getAppointmentStats();
    
    // getAppointmentStats returns Record<AppointmentStatus, number>
    // e.g. { pending: 5, confirmed: 2, completed: 10, cancelled: 1 }
    
    const total = Object.values(stats).reduce((acc, count) => acc + count, 0);

    return NextResponse.json(
      { 
        success: true, 
        data: {
          ...stats,
          total
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/appointments/stats]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointment statistics' },
      { status: 500 }
    );
  }
}
