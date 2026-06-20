import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/user';

// ============================================================
// NextAuth Configuration
// ============================================================

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await dbConnect();

        // ── 1. Check if this is the admin account ──────────────
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          adminEmail &&
          adminPassword &&
          credentials.email.toLowerCase() === adminEmail.toLowerCase() &&
          credentials.password === adminPassword
        ) {
          return {
            id: 'admin',
            name: 'Dr. Arif (Admin)',
            email: adminEmail,
            role: 'admin',
          };
        }

        // ── 2. Look up patient in the database ─────────────────
        const user = await User.findByEmail(credentials.email);

        if (!user) {
          throw new Error('No account found with this email. Please register first.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
          throw new Error('Incorrect password. Please try again.');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'patient';
        token.phone = (user as { phone?: string }).phone ?? '';
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
