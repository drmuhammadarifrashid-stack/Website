import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Availability from '@/models/availability';
import Appointment from '@/models/appointment';
import { TIME_SLOTS } from '@/lib/appointmentSchema';

// ============================================================
// GET /api/appointments/availability
// Query params:
//   - location (required)
//   - date (optional) - if provided, returns available slots for that date.
//                       otherwise, returns all blocked & fully booked dates.
// ============================================================

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const location = searchParams.get('location');
  const date = searchParams.get('date');

  if (!location) {
    return NextResponse.json(
      { success: false, error: 'location query parameter is required' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const todayStr = new Date().toISOString().split('T')[0];

    // ─── Scenario 1: Date is provided (check slots for that date) ────
    if (date) {
      // 1. Check if date is blocked by admin
      const blockConfig = await Availability.findOne({
        date,
        location,
        isBlocked: true,
      } as Record<string, unknown>).exec();

      if (blockConfig) {
        return NextResponse.json({
          success: true,
          available: false,
          reason: 'blocked',
          message: blockConfig.blockedReason || 'The doctor is not available on this date.',
          slots: [],
        });
      }

      // 2. Check if date is fully booked (6+ appointments limit)
      const activeCount = await Appointment.countDocuments({
        location,
        appointmentDate: date,
        status: { $in: ['pending', 'confirmed'] },
      } as Record<string, unknown>).exec();

      if (activeCount >= 6) {
        return NextResponse.json({
          success: true,
          available: false,
          reason: 'fully_booked',
          message: 'This date is fully booked. Please select another date.',
          slots: [],
        });
      }

      // 3. Find already booked slots on this date
      const bookedAppointments = await Appointment.find({
        location,
        appointmentDate: date,
        status: { $in: ['pending', 'confirmed'] },
      } as Record<string, unknown>).select('appointmentTime').exec();

      const bookedSlots = bookedAppointments.map(
        (a: { appointmentTime: string }) => a.appointmentTime
      );

      // Check if there are custom hours set (not fully blocked, but custom hours)
      const customHoursConfig = await Availability.findOne({
        date,
        location,
        isBlocked: false,
      } as Record<string, unknown>).exec();

      let availableSlots = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));

      // Filter based on location specific hours
      if (location === 'Fauji Foundation Hospital') {
        availableSlots = availableSlots.filter(slot => slot >= '09:00' && slot <= '13:00');
      } else if (location === 'Muhammad Ali Khan Orthopedic & Surgical Hospital') {
        availableSlots = availableSlots.filter(slot => slot >= '18:00' && slot <= '20:00');
      }

      if (customHoursConfig && customHoursConfig.workingHours) {
        const { start, end } = customHoursConfig.workingHours;
        availableSlots = availableSlots.filter((slot) => {
          return slot >= start && slot <= end;
        });
      }

      return NextResponse.json({
        success: true,
        available: true,
        slots: availableSlots,
      });
    }

    // ─── Scenario 2: Date is NOT provided (return blocked & fully booked list) ───
    
    // 1. Fetch admin blocked dates from today onwards
    const blockedConfigs = await Availability.find({
      location,
      date: { $gte: todayStr },
      isBlocked: true,
    } as Record<string, unknown>).select('date').exec();

    const blockedDates = blockedConfigs.map((c: { date: string }) => c.date);

    // 2. Fetch fully booked dates (10+ active appointments) from today onwards
    const appointmentCounts = await Appointment.aggregate([
      {
        $match: {
          location,
          appointmentDate: { $gte: todayStr },
          status: { $in: ['pending', 'confirmed'] },
        },
      },
      {
        $group: {
          _id: '$appointmentDate',
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gte: 6 },
        },
      },
    ]);

    const fullyBookedDates = appointmentCounts.map(
      (group: { _id: string }) => group._id
    );

    return NextResponse.json({
      success: true,
      blockedDates,
      fullyBookedDates,
    });
  } catch (error) {
    console.error('[GET /api/appointments/availability]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve availability information' },
      { status: 500 }
    );
  }
}
