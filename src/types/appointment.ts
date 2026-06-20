// ============================================================
// TypeScript Types – Appointment Collection
// ============================================================

/** Allowed gender values */
export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

/** Appointment lifecycle status */
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled_requested';

/** Available clinic / hospital locations */
export type AppointmentLocation =
  | 'Fauji Foundation Hospital'
  | 'Muhammad Ali Khan Orthopedic & Surgical Hospital'
  | 'Other';

// ─────────────────────────────────────────────
// Core document shape (mirrors Mongoose schema)
// ─────────────────────────────────────────────

/** Raw appointment as stored in MongoDB */
export interface IAppointmentDocument {
  _id: string;
  // Patient link (set when logged-in user books)
  userId?: string;
  email?: string;            // patient email for notifications
  name: string;
  phone: string;
  age: number;
  gender: Gender;
  appointmentDate: string;   // ISO date string "YYYY-MM-DD"
  appointmentTime: string;   // "HH:MM" 24-hour format
  location: AppointmentLocation;
  reason: string;
  status: AppointmentStatus;
  rescheduleNote?: string;   // patient's note when requesting reschedule
  adminNote?: string;        // admin note when rescheduling
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// API payload types
// ─────────────────────────────────────────────

/** Payload sent by the client when creating an appointment */
export type CreateAppointmentInput = Omit<
  IAppointmentDocument,
  '_id' | 'status' | 'createdAt' | 'updatedAt'
>;

/** Payload allowed when updating an appointment */
export type UpdateAppointmentInput = Partial<
  Omit<IAppointmentDocument, '_id' | 'createdAt' | 'updatedAt'>
>;

// ─────────────────────────────────────────────
// API response types
// ─────────────────────────────────────────────

/** Standard success response */
export interface ApiSuccessResponse<T = IAppointmentDocument> {
  success: true;
  data: T;
  message?: string;
}

/** Standard error response */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T = IAppointmentDocument> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

// ─────────────────────────────────────────────
// Utility / filter types
// ─────────────────────────────────────────────

/** Query filters for listing appointments */
export interface AppointmentFilters {
  status?: AppointmentStatus;
  location?: AppointmentLocation;
  gender?: Gender;
  dateFrom?: string;
  dateTo?: string;
  search?: string;   // searches name / phone
}

/** Pagination options */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: keyof IAppointmentDocument;
  sortOrder?: 'asc' | 'desc';
}

/** Paginated list response */
export interface PaginatedAppointments {
  appointments: IAppointmentDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─────────────────────────────────────────────
// Validation error shape
// ─────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
