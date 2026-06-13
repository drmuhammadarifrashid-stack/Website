'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Doctor' },
  { href: '/services', label: 'Services' },
  { href: '/locations', label: 'Practice Locations' },
  { href: '/appointment', label: 'Appointments' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Force solid on non-home pages
  const isHome = pathname === '/';
  const solid = scrolled || !isHome || mobileOpen;

  return (
    <>
      <nav className={`navbar ${solid ? 'navbar-solid' : 'navbar-transparent'}`}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{
                width: 40, height: 40,
                background: 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-light) 100%)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', fontWeight: 800, color: 'white',
                fontFamily: 'Outfit, sans-serif',
              }}>
                DR
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif', lineHeight: 1.2 }}>
                  Dr. Muhammad Arif
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Pain Specialist
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', listStyle: 'none', margin: 0, padding: 0 }}
              className="desktop-nav">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: pathname === link.href ? 'var(--color-teal-light)' : 'rgba(255,255,255,0.85)',
                      fontWeight: pathname === link.href ? 600 : 400,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 8,
                      transition: 'all 0.2s ease',
                      display: 'block',
                      borderBottom: pathname === link.href ? '2px solid var(--color-teal-light)' : '2px solid transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
              <Link href="/appointment" className="btn btn-teal btn-sm">
                Book Appointment
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'none', flexDirection: 'column', gap: 5, padding: '0.5rem',
              }}
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  display: 'block', width: 24, height: 2,
                  background: 'white', borderRadius: 2,
                  transition: 'all 0.3s ease',
                  transform: mobileOpen
                    ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                      : i === 1 ? 'scaleX(0)'
                        : 'rotate(-45deg) translate(5px, -5px)'
                    : 'none',
                }} />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 72, left: 0, right: 0, bottom: 0,
          background: 'rgba(6,21,40,0.98)', backdropFilter: 'blur(12px)',
          zIndex: 999, padding: '2rem 1.5rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: pathname === link.href ? 'var(--color-teal-light)' : 'rgba(255,255,255,0.85)',
                fontWeight: pathname === link.href ? 600 : 400,
                fontSize: '1.1rem',
                textDecoration: 'none',
                padding: '0.875rem 1rem',
                borderRadius: 10,
                borderLeft: pathname === link.href ? '3px solid var(--color-teal)' : '3px solid transparent',
                background: pathname === link.href ? 'rgba(26,122,138,0.12)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '1rem' }}>
            <Link href="/appointment" className="btn btn-teal" style={{ width: '100%' }}>
              📅 Book Appointment
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
