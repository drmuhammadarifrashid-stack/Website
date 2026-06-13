import { getAppointmentStats } from '@/lib/appointmentService';
import { Users, CalendarCheck, Clock, XCircle, CheckCircle2 } from 'lucide-react';

export default async function StatCards() {
  const stats = await getAppointmentStats();
  
  const total = Object.values(stats).reduce((acc, curr) => acc + curr, 0);

  const cards = [
    {
      title: 'Total Appointments',
      value: total,
      icon: <Users className="h-4 w-4 text-gray-500" />,
      color: 'border-blue-200 bg-blue-50',
    },
    {
      title: 'Pending',
      value: stats.pending || 0,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      color: 'border-amber-200 bg-amber-50',
    },
    {
      title: 'Confirmed',
      value: stats.confirmed || 0,
      icon: <CalendarCheck className="h-4 w-4 text-indigo-500" />,
      color: 'border-indigo-200 bg-indigo-50',
    },
    {
      title: 'Completed',
      value: stats.completed || 0,
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      color: 'border-emerald-200 bg-emerald-50',
    },
    {
      title: 'Cancelled',
      value: stats.cancelled || 0,
      icon: <XCircle className="h-4 w-4 text-rose-500" />,
      color: 'border-rose-200 bg-rose-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
      {cards.map((card) => (
        <div key={card.title} className="rounded-xl border bg-white text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{card.title}</h3>
            {card.icon}
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
