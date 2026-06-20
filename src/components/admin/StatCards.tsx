import { getAppointmentStats } from '@/lib/appointmentService';
import { Users, CalendarCheck, Clock, XCircle, CheckCircle2, TrendingUp } from 'lucide-react';

export default async function StatCards() {
  const stats = await getAppointmentStats();
  const total = Object.values(stats).reduce((acc, curr) => acc + curr, 0);

  const cards = [
    {
      title: 'Total',
      value: total,
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      accent: 'from-blue-500 to-blue-600',
      border: 'border-blue-100',
      trend: 'All time',
    },
    {
      title: 'Pending',
      value: stats.pending || 0,
      icon: Clock,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      accent: 'from-amber-400 to-amber-500',
      border: 'border-amber-100',
      trend: 'Awaiting review',
    },
    {
      title: 'Confirmed',
      value: stats.confirmed || 0,
      icon: CalendarCheck,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      accent: 'from-teal-400 to-teal-600',
      border: 'border-teal-100',
      trend: 'Scheduled',
    },
    {
      title: 'Completed',
      value: stats.completed || 0,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      accent: 'from-emerald-400 to-emerald-600',
      border: 'border-emerald-100',
      trend: 'Seen patients',
    },
    {
      title: 'Cancelled',
      value: stats.cancelled || 0,
      icon: XCircle,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      accent: 'from-rose-400 to-rose-500',
      border: 'border-rose-100',
      trend: 'Not attended',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`relative bg-white rounded-2xl border ${card.border} shadow-sm overflow-hidden p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}
          >
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.accent}`} />

            {/* Icon + Title */}
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-4.5 w-4.5 ${card.iconColor}`} />
              </div>
              <TrendingUp className="h-3.5 w-3.5 text-slate-200" />
            </div>

            {/* Value */}
            <div>
              <div className="text-3xl font-black text-slate-800 leading-none">{card.value}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">{card.title}</div>
              <div className="text-[10px] text-slate-300 font-medium mt-0.5">{card.trend}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
