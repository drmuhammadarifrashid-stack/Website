import { getAppointmentStats } from '@/lib/appointmentService';
import { Users, CalendarCheck, Clock, XCircle, CheckCircle2, TrendingUp } from 'lucide-react';

export default async function StatCards() {
  const stats = await getAppointmentStats();
  
  const cards = [
    {
      title: 'Total',
      value: stats.total,
      subtitle: 'All time',
      icon: Users,
      color: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      glow: 'shadow-blue-500/20'
    },
    {
      title: 'Pending',
      value: stats.pending,
      subtitle: 'Awaiting review',
      icon: Clock,
      color: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      glow: 'shadow-amber-500/20'
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      subtitle: 'Scheduled',
      icon: CalendarCheck,
      color: 'from-teal-500/20 to-teal-500/5',
      iconColor: 'text-teal-400',
      borderColor: 'border-teal-500/30',
      glow: 'shadow-teal-500/20'
    },
    {
      title: 'Completed',
      value: stats.completed,
      subtitle: 'Seen patients',
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      subtitle: 'Not attended',
      icon: XCircle,
      color: 'from-rose-500/20 to-rose-500/5',
      iconColor: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      glow: 'shadow-rose-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title} 
            className={`relative bg-[#0f172a] rounded-3xl border ${card.borderColor} shadow-xl ${card.glow} overflow-hidden group hover:border-opacity-100 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
            style={{ minHeight: '130px', padding: '1.25rem', paddingBottom: '1.25rem' }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10 flex justify-between items-start w-full">
              <div className={`p-3 rounded-2xl bg-[#020817]/60 border border-slate-700/50 backdrop-blur-md ${card.iconColor} shadow-inner`}>
                <Icon className="h-7 w-7" />
              </div>
              {card.title === 'Completed' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-black text-emerald-400 shadow-sm">
                  <TrendingUp className="h-3.5 w-3.5" /> +12%
                </div>
              )}
            </div>
            
            <div className="relative z-10 mt-4 flex flex-col gap-1 pb-1">
              {/* Using inline style for color to completely override globals.css h3 styles */}
              <h3 className="font-black tracking-tight font-sans leading-none" style={{ fontSize: '2.5rem', color: '#ffffff' }}>
                {card.value}
              </h3>
              <div className="mt-1">
                <p className="text-base font-bold leading-tight" style={{ color: '#e2e8f0' }}>{card.title}</p>
                <p className="text-xs font-semibold uppercase tracking-wider mt-1 leading-normal" style={{ color: '#94a3b8' }}>{card.subtitle}</p>
              </div>
            </div>
            
            {/* Decorative bottom bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.color} opacity-80`} />
          </div>
        );
      })}
    </div>
  );
}
