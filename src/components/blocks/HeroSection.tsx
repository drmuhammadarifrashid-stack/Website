import Image from 'next/image';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

type HeroSectionProps = {
  badgeText: string;
  titleTop: string;
  titleHighlight: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  stats?: Array<{ value: string; label: string; icon?: string }>;
  trustBadges?: string[];
};

export function HeroSection({
  badgeText,
  titleTop,
  titleHighlight,
  description,
  primaryButtonText = 'Book Appointment',
  primaryButtonHref = '/appointment',
  secondaryButtonText = 'Meet the Doctor →',
  secondaryButtonHref = '/about',
  imageUrl,
  imageAlt = 'Hero Image',
  stats,
  trustBadges,
}: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="hero-pattern" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', padding: '7rem 0 5rem' }} className="hero-grid">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <Badge variant="teal" style={{ marginBottom: '1.5rem' }}>
              {badgeText}
            </Badge>
            <h1 style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.15, fontFamily: 'Outfit, sans-serif' }}>
              {titleTop}<br />
              <span style={{ background: 'linear-gradient(135deg, var(--color-teal-light) 0%, #67e8f9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {titleHighlight}
              </span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '520px' }}>
              {description}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button href={primaryButtonHref} variant="teal" size="lg">
                📅 {primaryButtonText}
              </Button>
              <Button href={secondaryButtonHref} variant="secondary" size="lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                {secondaryButtonText}
              </Button>
            </div>

            {/* Trust Badges */}
            {trustBadges && (
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                {trustBadges.map((cert) => (
                  <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-teal-light)', fontSize: '0.85rem' }}>✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 500 }}>{cert}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Content */}
          {imageUrl && (
            <div className="animate-fade-in-up delay-200 hero-image-container" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 420, height: 500, maxWidth: '100%' }}>
                {/* Glow behind image */}
                <div style={{
                  position: 'absolute', inset: -20,
                  background: 'radial-gradient(ellipse, rgba(26,122,138,0.35) 0%, transparent 70%)',
                  borderRadius: '50%',
                }} />
                <div style={{
                  position: 'relative', width: '100%', height: '100%',
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '2px solid rgba(26,122,138,0.4)',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
                }}>
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    priority
                  />
                </div>

                {/* Floating stats */}
                {stats && stats.length > 0 && (
                  <div className="card-glass animate-float" style={{
                    position: 'absolute', bottom: -20, left: -30,
                    padding: '1rem 1.25rem', minWidth: 200,
                    background: 'rgba(10,35,66,0.85)',
                    border: '1px solid rgba(26,122,138,0.4)',
                  }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-light) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        {stats[0].icon || '🎖️'}
                      </div>
                      <div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif' }}>{stats[0].value}</div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{stats[0].label}</div>
                      </div>
                    </div>
                  </div>
                )}
                {stats && stats.length > 1 && (
                  <div className="card-glass" style={{
                    position: 'absolute', top: 30, right: -30,
                    padding: '0.875rem 1rem',
                    background: 'rgba(10,35,66,0.85)',
                    border: '1px solid rgba(26,122,138,0.4)',
                  }}>
                    <div style={{ color: 'var(--color-teal-light)', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Outfit, sans-serif' }}>{stats[1].value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>{stats[1].label}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wave */}
      <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="white"/>
        </svg>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; padding: 8rem 0 3rem !important; }
          .hero-image-container { display: none !important; }
        }
      `}</style>
    </section>
  );
}
