import { ContactForm } from '@/components/forms/ContactForm';

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 100%)', paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ background: 'rgba(26,122,138,0.3)', color: 'var(--color-teal-light)', marginBottom: '1rem' }}>
            📬 Get in Touch
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Contact Us
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 520, margin: '0 auto' }}>
            Have a question? Reach out to our team. We typically respond within 24 hours on working days.
          </p>
        </div>
      </section>

      {/* Emergency Banner */}
      <div style={{ background: '#dc2626', padding: '0.75rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>
            🚨 Medical Emergency? Do NOT use this contact form. Call <strong>1122</strong> or go to the nearest emergency room immediately.
          </p>
        </div>
      </div>

      <section className="section-padding" style={{ background: 'var(--color-off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'flex-start' }} className="contact-grid">
            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '1.75rem' }}>
                Contact Information
              </h2>

              {[
                { icon: '📍', label: 'Main Clinic', value: '123 Main Boulevard, Gulberg III, Lahore, Pakistan' },
                { icon: '📞', label: 'Phone', value: '+92 300 123 4567' },
                { icon: '📧', label: 'Email', value: 'info@painspecialist.pk' },
                { icon: '⏰', label: 'Working Hours', value: 'Mon, Wed, Fri: 9AM–1PM\nTue, Thu: 5PM–8PM\nSat: 10AM–2PM' },
              ].map((item) => (
                <div key={item.label} className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', marginBottom: 3 }}>{item.label}</div>
                    <div style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.value}</div>
                  </div>
                </div>
              ))}

              <div style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', borderRadius: 16, padding: '1.5rem', color: 'white', marginTop: '1.5rem' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>💬 Chat on WhatsApp</div>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '1rem', lineHeight: 1.6 }}>
                  The fastest way to reach us for appointment bookings or quick queries.
                </p>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ background: 'white', color: '#128C7E', fontWeight: 700 }}>
                  Start Chat →
                </a>
              </div>

              <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 12, padding: '1rem 1.25rem', marginTop: '1.5rem', fontSize: '0.8rem', color: '#92400e', lineHeight: 1.6 }}>
                <strong>⚠️ Disclaimer:</strong> This contact form is for general inquiries only. Dr. Arif does not provide medical advice or treatment via email or online. All consultations are in-person only.
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
