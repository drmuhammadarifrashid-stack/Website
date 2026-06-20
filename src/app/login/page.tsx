'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      // Redirect based on role (admin goes to /admin, patient to /dashboard)
      router.push('/dashboard');
      router.refresh();
    }
  };

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
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,122,138,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,122,138,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-light) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem',
              boxShadow: '0 8px 24px rgba(26,122,138,0.4)',
            }}
          >
            🏥
          </div>
          <h1
            style={{
              fontFamily: 'Outfit, sans-serif',
              color: 'white',
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '0.375rem',
            }}
          >
            Welcome Back
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
            Sign in to your patient account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-teal-light)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-teal-light)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: 'rgba(220,38,38,0.15)',
                border: '1px solid rgba(220,38,38,0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                color: '#fca5a5',
                fontSize: '0.875rem',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: loading
                ? 'rgba(26,122,138,0.5)'
                : 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-light) 100%)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(26,122,138,0.4)',
              marginTop: '0.5rem',
            }}
          >
            {loading ? '⏳ Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ textAlign: 'center', margin: '1.5rem 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            style={{ color: 'var(--color-teal-light)', fontWeight: 600, textDecoration: 'none' }}
          >
            Register now
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '0.75rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
