import type { Metadata } from 'next';
import { AppointmentForm } from '@/components/forms/AppointmentForm';

export const metadata: Metadata = {
  title: 'Book Appointment | Dr. Arif – Pain Specialist Lahore',
  description:
    'Book an in-person consultation with Dr. Arif, Consultant Anesthesiologist & Pain Physician, at Fauji Foundation Hospital or Muhammad Ali Khan Orthopedic Hospital, Lahore.',
  openGraph: {
    title: 'Book an Appointment with Dr. Arif',
    description:
      'Specialist in Chronic Pain Management, Interventional Procedures & Perioperative Care.',
  },
};

export default function AppointmentPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        style={{
          background:
            'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 100%)',
          paddingTop: '7rem',
          paddingBottom: '3.5rem',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <div
            className="badge"
            style={{
              background: 'rgba(26,122,138,0.3)',
              color: 'var(--color-teal-light)',
              marginBottom: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            📅 Appointment Booking
          </div>

          <h1
            style={{
              fontFamily: 'Outfit, sans-serif',
              color: 'white',
              fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.875rem',
              lineHeight: 1.2,
            }}
          >
            Book Your Consultation
          </h1>

          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 520,
              margin: '0 auto 1.5rem',
              lineHeight: 1.7,
            }}
          >
            Fill in the form below. Our team will confirm your appointment within{' '}
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>24 hours</strong>{' '}
            via phone call.
          </p>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: '🔒', label: 'Confidential' },
              { icon: '📞', label: '24h Confirmation' },
              { icon: '🏥', label: 'In-Person Only' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.65)',
                  fontWeight: 500,
                }}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form Section ──────────────────────────────────────── */}
      <section
        className="section-padding"
        style={{ background: 'var(--color-off-white)' }}
      >
        <div className="container">
          <AppointmentForm />
        </div>
      </section>
    </>
  );
}
