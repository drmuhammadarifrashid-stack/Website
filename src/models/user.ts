import mongoose, { Schema, Document, Model } from 'mongoose';
import type { UserRole } from '@/types/user';

// ============================================================
// Mongoose Document Interface
// ============================================================

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

// ============================================================
// Schema Definition
// ============================================================

const UserSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: (v: string) => /^(\+92|0)[0-9]{10}$/.test(v.replace(/[\s\-()]/g, '')),
        message: 'Phone must be a valid Pakistani number (e.g. 03001234567)',
      },
    },

    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },

    role: {
      type: String,
      enum: ['patient', 'admin'] as UserRole[],
      default: 'patient',
    },
  },
  {
    timestamps: true,
    collection: 'users',
    versionKey: false,
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(_doc: unknown, ret: Record<string, any>) {
        ret.id = (ret._id as { toString(): string }).toString();
        delete ret._id;
        delete ret.passwordHash; // never expose hash
        return ret;
      },
    },
  }
);

// ============================================================
// Indexes
// ============================================================

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });

// ============================================================
// Static Methods
// ============================================================

UserSchema.statics.findByEmail = function (email: string): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase().trim() }).exec();
};

// ============================================================
// Model export — Next.js hot-reload safe
// ============================================================

const User =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
