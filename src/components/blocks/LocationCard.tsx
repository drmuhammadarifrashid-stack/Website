import { Card } from '../ui/card';

type LocationCardProps = {
  name: string;
  address: string;
  hours: string;
  icon: string;
};

export function LocationCard({ name, address, hours, icon }: LocationCardProps) {
  return (
    <Card style={{
      display: 'flex', gap: '1rem', alignItems: 'flex-start',
      padding: '1.25rem', marginBottom: '0.875rem',
    }}>
      <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'Outfit, sans-serif', marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', marginBottom: 2 }}>📍 {address}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-teal)', fontWeight: 500 }}>⏰ {hours}</div>
      </div>
    </Card>
  );
}
