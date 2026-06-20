import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/appointment';
import { sendAppointmentReminder } from '@/lib/email';

// ============================================================
// GET /api/cron/send-reminders
// Scans for all confirmed appointments scheduled for tomorrow
// and emails 24h reminders to the patients.
// Protected by Bearer token check for security in production.
// ============================================================

export async function GET(request: NextRequest) {
  // 1. Security check: Only allow if Cron Secret matches (in production)
  const authHeader = request.headers.get('authorization');
  const expectedAuthHeader = `Bearer ${process.env.CRON_SECRET}`;

  if (
    process.env.NODE_ENV === 'production' &&
    (!process.env.CRON_SECRET || authHeader !== expectedAuthHeader)
  ) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    // 2. Determine tomorrow's date string (YYYY-MM-DD)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // 3. Query confirmed appointments for tomorrow
    const appointments = await Appointment.find({
      appointmentDate: tomorrowStr,
      status: 'confirmed',
    }).exec();

    console.log(`[Cron] Found ${appointments.length} confirmed appointments for tomorrow (${tomorrowStr})`);

    let sentCount = 0;
    const errors: string[] = [];

    // 4. Send emails asynchronously
    for (const apt of appointments) {
      if (apt.email) {
        try {
          await sendAppointmentReminder({
            patientName: apt.name,
            patientEmail: apt.email,
            patientPhone: apt.phone,
            appointmentDate: apt.appointmentDate,
            appointmentTime: apt.appointmentTime,
            location: apt.location,
            reason: apt.reason,
            appointmentId: apt._id.toString(),
          });
          sentCount++;
        } catch (err: any) {
          console.error(`[Cron] Failed to send reminder to ${apt.email}:`, err);
          errors.push(`${apt.name} (${apt.email}): ${err.message || err}`);
        }
      } else {
        console.log(`[Cron] Skipping reminder for ${apt.name} — no email address associated.`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully sent ${sentCount} reminders.`,
      date: tomorrowStr,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('[GET /api/cron/send-reminders] Unhandled error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to run cron job', details: error.message || error },
      { status: 500 }
    );
  }
}
