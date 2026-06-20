import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Appointment from '@/models/appointment';
import { sendRescheduleRequestAlert } from '@/lib/email';

// ============================================================
// GET /api/appointments/my
// Returns appointments belonging to the logged-in patient
// ============================================================

export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const appointments = await Appointment.find({ userId: session.user.id })
      .sort({ appointmentDate: -1, appointmentTime: -1 })
      .exec();

    return NextResponse.json({
      success: true,
      data: appointments.map((a) => a.toObject()),
    });
  } catch (error) {
    console.error('[GET /api/appointments/my]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch your appointments' },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/appointments/my/reschedule-request
// Patient sends a reschedule request for one of their appointments
// ============================================================

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { appointmentId, note } = await request.json();

    if (!appointmentId) {
      return NextResponse.json({ success: false, error: 'appointmentId is required' }, { status: 400 });
    }

    await dbConnect();

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId: session.user.id, // security: only own appointments
    });

    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Cannot request reschedule for a cancelled or completed appointment.' },
        { status: 400 }
      );
    }

    appointment.status = 'rescheduled_requested';
    appointment.rescheduleNote = note || 'Patient requested reschedule.';
    await appointment.save();

    // Notify doctor
    if (appointment.email) {
      sendRescheduleRequestAlert({
        patientName: appointment.name,
        patientEmail: appointment.email,
        patientPhone: appointment.phone,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        location: appointment.location,
        reason: appointment.reason,
        appointmentId: appointmentId,
        rescheduleNote: appointment.rescheduleNote,
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Reschedule request sent. The clinic will contact you shortly.',
      data: appointment.toObject(),
    });
  } catch (error) {
    console.error('[POST /api/appointments/my/reschedule]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit reschedule request' },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/appointments/my?id=xxx
// Patient cancels their own appointment
// ============================================================

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const appointmentId = searchParams.get('id');

  if (!appointmentId) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId: session.user.id,
    });

    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'This appointment cannot be cancelled.' },
        { status: 400 }
      );
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully.',
    });
  } catch (error) {
    console.error('[DELETE /api/appointments/my]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}
