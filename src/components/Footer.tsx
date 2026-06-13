'use client';

import Link from 'next/link';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Doctor' },
  { href: '/services', label: 'Services' },
  { href: '/locations', label: 'Practice Locations' },
  { href: '/appointment', label: 'Book Appointment' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

const services = [
  'Chronic Pain Management',
  'Interventional Pain Procedures',
  'Perioperative Optimization',
  'Postoperative Pain Management',
  'Back & Spine Pain',
  'Cancer Pain Management',
];

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>

          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: 44, height: 44,
                background: 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-light) 100%)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', fontWeight: 800, color: 'white', fontFamily: 'Outfit, sans-serif',
              }}>DR</div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontFamily: 'Outfit, sans-serif', fontSize: '1rem' }}>
                  Dr. Muhammad Arif Rashid
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Consultant Anesthesiologist
                </div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Dedicated to relieving pain and improving the quality of life for patients through evidence-based interventional techniques and compassionate care.
            </p>

            {/* Disclaimer */}
            <div className="footer-disclaimer">
              <strong style={{ color: '#f87171' }}>⚠️ Medical Disclaimer:</strong> This website is for informational and appointment scheduling purposes only. Dr. Muhammad Arif Rashid does not provide online consultations or medical treatments through this platform. In case of a medical emergency, please call 1122 or visit the nearest hospital immediately.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontFamily: 'Outfit, sans-serif', marginBottom: '1.25rem', fontSize: '1rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{
                    color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                    fontSize: '0.875rem', transition: 'color 0.2s ease',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-teal-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    <span style={{ color: 'var(--color-teal)', fontSize: '0.7rem' }}>▶</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontFamily: 'Outfit, sans-serif', marginBottom: '1.25rem', fontSize: '1rem' }}>
              Our Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {services.map((s) => (
                <li key={s}>
                  <Link href="/services" style={{
                    color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                    fontSize: '0.875rem', transition: 'color 0.2s ease',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-teal-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    <span style={{ color: 'var(--color-teal)', fontSize: '0.7rem' }}>▶</span>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontFamily: 'Outfit, sans-serif', marginBottom: '1.25rem', fontSize: '1rem' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: '📍', label: 'Location', value: 'Lahore, Pakistan' },
                { icon: '📞', label: 'Phone', value: '+92 304 455 0048' },
                { icon: '📧', label: 'Email', value: 'drmuhammadarifrashid@gmail.com' },
                { icon: '⏰', label: 'Hours', value: 'Mon–Sat: 9AM – 6PM' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginTop: 2 }}>{item.value}</div>
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
                style={{ marginTop: '0.5rem' }}
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Dr. Muhammad Arif Rashid. All rights reserved.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
            This is not a telemedicine platform. Clinic visits only.
          </p>
        </div>
      </div>
    </footer>
  );
}
