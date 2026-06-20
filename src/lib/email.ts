import nodemailer from 'nodemailer';

// ============================================================
// Nodemailer Transport
// ============================================================

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

// ============================================================
// Base send function
// ============================================================

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  // Skip silently in development if SMTP is not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Email] SMTP not configured — would send "${subject}" to ${to}`);
    return;
  }

  const transport = getTransporter();
  await transport.sendMail({
    from: process.env.SMTP_FROM || `Dr. Arif Clinic <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
  console.log(`[Email] Sent "${subject}" to ${to}`);
}

// ============================================================
// Typed email functions
// ============================================================

export interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  location: string;
  reason: string;
  appointmentId: string;
  status?: string;
  rescheduleNote?: string;
  adminNote?: string;
}

/** 1. Sent to patient immediately after they book */
export async function sendBookingConfirmation(data: AppointmentEmailData) {
  const { bookingReceivedHtml } = await import('./emailTemplates');
  await sendEmail({
    to: data.patientEmail,
    subject: '📋 Appointment Request Received — Dr. Arif Clinic',
    html: bookingReceivedHtml(data),
  });
}

/** 2. Sent to doctor when a new booking arrives */
export async function sendDoctorNewBookingAlert(data: AppointmentEmailData) {
  const doctorEmail = process.env.DOCTOR_EMAIL;
  if (!doctorEmail) return;
  const { doctorAlertHtml } = await import('./emailTemplates');
  await sendEmail({
    to: doctorEmail,
    subject: `🔔 New Appointment: ${data.patientName} — ${data.appointmentDate}`,
    html: doctorAlertHtml(data),
  });
}

/** 3. Sent to patient when appointment is confirmed by admin */
export async function sendAppointmentConfirmed(data: AppointmentEmailData) {
  const { appointmentConfirmedHtml } = await import('./emailTemplates');
  await sendEmail({
    to: data.patientEmail,
    subject: '✅ Appointment Confirmed — Dr. Arif Clinic',
    html: appointmentConfirmedHtml(data),
  });
}

/** 4. Sent to patient when appointment is cancelled */
export async function sendAppointmentCancelled(data: AppointmentEmailData) {
  const { appointmentCancelledHtml } = await import('./emailTemplates');
  await sendEmail({
    to: data.patientEmail,
    subject: '❌ Appointment Cancelled — Dr. Arif Clinic',
    html: appointmentCancelledHtml(data),
  });
}

/** 5. Sent to patient when appointment is rescheduled */
export async function sendRescheduleNotice(data: AppointmentEmailData) {
  const { rescheduleNoticeHtml } = await import('./emailTemplates');
  await sendEmail({
    to: data.patientEmail,
    subject: '📅 Appointment Rescheduled — Dr. Arif Clinic',
    html: rescheduleNoticeHtml(data),
  });
}

/** 6. 24-hour reminder sent to patient */
export async function sendAppointmentReminder(data: AppointmentEmailData) {
  const { appointmentReminderHtml } = await import('./emailTemplates');
  await sendEmail({
    to: data.patientEmail,
    subject: '⏰ Reminder: Your Appointment is Tomorrow — Dr. Arif Clinic',
    html: appointmentReminderHtml(data),
  });
}

/** 7. Doctor notified when a patient requests reschedule */
export async function sendRescheduleRequestAlert(data: AppointmentEmailData) {
  const doctorEmail = process.env.DOCTOR_EMAIL;
  if (!doctorEmail) return;
  const { rescheduleRequestAlertHtml } = await import('./emailTemplates');
  await sendEmail({
    to: doctorEmail,
    subject: `🔄 Reschedule Request: ${data.patientName} — Dr. Arif Clinic`,
    html: rescheduleRequestAlertHtml(data),
  });
}
