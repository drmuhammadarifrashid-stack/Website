import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Practice Locations | Dr. Muhammad Arif Rashid',
  description: 'Find Dr. Muhammad Arif Rashid at Fauji Foundation Hospital and Muhammad Ali Khan Orthopedic & Surgical Hospital in Lahore, Pakistan.',
};

const locations = [
  {
    id: 1,
    name: 'Fauji Foundation Hospital',
    type: 'Hospital Consultation',
    address: 'Bedian Rd, near Askari 3, Cantt, Lahore, Pakistan',
    phone: '+92 304 455 0048',
    email: 'drmuhammadarifrashid@gmail.com',
    schedule: [
      { day: 'Monday', hours: '4:00 PM – 8:00 PM' },
      { day: 'Wednesday', hours: '4:00 PM – 8:00 PM' },
      { day: 'Friday', hours: '4:00 PM – 8:00 PM' },
    ],
    daysAvailable: 'Mon, Wed, Fri',
    mapUrl: 'https://maps.google.com/?q=Fauji+Foundation+Hospital+Bedian+Road+Lahore',
    icon: '🏨',
    color: '#2563eb',
    bg: '#eff6ff',
    features: ['Inpatient & Outpatient', 'State-of-the-art Imaging', '24/7 Emergency', 'Ample Parking'],
  },
  {
    id: 2,
    name: 'Muhammad Ali Khan Orthopedic & Surgical Hospital',
    type: 'Private Clinic',
    address: 'Ferozpur Rd, Qainchi Amar Sidhu, Lahore, Pakistan',
    phone: '+92 304 455 0048',
    email: 'drmuhammadarifrashid@gmail.com',
    schedule: [
      { day: 'Tuesday', hours: '5:00 PM – 9:00 PM' },
      { day: 'Thursday', hours: '5:00 PM – 9:00 PM' },
      { day: 'Saturday', hours: '10:00 AM – 2:00 PM' },
    ],
    daysAvailable: 'Tue, Thu, Sat',
    mapUrl: 'https://maps.google.com/?q=Muhammad+Ali+Khan+Orthopedic+Hospital+Ferozpur+Road+Lahore',
    icon: '🏥',
    color: 'var(--color-teal)',
    bg: 'var(--color-teal-lighter)',
    features: ['Dedicated Pain Clinic', 'Procedure Suite', 'Fluoroscopy Equipment', 'Comfortable Lounge'],
  },
];

export default function LocationsPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 100%)', paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ background: 'rgba(26,122,138,0.3)', color: 'var(--color-teal-light)', marginBottom: '1rem' }}>
            📍 Where to Find Us
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Practice Locations
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: 580, margin: '0 auto' }}>
            Dr. Arif practices at premium hospitals and clinics across Lahore for your convenience. All consultations are in-person only.
          </p>
        </div>
      </section>

      <div style={{ background: '#fff7ed', borderBottom: '1px solid #fed7aa', padding: '1rem 0' }}>
        <div className="container">
          <p style={{ color: '#92400e', fontSize: '0.9rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span>⚠️</span>
            <strong>Important:</strong> This is not a telemedicine service. All consultations require an in-person clinic or hospital visit.
          </p>
        </div>
      </div>

      <section className="section-padding" style={{ background: 'var(--color-off-white)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {locations.map((loc) => (
              <div key={loc.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '0', background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }} className="location-grid">
                
                {/* Info Side */}
                <div style={{ padding: '3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '0.75rem', background: loc.bg, color: loc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                      {loc.icon}
                    </div>
                    <div>
                      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--color-navy)', fontSize: '1.75rem', lineHeight: 1.2 }}>{loc.name}</h2>
                      <span style={{ color: loc.color, fontWeight: 600, fontSize: '0.9rem' }}>{loc.type}</span>
                    </div>
                  </div>

                  <p style={{ color: 'var(--color-gray-600)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ marginTop: '0.1rem' }}>📍</span> 
                    {loc.address}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                      <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--color-navy)', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '0.5rem' }}>Timings & Days</h4>
                      <div style={{ color: 'var(--color-teal)', fontWeight: 700, marginBottom: '0.5rem' }}>Available: {loc.daysAvailable}</div>
                      {loc.schedule.map((s) => (
                        <div key={s.day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                          <span style={{ color: 'var(--color-gray-600)' }}>{s.day}</span>
                          <span style={{ color: 'var(--color-navy)', fontWeight: 500 }}>{s.hours}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--color-navy)', fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '0.5rem' }}>Facilities</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {loc.features.map((f) => (
                          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: loc.color }}>✓</span>
                            <span style={{ color: 'var(--color-gray-700)', fontSize: '0.95rem' }}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Button href="/appointment" variant="primary" style={{ background: loc.color }}>
                      📅 Book Appointment
                    </Button>
                    <Button href={`https://wa.me/${whatsappNumber}`} variant="whatsapp">
                      💬 WhatsApp Us
                    </Button>
                  </div>
                </div>

                {/* Map/Visual Side */}
                <div style={{ background: loc.bg, padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: `4px solid ${loc.color}` }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--color-navy)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Get Directions</h3>
                    <p style={{ color: 'var(--color-gray-600)', fontSize: '0.95rem', maxWidth: 250, margin: '0 auto' }}>
                      Navigate directly to the clinic using Google Maps for accurate routing.
                    </p>
                  </div>
                  <a 
                    href={loc.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn" 
                    style={{ background: 'white', color: loc.color, border: `1.5px solid ${loc.color}`, width: '100%', textAlign: 'center', fontWeight: 600 }}
                  >
                    Open Google Maps
                  </a>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 992px) {
          .location-grid { grid-template-columns: 1fr !important; }
          .location-grid > div:last-child { border-left: none !important; border-top: 4px solid var(--color-teal); padding: 2rem !important; }
        }
      `}</style>
    </>
  );
}
