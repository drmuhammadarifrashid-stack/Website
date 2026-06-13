import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '../ui/badge';

type DoctorProfileCardProps = {
  imageUrl: string;
  imageAlt: string;
  name: string;
  title: string;
  qualifications: string[];
  bioParagraphs: string[];
  badges: Array<{ label: string; icon: string }>;
  linkHref?: string;
  linkText?: string;
  compact?: boolean;
};

export function DoctorProfileCard({
  imageUrl,
  imageAlt,
  name,
  title,
  qualifications,
  bioParagraphs,
  badges,
  linkHref,
  linkText = 'Read Full Biography →',
  compact = false,
}: DoctorProfileCardProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr 1.5fr' : '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="doctor-profile-grid">
      {/* Image Side */}
      <div style={{ position: 'relative' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', height: compact ? 400 : 480, position: 'relative', boxShadow: 'var(--shadow-xl)' }}>
          <Image src={imageUrl} alt={imageAlt} fill style={{ objectFit: 'cover' }} />
        </div>
        {!compact && qualifications.length > 0 && (
          <div style={{
            position: 'absolute', bottom: -24, right: -24,
            background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)',
            borderRadius: 16, padding: '1.5rem 2rem', textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <div style={{ color: 'var(--color-teal-light)', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem' }}>{qualifications[0]}</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', marginTop: 2 }}>{qualifications[1] || 'Specialist'}</div>
          </div>
        )}
      </div>

      {/* Text Side */}
      <div>
        <Badge variant="teal" style={{ marginBottom: '1rem' }}>About the Doctor</Badge>
        <h2 className="section-title" style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
          {name}
        </h2>
        <div style={{ fontSize: '1.1rem', color: 'var(--color-teal)', fontWeight: 600, marginBottom: '1.25rem' }}>
          {title}
        </div>
        
        {bioParagraphs.map((p, i) => (
          <p key={i} style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: i === bioParagraphs.length - 1 ? '2rem' : '1.25rem' }}>
            {p}
          </p>
        ))}

        {badges.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-teal-lighter)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.icon}
            </div>
            <span style={{ color: 'var(--color-gray-700)', fontWeight: 500, fontSize: '0.92rem' }}>{item.label}</span>
          </div>
        ))}

        {linkHref && (
          <div style={{ marginTop: '2rem' }}>
            <Link href={linkHref} className="btn btn-primary">
              {linkText}
            </Link>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .doctor-profile-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </div>
  );
}
