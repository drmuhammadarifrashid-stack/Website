'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Please enter a valid email address';
    if (!/^(\+92|0)[0-9]{10}$/.test(form.phone.replace(/[\s\-()]/g, '')))
      errs.phone = 'Enter a valid Pakistani number (e.g. 03001234567)';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.replace(/[\s\-()]/g, ''),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else if (data.details) {
        const fieldErrs: FieldErrors = {};
        for (const [field, msgs] of Object.entries(data.details)) {
          fieldErrs[field as keyof FieldErrors] = (msgs as string[])[0];
        }
        setErrors(fieldErrs);
      } else {
        setErrors({ form: data.error || 'Registration failed. Please try again.' });
      }
    } catch {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.08)',
    border: `1.5px solid ${hasError ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.15)'}`,
    borderRadius: 'var(--radius-md)',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 60%, var(--color-navy-light) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '-15%', right: '-8%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,122,138,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,122,138,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-light) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', fontSize: '1.5rem',
              boxShadow: '0 8px 24px rgba(26,122,138,0.4)',
            }}
          >
            🏥
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'white', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.375rem' }}>
            Create Account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
            Register to book appointments with Dr. Arif
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div
            style={{
              background: 'rgba(5,150,105,0.15)',
              border: '1px solid rgba(5,150,105,0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              textAlign: 'center',
              color: '#6ee7b7',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Account Created!</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Redirecting you to login...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <input id="reg-name" type="text" value={form.name} onChange={handleChange('name')} placeholder="Muhammad Ali" required style={inputStyle(!!errors.name)} />
              {errors.name && <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <input id="reg-email" type="email" value={form.email} onChange={handleChange('email')} placeholder="you@example.com" required style={inputStyle(!!errors.email)} />
              {errors.email && <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="reg-phone" style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Phone Number
              </label>
              <input id="reg-phone" type="tel" value={form.phone} onChange={handleChange('phone')} placeholder="03001234567" required style={inputStyle(!!errors.phone)} />
              {errors.phone && <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Password
              </label>
              <input id="reg-password" type="password" value={form.password} onChange={handleChange('password')} placeholder="Min. 8 characters" required style={inputStyle(!!errors.password)} />
              {errors.password && <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Confirm Password
              </label>
              <input id="reg-confirm" type="password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder="••••••••" required style={inputStyle(!!errors.confirmPassword)} />
              {errors.confirmPassword && <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.confirmPassword}</p>}
            </div>

            {/* Form-level error */}
            {errors.form && (
              <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', color: '#fca5a5', fontSize: '0.875rem' }}>
                ⚠️ {errors.form}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem',
                background: loading ? 'rgba(26,122,138,0.5)' : 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-light) 100%)',
                border: 'none', borderRadius: 'var(--radius-md)',
                color: 'white', fontSize: '1rem', fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(26,122,138,0.4)',
                marginTop: '0.5rem', transition: 'all 0.2s',
              }}
            >
              {loading ? '⏳ Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        {!success && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--color-teal-light)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', textDecoration: 'none' }}>
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
