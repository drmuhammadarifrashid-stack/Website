'use client';

import { useState } from 'react';
import Link from 'next/link';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
      else {
        const d = await res.json();
        setError(d.error || 'Failed to send message.');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.75rem' }}>Message Sent!</h3>
        <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Thank you for reaching out. Our team will get back to you within 24 business hours.
        </p>
        <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="btn btn-secondary">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '2.5rem' }}>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
        Send a Message
      </h2>
      <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
        For appointment bookings, please use our <Link href="/appointment" style={{ color: 'var(--color-teal)', fontWeight: 600 }}>Appointment page</Link>.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="contact-form-grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+92 300..." />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input type="email" className="form-input" required value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Subject *</label>
          <select className="form-select" required value={form.subject} onChange={e => update('subject', e.target.value)}>
            <option value="">Select a subject...</option>
            <option>Appointment Inquiry</option>
            <option>Service Information</option>
            <option>Clinic Location & Hours</option>
            <option>Insurance & Payment</option>
            <option>Medical Records</option>
            <option>General Inquiry</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Message *</label>
          <textarea className="form-textarea" required rows={5} value={form.message} onChange={e => update('message', e.target.value)} placeholder="Write your message here... (Please do not include personal medical details)" />
        </div>

        {error && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '0.875rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>❌ {error}</div>}

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
          {loading ? '⏳ Sending...' : '📨 Send Message'}
        </button>
      </form>

      <style>{`
        @media (max-width: 600px) {
          .contact-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
