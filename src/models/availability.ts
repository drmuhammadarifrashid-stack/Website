import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAvailability extends Document {
  date: string; // YYYY-MM-DD format
  location: 'Fauji Foundation Hospital' | 'Muhammad Ali Khan Orthopedic & Surgical Hospital' | 'Other';
  isBlocked: boolean;
  blockedReason?: string;
  workingHours?: {
    start: string; // HH:MM (24h)
    end: string;   // HH:MM (24h)
  };
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    date: {
      type: String,
      required: [true, 'Date is required'],
      validate: {
        validator: function (v: string) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid date format (YYYY-MM-DD)!`,
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      enum: {
        values: ['Fauji Foundation Hospital', 'Muhammad Ali Khan Orthopedic & Surgical Hospital', 'Other'],
        message: '{VALUE} is not a supported clinic location',
      },
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedReason: {
      type: String,
      default: '',
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '17:00',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index so that we only have one configuration per date + location
AvailabilitySchema.index({ date: 1, location: 1 }, { unique: true });

const Availability: Model<IAvailability> =
  mongoose.models.Availability || mongoose.model<IAvailability>('Availability', AvailabilitySchema);

export default Availability;
