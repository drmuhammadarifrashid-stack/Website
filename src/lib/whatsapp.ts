export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
}

export function generateWhatsAppLink(message: string, phoneNumber?: string): string {
  const number = phoneNumber || getWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export interface AppointmentDetails {
  name: string;
  phone: string;
  date: string;
}

export function getAppointmentRequestMessage(details?: AppointmentDetails): string {
  if (!details) {
    return 'Hello Doctor,\n\nI would like to book an appointment.';
  }

  return `Hello Doctor,

I would like to book an appointment.

Name: ${details.name}
Phone: ${details.phone}
Preferred Date: ${details.date}`;
}
