import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
} from '@/lib/appointmentService';
import type { UpdateAppointmentInput, AppointmentStatus } from '@/types/appointment';
import {
  sendAppointmentConfirmed,
  sendAppointmentCancelled,
  sendRescheduleNotice,
} from '@/lib/email';

type Params = { params: Promise<{ id: string }> };

// ============================================================
// GET /api/appointments/[id]
// ============================================================

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const appointment = await getAppointmentById(id);

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: appointment.toObject() },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/appointments/[id]]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH /api/appointments/[id]
// Body: UpdateAppointmentInput  OR  { status: AppointmentStatus }
// ============================================================

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body: UpdateAppointmentInput & { status?: AppointmentStatus } =
      await request.json();

    // Quick-status update shortcut
    if (Object.keys(body).length === 1 && body.status) {
      const updated = await updateAppointmentStatus(id, body.status);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: 'Appointment not found' },
          { status: 404 }
        );
      }

      // ── Trigger email notifications based on new status ──────
      if (updated.email) {
        const emailData = {
          patientName: updated.name,
          patientEmail: updated.email,
          patientPhone: updated.phone,
          appointmentDate: updated.appointmentDate,
          appointmentTime: updated.appointmentTime,
          location: updated.location,
          reason: updated.reason,
          appointmentId: id,
          adminNote: updated.adminNote,
        };

        if (body.status === 'confirmed') {
          sendAppointmentConfirmed(emailData).catch(console.error);
        } else if (body.status === 'cancelled') {
          sendAppointmentCancelled(emailData).catch(console.error);
        }
      }

      return NextResponse.json(
        { success: true, data: updated.toObject() },
        { status: 200 }
      );
    }

    // Full update (e.g. reschedule by admin)
    const updated = await updateAppointment(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // If date/time changed AND patient has email → send reschedule email
    const wasRescheduled =
      (body.appointmentDate || body.appointmentTime) && updated.email;
    if (wasRescheduled && updated.email) {
      sendRescheduleNotice({
        patientName: updated.name,
        patientEmail: updated.email,
        patientPhone: updated.phone,
        appointmentDate: updated.appointmentDate,
        appointmentTime: updated.appointmentTime,
        location: updated.location,
        reason: updated.reason,
        appointmentId: id,
        adminNote: updated.adminNote,
      }).catch(console.error);
    }

    return NextResponse.json(
      { success: true, data: updated.toObject() },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('[PATCH /api/appointments/[id]]', error);

    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      (error as { name: string }).name === 'ValidationError' &&
      'errors' in error
    ) {
      const mongoErrors = (
        error as { errors: Record<string, { message: string }> }
      ).errors;
      const details: Record<string, string[]> = {};
      for (const [field, err] of Object.entries(mongoErrors)) {
        details[field] = [err.message];
      }
      return NextResponse.json(
        { success: false, error: 'Validation failed', details },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/appointments/[id]
// ============================================================

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteAppointment(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Appointment deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[DELETE /api/appointments/[id]]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
