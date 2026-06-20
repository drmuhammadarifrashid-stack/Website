'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

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
  const { data: session, status } = useSession();

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="desktop-nav">
              {status === 'authenticated' ? (
                <>
                  <Link href={session?.user?.role === 'admin' ? '/admin' : '/dashboard'} style={{ color: 'var(--color-teal-light)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                    Dashboard
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-teal-light)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}>
                  Login
                </Link>
              )}
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
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {status === 'authenticated' ? (
              <>
                <Link href={session?.user?.role === 'admin' ? '/admin' : '/dashboard'} className="btn" style={{ width: '100%', background: 'rgba(26,122,138,0.2)', color: 'var(--color-teal-light)', textAlign: 'center', padding: '0.75rem' }}>
                  Dashboard
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="btn" style={{ width: '100%', background: 'rgba(220,38,38,0.1)', color: '#f87171', textAlign: 'center', padding: '0.75rem', border: 'none' }}>
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="btn" style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'center', padding: '0.75rem' }}>
                Login
              </Link>
            )}
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
