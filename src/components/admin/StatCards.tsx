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
      borderColor: 'border-blue-500/20',
      glow: 'shadow-blue-500/10'
    },
    {
      title: 'Pending',
      value: stats.pending,
      subtitle: 'Awaiting review',
      icon: Clock,
      color: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      glow: 'shadow-amber-500/10'
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      subtitle: 'Scheduled',
      icon: CalendarCheck,
      color: 'from-teal-500/20 to-teal-500/5',
      iconColor: 'text-teal-400',
      borderColor: 'border-teal-500/20',
      glow: 'shadow-teal-500/10'
    },
    {
      title: 'Completed',
      value: stats.completed,
      subtitle: 'Seen patients',
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/10'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      subtitle: 'Not attended',
      icon: XCircle,
      color: 'from-rose-500/20 to-rose-500/5',
      iconColor: 'text-rose-400',
      borderColor: 'border-rose-500/20',
      glow: 'shadow-rose-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title} 
            className={`relative bg-[#0f172a] rounded-2xl p-5 border ${card.borderColor} shadow-lg ${card.glow} overflow-hidden group hover:border-opacity-50 transition-all duration-300`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm ${card.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {card.title === 'Completed' && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                    <TrendingUp className="h-3 w-3" /> +12%
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <h3 className="text-3xl font-black text-white tracking-tight mb-1 font-sans">{card.value}</h3>
                <p className="text-sm font-bold text-slate-300">{card.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">{card.subtitle}</p>
              </div>
            </div>
            
            {/* Decorative bottom bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} opacity-50`} />
          </div>
        );
      })}
    </div>
  );
}
