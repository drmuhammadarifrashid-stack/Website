import { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'teal' | 'navy';
  className?: string;
  style?: React.CSSProperties;
};

export function Badge({ children, variant = 'teal', className = '', style }: BadgeProps) {
  return (
    <div className={`badge badge-${variant} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
