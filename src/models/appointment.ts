import mongoose, { Schema, Document, Model } from 'mongoose';
import type {
  Gender,
  AppointmentStatus,
  AppointmentLocation,
} from '@/types/appointment';

// ============================================================
// Mongoose Document Interface
// ============================================================

export interface IAppointment extends Document {
  // Patient link
  userId?: string;
  email?: string;
  // Patient info
  name: string;
  phone: string;
  age: number;
  gender: Gender;
  appointmentDate: string;
  appointmentTime: string;
  location: AppointmentLocation;
  reason: string;
  status: AppointmentStatus;
  rescheduleNote?: string;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  cancel(): Promise<IAppointment>;
  confirm(): Promise<IAppointment>;
  complete(): Promise<IAppointment>;
}

// ============================================================
// Mongoose Model Interface (for static methods)
// ============================================================

export interface IAppointmentModel extends Model<IAppointment> {
  findByPhone(phone: string): Promise<IAppointment[]>;
  findByStatus(status: AppointmentStatus): Promise<IAppointment[]>;
  findByLocation(location: AppointmentLocation): Promise<IAppointment[]>;
  findUpcoming(): Promise<IAppointment[]>;
  countByStatus(): Promise<Record<AppointmentStatus, number>>;
}

// ============================================================
// Validation helpers
// ============================================================

const PHONE_REGEX = /^(\+92|0)[0-9]{10}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

function isFutureDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) >= today;
}

// ============================================================
// Schema Definition
// ============================================================

const AppointmentSchema = new Schema<IAppointment, IAppointmentModel>(
  {
    // ── Patient Link ─────────────────────────────────────────
    userId: {
      type: String,
      index: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // ── Patient Information ──────────────────────────────────
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
      match: [
        /^[a-zA-Z\s'-]+$/,
        'Name can only contain letters, spaces, hyphens, and apostrophes',
      ],
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: (v: string) => PHONE_REGEX.test(v),
        message:
          'Phone must be a valid Pakistani number (e.g. 03001234567 or +923001234567)',
      },
    },

    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
      max: [120, 'Age cannot exceed 120'],
      validate: {
        validator: Number.isInteger,
        message: 'Age must be a whole number',
      },
    },

    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Male', 'Female', 'Other', 'Prefer not to say'] as Gender[],
        message: '{VALUE} is not a valid gender option',
      },
    },

    // ── Appointment Details ──────────────────────────────────
    appointmentDate: {
      type: String,
      required: [true, 'Appointment date is required'],
      validate: [
        {
          validator: isValidDate,
          message: 'Appointment date must be a valid date in YYYY-MM-DD format',
        },
        {
          validator: isFutureDate,
          message: 'Appointment date must be today or in the future',
        },
      ],
    },

    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required'],
      validate: {
        validator: (v: string) => TIME_REGEX.test(v),
        message: 'Appointment time must be in HH:MM (24-hour) format',
      },
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      enum: {
        values: [
          'Fauji Foundation Hospital',
          'Muhammad Ali Khan Orthopedic & Surgical Hospital',
          'Other',
        ] as AppointmentLocation[],
        message: '{VALUE} is not a valid clinic location',
      },
    },

    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      trim: true,
      minlength: [
        10,
        'Please provide at least 10 characters describing the reason',
      ],
      maxlength: [1000, 'Reason cannot exceed 1000 characters'],
    },

    // ── Status ───────────────────────────────────────────────
    status: {
      type: String,
      enum: {
        values: [
          'pending',
          'confirmed',
          'completed',
          'cancelled',
          'rescheduled_requested',
        ] as AppointmentStatus[],
        message: '{VALUE} is not a valid appointment status',
      },
      default: 'pending',
    },

    // ── Admin / Reschedule Notes ─────────────────────────────
    rescheduleNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Reschedule note cannot exceed 500 characters'],
    },

    adminNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Admin note cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,           // auto-manages createdAt & updatedAt
    collection: 'appointments', // explicit collection name
    versionKey: false,          // removes __v field
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(_doc: unknown, ret: Record<string, any>) {
        ret.id = (ret._id as { toString(): string }).toString();
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(_doc: unknown, ret: Record<string, any>) {
        ret.id = (ret._id as { toString(): string }).toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

// ============================================================
// Indexes
// ============================================================

AppointmentSchema.index({ location: 1, appointmentDate: 1 });
AppointmentSchema.index({ phone: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ appointmentDate: 1 });
AppointmentSchema.index({ name: 'text', reason: 'text' });

// ============================================================
// Pre-save middleware
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
AppointmentSchema.pre('save', function (next: any) {
  // Normalize phone: strip spaces, dashes, parentheses
  this.phone = this.phone.replace(/[\s\-()]/g, '');

  // Normalize name to title case
  this.name = this.name
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  next();
});

// ============================================================
// Instance Methods
// ============================================================

AppointmentSchema.methods.cancel = async function (): Promise<IAppointment> {
  this.status = 'cancelled';
  return this.save();
};

AppointmentSchema.methods.confirm = async function (): Promise<IAppointment> {
  this.status = 'confirmed';
  return this.save();
};

AppointmentSchema.methods.complete = async function (): Promise<IAppointment> {
  this.status = 'completed';
  return this.save();
};

// ============================================================
// Static Methods
// ============================================================

AppointmentSchema.statics.findByPhone = function (
  phone: string
): Promise<IAppointment[]> {
  return this.find({ phone }).sort({ appointmentDate: -1 });
};

AppointmentSchema.statics.findByStatus = function (
  status: AppointmentStatus
): Promise<IAppointment[]> {
  return this.find({ status }).sort({ appointmentDate: 1, appointmentTime: 1 });
};

AppointmentSchema.statics.findByLocation = function (
  location: AppointmentLocation
): Promise<IAppointment[]> {
  return this.find({ location }).sort({
    appointmentDate: 1,
    appointmentTime: 1,
  });
};

AppointmentSchema.statics.findUpcoming = function (): Promise<IAppointment[]> {
  const today = new Date().toISOString().split('T')[0];
  return this.find({
    appointmentDate: { $gte: today },
    status: { $in: ['pending', 'confirmed'] },
  }).sort({ appointmentDate: 1, appointmentTime: 1 });
};

AppointmentSchema.statics.countByStatus = async function (): Promise<
  Record<AppointmentStatus, number>
> {
  const results = await this.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const counts: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const r of results) {
    counts[r._id as string] = r.count as number;
  }
  return counts as Record<AppointmentStatus, number>;
};

// ============================================================
// Model export — Next.js hot-reload safe
// ============================================================

const Appointment =
  (mongoose.models.Appointment as IAppointmentModel) ||
  mongoose.model<IAppointment, IAppointmentModel>(
    'Appointment',
    AppointmentSchema
  );

export default Appointment;
