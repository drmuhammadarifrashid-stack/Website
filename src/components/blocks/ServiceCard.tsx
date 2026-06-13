import Link from 'next/link';
import { Card } from '../ui/card';

type ServiceCardProps = {
  icon: string;
  title: string;
  description: string;
  color: string;
  accentColor: string;
  href: string;
};

export function ServiceCard({ icon, title, description, color, accentColor, href }: ServiceCardProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Card className="service-card-wrapper" style={{ padding: '2rem', height: '100%' }}>
        <div className="service-icon" style={{ background: color }}>
          {icon}
        </div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
          {title}
        </h3>
        <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', lineHeight: 1.7 }}>
          {description}
        </p>
        <div style={{ marginTop: '1.25rem', color: accentColor, fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          Learn More <span>→</span>
        </div>
      </Card>
    </Link>
  );
}
