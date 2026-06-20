import type { AppointmentEmailData } from './email';

// ============================================================
// Shared Layout & Helper
// ============================================================

const CLINIC_NAME = "Dr. Muhammad Arif Rashid";
const CLINIC_SUBTITLE = "Consultant Anesthesiologist & Pain Specialist";
const CLINIC_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://drmuhammadarifrashid.com';

function wrap(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(10,35,66,0.15);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#061528 0%,#0a2342 50%,#1a3a5c 100%);padding:32px 40px;text-align:center;">
            <div style="font-size:32px;margin-bottom:12px;">🏥</div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;font-family:'Outfit',Arial,sans-serif;">${CLINIC_NAME}</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">${CLINIC_SUBTITLE}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">
              This email was sent by ${CLINIC_NAME}'s appointment system.<br/>
              <a href="${CLINIC_URL}" style="color:#1a7a8a;text-decoration:none;">Visit our website</a>
              &nbsp;|&nbsp;
              <span>Lahore, Pakistan</span>
            </p>
            <p style="margin:8px 0 0;color:#94a3b8;font-size:11px;">
              ⚠️ This is an automated message. Do not reply to this email directly.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

function detailRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
      <span style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">${label}</span>
      <div style="color:#0a2342;font-size:15px;font-weight:600;margin-top:4px;">${value}</div>
    </td>
  </tr>`;
}

function appointmentBox(data: AppointmentEmailData): string {
  const dateFormatted = new Date(data.appointmentDate).toLocaleDateString('en-PK', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;border-radius:12px;padding:20px;margin:24px 0;">
    <tr><td>
      <h3 style="margin:0 0 16px;color:#0a2342;font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">📋 Appointment Details</h3>
      <table width="100%">
        ${detailRow('Patient', data.patientName)}
        ${detailRow('Date', dateFormatted)}
        ${detailRow('Time', formatTime(data.appointmentTime))}
        ${detailRow('Location', data.location)}
        ${detailRow('Reason', data.reason)}
      </table>
    </td></tr>
  </table>`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function actionButton(text: string, href: string, color = '#1a7a8a'): string {
  return `
  <div style="text-align:center;margin:28px 0;">
    <a href="${href}" style="display:inline-block;padding:14px 32px;background:${color};color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;font-family:'Inter',Arial,sans-serif;box-shadow:0 4px 16px rgba(26,122,138,0.3);">
      ${text}
    </a>
  </div>`;
}

// ============================================================
// 1. Booking Received (to patient)
// ============================================================

export function bookingReceivedHtml(data: AppointmentEmailData): string {
  return wrap('Appointment Request Received', `
    <h2 style="margin:0 0 8px;color:#0a2342;font-size:24px;font-weight:800;font-family:'Outfit',Arial,sans-serif;">
      Appointment Request Received 📋
    </h2>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 4px;">
      Dear <strong>${data.patientName}</strong>,
    </p>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Thank you for booking an appointment. We have received your request and our team will confirm your appointment within <strong style="color:#1a7a8a;">24 hours</strong> via a phone call.
    </p>

    ${appointmentBox(data)}

    <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:16px;margin:0 0 24px;">
      <p style="margin:0;color:#854d0e;font-size:14px;line-height:1.6;">
        ⏳ <strong>What happens next?</strong><br/>
        Our team will call you at <strong>${data.patientPhone}</strong> to confirm your appointment. Please keep your phone accessible.
      </p>
    </div>

    ${actionButton('View My Appointments', `${CLINIC_URL}/dashboard`, '#0a2342')}

    <p style="color:#94a3b8;font-size:13px;text-align:center;">
      Need to cancel or reschedule? Visit your <a href="${CLINIC_URL}/dashboard" style="color:#1a7a8a;">patient dashboard</a>.
    </p>
  `);
}

// ============================================================
// 2. Doctor Alert (to doctor)
// ============================================================

export function doctorAlertHtml(data: AppointmentEmailData): string {
  return wrap('New Appointment Booking', `
    <h2 style="margin:0 0 8px;color:#0a2342;font-size:24px;font-weight:800;font-family:'Outfit',Arial,sans-serif;">
      🔔 New Appointment Booking
    </h2>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
      A new appointment request has been received and requires your confirmation.
    </p>

    ${appointmentBox(data)}

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8f7f9;border-radius:12px;padding:20px;margin:0 0 24px;">
      <tr><td>
        <h3 style="margin:0 0 12px;color:#0a2342;font-size:14px;font-weight:700;">Patient Contact</h3>
        <p style="margin:0;color:#1a7a8a;font-size:15px;">
          📞 <a href="tel:${data.patientPhone}" style="color:#1a7a8a;text-decoration:none;font-weight:700;">${data.patientPhone}</a>
        </p>
        <p style="margin:4px 0 0;color:#475569;font-size:14px;">
          📧 ${data.patientEmail}
        </p>
      </td></tr>
    </table>

    ${actionButton('Manage in Admin Dashboard', `${CLINIC_URL}/admin`, '#0a2342')}
  `);
}

// ============================================================
// 3. Appointment Confirmed (to patient)
// ============================================================

export function appointmentConfirmedHtml(data: AppointmentEmailData): string {
  return wrap('Appointment Confirmed', `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:64px;height:64px;background:linear-gradient(135deg,#059669,#10b981);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;">✅</div>
    </div>
    <h2 style="margin:0 0 8px;color:#0a2342;font-size:24px;font-weight:800;font-family:'Outfit',Arial,sans-serif;text-align:center;">
      Appointment Confirmed!
    </h2>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 4px;text-align:center;">
      Dear <strong>${data.patientName}</strong>,
    </p>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;text-align:center;">
      Your appointment has been <strong style="color:#059669;">confirmed</strong>. Please arrive 10–15 minutes early.
    </p>

    ${appointmentBox(data)}

    <div style="background:#dcfce7;border:1px solid #86efac;border-radius:10px;padding:16px;margin:0 0 24px;">
      <p style="margin:0;color:#166534;font-size:14px;line-height:1.8;">
        📌 <strong>Reminders:</strong><br/>
        • Bring any previous medical reports or prescriptions<br/>
        • Arrive 10–15 minutes before your appointment time<br/>
        • You will receive a reminder email 24 hours before your appointment
      </p>
    </div>

    ${actionButton('View My Dashboard', `${CLINIC_URL}/dashboard`)}
  `);
}

// ============================================================
// 4. Appointment Cancelled (to patient)
// ============================================================

export function appointmentCancelledHtml(data: AppointmentEmailData): string {
  return wrap('Appointment Cancelled', `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:64px;height:64px;background:linear-gradient(135deg,#dc2626,#ef4444);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;">❌</div>
    </div>
    <h2 style="margin:0 0 8px;color:#0a2342;font-size:24px;font-weight:800;font-family:'Outfit',Arial,sans-serif;text-align:center;">
      Appointment Cancelled
    </h2>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;text-align:center;">
      Dear <strong>${data.patientName}</strong>, your appointment has been cancelled.
    </p>

    ${appointmentBox(data)}

    <div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:10px;padding:16px;margin:0 0 24px;">
      <p style="margin:0;color:#991b1b;font-size:14px;line-height:1.6;">
        If you believe this is an error or would like to rebook, please visit our website or contact the clinic directly.
      </p>
    </div>

    ${actionButton('Book a New Appointment', `${CLINIC_URL}/appointment`)}
  `);
}

// ============================================================
// 5. Reschedule Notice (to patient)
// ============================================================

export function rescheduleNoticeHtml(data: AppointmentEmailData): string {
  const dateFormatted = new Date(data.appointmentDate).toLocaleDateString('en-PK', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return wrap('Appointment Rescheduled', `
    <h2 style="margin:0 0 8px;color:#0a2342;font-size:24px;font-weight:800;font-family:'Outfit',Arial,sans-serif;">
      📅 Your Appointment Has Been Rescheduled
    </h2>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Dear <strong>${data.patientName}</strong>, your appointment has been moved to a new date and time.
    </p>

    <div style="background:#e8f7f9;border:2px solid #1a7a8a;border-radius:12px;padding:24px;margin:0 0 24px;text-align:center;">
      <p style="margin:0;color:#1a7a8a;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">New Date & Time</p>
      <p style="margin:8px 0 0;color:#0a2342;font-size:22px;font-weight:800;font-family:'Outfit',Arial,sans-serif;">${dateFormatted}</p>
      <p style="margin:4px 0 0;color:#1a7a8a;font-size:18px;font-weight:700;">${formatTime(data.appointmentTime)}</p>
      <p style="margin:8px 0 0;color:#475569;font-size:14px;">📍 ${data.location}</p>
    </div>

    ${data.rescheduleNote ? `
    <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:16px;margin:0 0 24px;">
      <p style="margin:0;color:#854d0e;font-size:14px;"><strong>Note from clinic:</strong> ${data.rescheduleNote}</p>
    </div>` : ''}

    ${actionButton('View My Appointments', `${CLINIC_URL}/dashboard`)}
  `);
}

// ============================================================
// 6. 24-Hour Reminder (to patient)
// ============================================================

export function appointmentReminderHtml(data: AppointmentEmailData): string {
  return wrap('Appointment Reminder', `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:64px;height:64px;background:linear-gradient(135deg,#d97706,#f59e0b);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;">⏰</div>
    </div>
    <h2 style="margin:0 0 8px;color:#0a2342;font-size:24px;font-weight:800;font-family:'Outfit',Arial,sans-serif;text-align:center;">
      Your Appointment is Tomorrow!
    </h2>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;text-align:center;">
      Dear <strong>${data.patientName}</strong>, this is a friendly reminder about your upcoming appointment.
    </p>

    ${appointmentBox(data)}

    <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:16px;margin:0 0 24px;">
      <p style="margin:0;color:#854d0e;font-size:14px;line-height:1.8;">
        📌 <strong>Please remember to:</strong><br/>
        • Bring any previous medical reports, X-rays, or prescriptions<br/>
        • Arrive 10–15 minutes before your scheduled time<br/>
        • Bring your National ID card
      </p>
    </div>

    ${actionButton('View My Appointments', `${CLINIC_URL}/dashboard`)}
  `);
}

// ============================================================
// 7. Reschedule Request Alert (to doctor)
// ============================================================

export function rescheduleRequestAlertHtml(data: AppointmentEmailData): string {
  return wrap('Patient Reschedule Request', `
    <h2 style="margin:0 0 8px;color:#0a2342;font-size:24px;font-weight:800;font-family:'Outfit',Arial,sans-serif;">
      🔄 Reschedule Request
    </h2>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
      <strong>${data.patientName}</strong> has requested to reschedule their appointment.
    </p>

    ${appointmentBox(data)}

    ${data.rescheduleNote ? `
    <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:16px;margin:0 0 24px;">
      <p style="margin:0;color:#854d0e;font-size:14px;"><strong>Patient's note:</strong> ${data.rescheduleNote}</p>
    </div>` : ''}

    <div style="background:#e8f7f9;border-radius:12px;padding:20px;margin:0 0 24px;">
      <p style="margin:0;color:#1a7a8a;font-size:15px;">
        📞 <a href="tel:${data.patientPhone}" style="color:#1a7a8a;font-weight:700;">${data.patientPhone}</a>
      </p>
    </div>

    ${actionButton('Manage in Admin Dashboard', `${CLINIC_URL}/admin`, '#0a2342')}
  `);
}
