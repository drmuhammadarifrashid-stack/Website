import { Card } from '../ui/Card';

type TestimonialCardProps = {
  quote: string;
  name: string;
  condition: string;
  rating?: number;
};

export function TestimonialCard({ quote, name, condition, rating = 5 }: TestimonialCardProps) {
  return (
    <Card style={{ padding: '2rem' }}>
      <div style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>
        {'★'.repeat(rating)}
      </div>
      <p style={{ color: 'var(--color-gray-700)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        "{quote}"
      </p>
      <div>
        <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'Outfit, sans-serif' }}>{name}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-teal)' }}>Treated for: {condition}</div>
      </div>
    </Card>
  );
}
