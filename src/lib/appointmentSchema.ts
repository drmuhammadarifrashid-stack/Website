import { z } from 'zod';

// ─── Constants ────────────────────────────────────────────────
export const LOCATIONS = [
  'Fauji Foundation Hospital',
  'Muhammad Ali Khan Orthopedic & Surgical Hospital',
] as const;

export const GENDERS = [
  'Male',
  'Female',
  'Other',
  'Prefer not to say',
] as const;

export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
] as const;

export const TIME_SLOT_LABELS: Record<string, string> = {
  '09:00': '9:00 AM',
  '09:30': '9:30 AM',
  '10:00': '10:00 AM',
  '10:30': '10:30 AM',
  '11:00': '11:00 AM',
  '11:30': '11:30 AM',
  '12:00': '12:00 PM',
  '12:30': '12:30 PM',
  '13:00': '1:00 PM',
  '14:00': '2:00 PM',
  '14:30': '2:30 PM',
  '15:00': '3:00 PM',
  '15:30': '3:30 PM',
  '16:00': '4:00 PM',
  '17:00': '5:00 PM',
  '17:30': '5:30 PM',
  '18:00': '6:00 PM',
  '18:30': '6:30 PM',
  '19:00': '7:00 PM',
  '19:30': '7:30 PM',
  '20:00': '8:00 PM',
};

// ─── Zod Schema ───────────────────────────────────────────────
export const appointmentSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .transform((v) =>
      v.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    ),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .transform((v) => v.replace(/[\s\-()]/g, ''))
    .refine(
      (v) => /^(\+92|0)[0-9]{10}$/.test(v),
      'Enter a valid Pakistani number (e.g. 03001234567)'
    ),

  age: z
    .number({ message: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(0, 'Age cannot be negative')
    .max(120, 'Age cannot exceed 120'),

  gender: z.enum(GENDERS, {
    message: 'Please select a gender',
  }),

  location: z.enum(LOCATIONS, {
    message: 'Please select a location',
  }),

  appointmentDate: z
    .string()
    .min(1, 'Appointment date is required')
    .refine((v) => {
      const date = new Date(v);
      return !isNaN(date.getTime());
    }, 'Invalid date')
    .refine((v) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(v) >= today;
    }, 'Date must be today or in the future'),

  appointmentTime: z.enum(TIME_SLOTS, {
    message: 'Please select a time slot',
  }),

  reason: z
    .string()
    .min(1, 'Please describe the reason for your visit')
    .min(10, 'Please provide at least 10 characters')
    .max(1000, 'Reason cannot exceed 1000 characters'),
});

export type AppointmentFormValues = z.input<typeof appointmentSchema>;
export type AppointmentFormOutput = z.output<typeof appointmentSchema>;
