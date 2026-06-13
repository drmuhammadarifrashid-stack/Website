import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentFilters,
  PaginationOptions,
  PaginatedAppointments,
  ValidationResult,
  ValidationError,
  AppointmentStatus,
  AppointmentLocation,
  Gender,
  IAppointmentDocument,
} from '@/types/appointment';
import Appointment, { IAppointment } from '@/models/appointment';
import dbConnect from '@/lib/db';

// ============================================================
// Client-side Validation (runs before API call)
// ============================================================

const PHONE_REGEX = /^(\+92|0)[0-9]{10}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function validateAppointmentInput(
  data: Partial<CreateAppointmentInput>
): ValidationResult {
  const errors: ValidationError[] = [];

  // Name
  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Patient name is required' });
  } else if (data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name cannot exceed 100 characters' });
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.name)) {
    errors.push({ field: 'name', message: 'Name contains invalid characters' });
  }

  // Phone
  if (!data.phone?.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!PHONE_REGEX.test(data.phone.replace(/[\s\-()]/g, ''))) {
    errors.push({
      field: 'phone',
      message: 'Enter a valid Pakistani number (e.g. 03001234567)',
    });
  }

  // Age
  if (data.age === undefined || data.age === null) {
    errors.push({ field: 'age', message: 'Age is required' });
  } else if (!Number.isInteger(data.age) || data.age < 0 || data.age > 120) {
    errors.push({ field: 'age', message: 'Age must be a whole number between 0 and 120' });
  }

  // Gender
  const validGenders: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say'];
  if (!data.gender) {
    errors.push({ field: 'gender', message: 'Gender is required' });
  } else if (!validGenders.includes(data.gender)) {
    errors.push({ field: 'gender', message: 'Invalid gender selection' });
  }

  // Appointment Date
  if (!data.appointmentDate) {
    errors.push({ field: 'appointmentDate', message: 'Appointment date is required' });
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const date = new Date(data.appointmentDate);
    if (!dateRegex.test(data.appointmentDate) || isNaN(date.getTime())) {
      errors.push({ field: 'appointmentDate', message: 'Invalid date format (use YYYY-MM-DD)' });
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        errors.push({ field: 'appointmentDate', message: 'Date must be today or in the future' });
      }
    }
  }

  // Appointment Time
  if (!data.appointmentTime) {
    errors.push({ field: 'appointmentTime', message: 'Appointment time is required' });
  } else if (!TIME_REGEX.test(data.appointmentTime)) {
    errors.push({ field: 'appointmentTime', message: 'Time must be in HH:MM format (24-hour)' });
  }

  // Location
  const validLocations: AppointmentLocation[] = [
    'Fauji Foundation Hospital',
    'Muhammad Ali Khan Orthopedic & Surgical Hospital',
    'Other',
  ];
  if (!data.location) {
    errors.push({ field: 'location', message: 'Location is required' });
  } else if (!validLocations.includes(data.location)) {
    errors.push({ field: 'location', message: 'Invalid location selected' });
  }

  // Reason
  if (!data.reason?.trim()) {
    errors.push({ field: 'reason', message: 'Reason for appointment is required' });
  } else if (data.reason.trim().length < 10) {
    errors.push({ field: 'reason', message: 'Please provide at least 10 characters for the reason' });
  } else if (data.reason.trim().length > 1000) {
    errors.push({ field: 'reason', message: 'Reason cannot exceed 1000 characters' });
  }

  return { isValid: errors.length === 0, errors };
}

// ============================================================
// Server-side CRUD Utilities
// ============================================================

/**
 * Create a new appointment
 */
export async function createAppointment(
  data: CreateAppointmentInput
): Promise<IAppointment> {
  await dbConnect();
  const appointment = new Appointment(data);
  return appointment.save();
}

/**
 * Get a single appointment by ID
 */
export async function getAppointmentById(
  id: string
): Promise<IAppointment | null> {
  await dbConnect();
  return Appointment.findById(id).exec();
}

/**
 * Get paginated, filtered list of appointments
 */
export async function getAppointments(
  filters: AppointmentFilters = {},
  pagination: PaginationOptions = {}
): Promise<PaginatedAppointments> {
  await dbConnect();

  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = pagination;

  // Build query filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = {};

  if (filters.status) query.status = filters.status;
  if (filters.location) query.location = filters.location;
  if (filters.gender) query.gender = filters.gender;

  if (filters.dateFrom || filters.dateTo) {
    query.appointmentDate = {};
    if (filters.dateFrom) query.appointmentDate.$gte = filters.dateFrom;
    if (filters.dateTo) query.appointmentDate.$lte = filters.dateTo;
  }

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { phone: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const sortDirection = sortOrder === 'asc' ? 1 : -1;

  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .exec(),
    Appointment.countDocuments(query).exec(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    appointments: appointments.map((a) => a.toObject() as unknown as IAppointmentDocument),
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Update an appointment by ID
 */
export async function updateAppointment(
  id: string,
  data: UpdateAppointmentInput
): Promise<IAppointment | null> {
  await dbConnect();
  return Appointment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();
}

/**
 * Delete an appointment by ID
 */
export async function deleteAppointment(
  id: string
): Promise<IAppointment | null> {
  await dbConnect();
  return Appointment.findByIdAndDelete(id).exec();
}

/**
 * Update appointment status
 */
export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<IAppointment | null> {
  await dbConnect();
  return Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).exec();
}

/**
 * Get upcoming appointments
 */
export async function getUpcomingAppointments(): Promise<IAppointment[]> {
  await dbConnect();
  return Appointment.findUpcoming();
}

/**
 * Get appointment count by status (dashboard stats)
 */
export async function getAppointmentStats(): Promise<
  Record<AppointmentStatus, number>
> {
  await dbConnect();
  return Appointment.countByStatus();
}

/**
 * Get all appointments for a specific phone number (patient history)
 */
export async function getPatientHistory(phone: string): Promise<IAppointment[]> {
  await dbConnect();
  return Appointment.findByPhone(phone);
}

/**
 * Check for scheduling conflicts (same location, date, time)
 */
export async function checkSchedulingConflict(
  location: AppointmentLocation,
  date: string,
  time: string,
  excludeId?: string
): Promise<boolean> {
  await dbConnect();
  const query: Record<string, unknown> = {
    location,
    appointmentDate: date,
    appointmentTime: time,
    status: { $in: ['pending', 'confirmed'] },
  };
  if (excludeId) query._id = { $ne: excludeId };
  const count = await Appointment.countDocuments(query).exec();
  return count > 0;
}
