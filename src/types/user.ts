// ============================================================
// TypeScript Types – User Collection
// ============================================================

export type UserRole = 'patient' | 'admin';

export interface IUserDocument {
  _id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}
