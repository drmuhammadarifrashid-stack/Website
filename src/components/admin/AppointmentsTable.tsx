'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Calendar, Trash2, MessageCircle, RefreshCw, ChevronLeft, ChevronRight, Check, X, Clock, MapPin, Phone } from 'lucide-react';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  location: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled_requested';
  rescheduleNote?: string;
  adminNote?: string;
  createdAt: string;
}

// ── WhatsApp Helpers ─────────────────────────────────────────────
function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('0')) return '92' + cleaned.slice(1);
  if (cleaned.startsWith('+')) return cleaned.slice(1);
  return cleaned;
}

function formatDateFull(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function getWhatsAppMessage(status: string, apt: Appointment): string {
  const date = formatDateFull(apt.appointmentDate);
  const time = formatTime(apt.appointmentTime);
  const loc = apt.location.split(',')[0];
  const clinic = '📞 03044550048';

  switch (status) {
    case 'confirmed':
      return `Assalam-o-Alaikum ${apt.name}! ✅\n\nYour appointment with *Dr. Muhammad Arif Rashid* has been *CONFIRMED*.\n\n📅 *Date:* ${date}\n⏰ *Time:* ${time}\n📍 *Location:* ${loc}\n\nKindly arrive 10-15 minutes early. Please bring any previous reports or prescriptions.\n\nFor any queries: ${clinic}\n\n- Dr. Arif Rashid Clinic 🏥`;
    case 'completed':
      return `Assalam-o-Alaikum ${apt.name}! 🙏\n\nThank you for visiting *Dr. Muhammad Arif Rashid's* clinic today.\n\nWe hope your consultation was beneficial. Please follow the prescribed treatment plan carefully.\n\nWe value your feedback! How was your experience? ⭐⭐⭐⭐⭐\n\nFor follow-ups or queries: ${clinic}\n\n- Dr. Arif Rashid Clinic 🏥`;
    case 'cancelled':
      return `Assalam-o-Alaikum ${apt.name},\n\nWe regret to inform you that your appointment scheduled for *${date}* at *${time}* has been *cancelled*.\n\nPlease contact us to reschedule at your earliest convenience.\n\n${clinic}\n\n- Dr. Arif Rashid Clinic 🏥`;
    case 'rescheduled_requested':
      return `Assalam-o-Alaikum ${apt.name}! 📅\n\nYour appointment with *Dr. Muhammad Arif Rashid* has been *RESCHEDULED*.\n\nOur team will contact you shortly with your new appointment date and time.\n\nWe apologize for any inconvenience caused.\n\nFor queries: ${clinic}\n\n- Dr. Arif Rashid Clinic 🏥`;
    case 'pending':
      return `Assalam-o-Alaikum ${apt.name},\n\nYour appointment request with *Dr. Muhammad Arif Rashid* is currently *PENDING* review.\n\n📅 *Requested:* ${date} at ${time}\n📍 *Location:* ${loc}\n\nWe will confirm your appointment shortly. For queries: ${clinic}\n\n- Dr. Arif Rashid Clinic 🏥`;
    default:
      return `Assalam-o-Alaikum ${apt.name},\n\nYour appointment status has been updated to *${status.replace('_', ' ').toUpperCase()}*.\n\nFor queries: ${clinic}\n\n- Dr. Arif Rashid Clinic 🏥`;
  }
}

function openWhatsApp(apt: Appointment, status: string) {
  const phone = formatPhone(apt.phone);
  const message = getWhatsAppMessage(status, apt);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ── Reschedule Modal ─────────────────────────────────────────────
function RescheduleModal({
  apt, onClose, onDone,
}: {
  apt: Appointment;
  onClose: () => void;
  onDone: () => void;
}) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState(apt.appointmentTime || '09:00');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const d = new Date(apt.appointmentDate);
    setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }, [apt.appointmentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/appointments/${apt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentDate: date,
          appointmentTime: time,
          status: 'confirmed',
          adminNote: note || 'Appointment rescheduled by clinic.',
        }),
      });
      if (res.ok) {
        openWhatsApp({ ...apt, appointmentDate: date, appointmentTime: time }, 'rescheduled_requested');
        onDone();
        onClose();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to reschedule.');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f172a] rounded-3xl shadow-2xl shadow-black/50 w-full max-w-md border border-slate-700 overflow-hidden transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-[#020817]/50">
          <div>
            <h3 className="font-bold text-lg" style={{ color: '#ffffff' }}>Reschedule Appointment</h3>
            <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>For <span className="font-semibold" style={{ color: '#2dd4bf' }}>{apt.name}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {apt.status === 'rescheduled_requested' && apt.rescheduleNote && (
          <div className="mx-6 mt-4 p-4 bg-[#451a03]/40 border border-amber-500/30 rounded-2xl text-xs flex gap-3 items-start" style={{ color: '#fde68a' }}>
            <span className="text-amber-500 text-base">📝</span>
            <div className="leading-relaxed">
              <strong style={{ color: '#fbbf24' }}>Patient request:</strong> {apt.rescheduleNote}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>New Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-[#020817] border border-slate-700 rounded-xl p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm"
                style={{ color: '#ffffff' }} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>New Time</label>
              <input type="time" required value={time} onChange={e => setTime(e.target.value)}
                className="w-full bg-[#020817] border border-slate-700 rounded-xl p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm"
                style={{ color: '#ffffff' }} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Note to Patient</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="e.g. Your appointment has been moved..."
              className="w-full bg-[#020817] border border-slate-700 rounded-xl p-3.5 text-base resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm"
              style={{ color: '#ffffff' }} />
            <p className="text-[11px] mt-2 flex items-center gap-1.5 font-medium" style={{ color: '#2dd4bf' }}>
              <MessageCircle className="h-3.5 w-3.5 text-green-500" /> WhatsApp opens automatically.
            </p>
          </div>
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} disabled={submitting}
              className="flex-1 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-sm font-bold hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50" style={{ color: '#ffffff' }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-sm font-bold shadow-lg shadow-teal-900/50 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2" style={{ color: '#ffffff' }}>
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
              {submitting ? 'Saving...' : 'Confirm & Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────
export default function AppointmentsTable() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      const res = await fetch(`/api/appointments?${params}`);
      if (res.ok) {
        const json = await res.json();
        setAppointments(json.data.appointments);
        setTotalPages(json.data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchAppointments, 300);
    return () => clearTimeout(t);
  }, [fetchAppointments]);

  const handleStatusUpdate = async (apt: Appointment, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${apt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        openWhatsApp(apt, newStatus);
        fetchAppointments();
        router.refresh();
      }
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (apt: Appointment) => {
    if (!confirm(`Are you sure you want to delete ${apt.name}'s appointment?`)) return;
    try {
      await fetch(`/api/appointments/${apt.id}`, { method: 'DELETE' });
      fetchAppointments();
      router.refresh();
    } catch {
      alert('Failed to delete.');
    }
  };

  const filterTabs = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'rescheduled_requested', label: 'Reschedule Req.' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <>
      {rescheduleApt && (
        <RescheduleModal
          apt={rescheduleApt}
          onClose={() => setRescheduleApt(null)}
          onDone={() => { fetchAppointments(); router.refresh(); }}
        />
      )}

      <div className="space-y-8">
        {/* Sleek Filters & Search Area */}
        <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-lg group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-teal-400 transition-colors" />
              </div>
              {/* Increased py-4 for thicker search bar, fixed icon position */}
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by patient name, phone, or location..."
                className="w-full pl-12 pr-5 py-4 text-base bg-[#020817] border border-slate-700 focus:bg-[#020817] rounded-2xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-inner"
                style={{ color: '#ffffff' }}
              />
            </div>
            
            <button
              onClick={fetchAppointments}
              className="w-full md:w-auto flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-700 hover:border-slate-600 transition-all shadow-md cursor-pointer"
              style={{ color: '#ffffff' }}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin text-teal-400' : 'text-slate-300'}`} />
              <span className="md:hidden">Refresh Data</span>
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>

          {/* Status Pills */}
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
            {filterTabs.map(tab => {
              const isActive = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                  className={`flex-shrink-0 px-6 py-3 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-600 shadow-lg shadow-teal-900/40 border border-teal-500'
                      : 'bg-slate-800 border border-slate-700 hover:border-slate-600 hover:bg-slate-700'
                  }`}
                  style={{ color: isActive ? '#ffffff' : '#cbd5e1' }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* List View */}
        <div className="space-y-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-[#0f172a] rounded-3xl border border-slate-800 shadow-xl gap-5">
              <Loader2 className="h-10 w-10 animate-spin text-teal-500" />
              <p className="text-base font-medium tracking-wide" style={{ color: '#94a3b8' }}>Fetching appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-[#0f172a] rounded-3xl border border-slate-800 shadow-xl gap-5">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                <Calendar className="h-8 w-8 text-slate-500" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold" style={{ color: '#ffffff' }}>No appointments found</p>
                <p className="text-base mt-2" style={{ color: '#94a3b8' }}>Try adjusting your filters or search terms.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {appointments.map(apt => {
                let badgeStyle = 'bg-slate-800 border-slate-700';
                let badgeColor = '#cbd5e1';
                if (apt.status === 'confirmed') { badgeStyle = 'bg-teal-500/10 border-teal-500/30'; badgeColor = '#2dd4bf'; }
                if (apt.status === 'completed') { badgeStyle = 'bg-emerald-500/10 border-emerald-500/30'; badgeColor = '#34d399'; }
                if (apt.status === 'cancelled') { badgeStyle = 'bg-rose-500/10 border-rose-500/30'; badgeColor = '#fb7185'; }
                if (apt.status === 'rescheduled_requested') { badgeStyle = 'bg-amber-500/10 border-amber-500/30'; badgeColor = '#fbbf24'; }

                return (
                  <div key={apt.id} className="bg-[#0f172a] rounded-3xl border border-slate-800 shadow-lg hover:border-slate-700 transition-all p-6 flex flex-col group relative overflow-hidden">
                    <div className={`absolute -inset-1 opacity-10 bg-gradient-to-br transition-all duration-500 group-hover:opacity-20 ${
                      apt.status === 'confirmed' ? 'from-teal-500/50 to-transparent' :
                      apt.status === 'completed' ? 'from-emerald-500/50 to-transparent' :
                      apt.status === 'cancelled' ? 'from-rose-500/50 to-transparent' :
                      apt.status === 'rescheduled_requested' ? 'from-amber-500/50 to-transparent' :
                      'from-slate-500/50 to-transparent'
                    }`} />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Header: User Info & Status */}
                      <div className="flex justify-between items-start gap-4 mb-6">
                        <div className="flex gap-4 items-center">
                          <div className="w-14 h-14 rounded-[1.25rem] bg-[#020817] border border-slate-700 flex items-center justify-center font-black text-xl shadow-inner" style={{ color: '#ffffff' }}>
                            {apt.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-xl leading-tight transition-colors" style={{ color: '#ffffff' }}>{apt.name}</h4>
                            <span className="text-sm font-semibold mt-1 block" style={{ color: '#94a3b8' }}>{apt.age}y • {apt.gender}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-black px-3.5 py-1.5 rounded-full border uppercase tracking-widest ${badgeStyle}`} style={{ color: badgeColor }}>
                          {apt.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="col-span-2 bg-[#020817] p-4 rounded-2xl border border-slate-800 flex items-start gap-3.5">
                          <div className="p-2 bg-teal-500/10 rounded-xl shrink-0 mt-0.5">
                            <Clock className="h-5 w-5 text-teal-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold" style={{ color: '#cbd5e1' }}>
                              {new Date(apt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-lg font-black mt-1" style={{ color: '#ffffff' }}>{formatTime(apt.appointmentTime)}</p>
                          </div>
                        </div>
                        
                        <div className="bg-[#020817] p-4 rounded-2xl border border-slate-800 flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-slate-800 rounded-xl shrink-0">
                            <Phone className="h-4 w-4 text-slate-300" />
                          </div>
                          <span className="text-sm font-bold truncate" style={{ color: '#cbd5e1' }}>{apt.phone}</span>
                        </div>
                        
                        <div className="bg-[#020817] p-4 rounded-2xl border border-slate-800 flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-slate-800 rounded-xl shrink-0">
                            <MapPin className="h-4 w-4 text-slate-300" />
                          </div>
                          <span className="text-sm font-bold truncate" style={{ color: '#cbd5e1' }} title={apt.location}>{apt.location.split(',')[0]}</span>
                        </div>
                      </div>

                      <div className="text-base bg-[#020817] p-5 rounded-2xl border border-slate-800 mb-6 flex-1" style={{ color: '#cbd5e1' }}>
                        <span className="font-black block mb-1.5 text-xs uppercase tracking-widest" style={{ color: '#2dd4bf' }}>Reason</span> 
                        {apt.reason}
                      </div>

                      {/* Inline Action Buttons */}
                      <div className="mt-auto pt-5 border-t border-slate-800 flex flex-wrap gap-3">
                        {apt.status === 'pending' && (
                          <button onClick={() => handleStatusUpdate(apt, 'confirmed')} className="flex-1 min-w-[120px] py-3.5 bg-teal-600 hover:bg-teal-500 rounded-xl text-sm font-bold shadow-lg shadow-teal-900/40 transition-all cursor-pointer flex items-center justify-center gap-2" style={{ color: '#ffffff' }}>
                            <Check className="h-5 w-5" /> Confirm
                          </button>
                        )}
                        {apt.status === 'confirmed' && (
                          <button onClick={() => handleStatusUpdate(apt, 'completed')} className="flex-1 min-w-[120px] py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/40 transition-all cursor-pointer flex items-center justify-center gap-2" style={{ color: '#ffffff' }}>
                            <Check className="h-5 w-5" /> Complete
                          </button>
                        )}
                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <button onClick={() => setRescheduleApt(apt)} className="flex-1 min-w-[120px] py-3.5 border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-slate-500 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm" style={{ color: '#ffffff' }}>
                            <Calendar className="h-5 w-5 text-slate-300" /> Reschedule
                          </button>
                        )}
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button onClick={() => handleStatusUpdate(apt, 'cancelled')} className="flex-1 min-w-[120px] py-3.5 border border-rose-900/60 bg-rose-950/40 hover:bg-rose-900/60 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2" style={{ color: '#fb7185' }}>
                            <X className="h-5 w-5" /> Cancel
                          </button>
                        )}
                        
                        {/* Secondary Actions */}
                        <div className="flex w-full gap-3 mt-2">
                          <button onClick={() => openWhatsApp(apt, apt.status)} className="flex-1 py-3.5 border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2.5" style={{ color: '#25D366' }}>
                             <MessageCircle className="h-5 w-5" /> Send WhatsApp
                          </button>
                          <button onClick={() => handleDelete(apt)} className="px-5 py-3.5 border border-slate-700 bg-[#020817] hover:bg-rose-950/60 hover:border-rose-900/60 rounded-xl transition-all cursor-pointer flex items-center justify-center" style={{ color: '#64748b' }}>
                             <Trash2 className="h-5 w-5 hover:text-rose-400 transition-colors" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination Container */}
        {totalPages > 1 && !loading && (
          <div className="bg-[#0f172a] p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
            <p className="text-base font-medium" style={{ color: '#94a3b8' }}>Page <span className="font-bold" style={{ color: '#ffffff' }}>{page}</span> of {totalPages}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center justify-center h-12 w-12 sm:w-auto sm:px-6 gap-2 text-sm font-bold border border-slate-700 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                style={{ color: '#ffffff' }}
              >
                <ChevronLeft className="h-5 w-5" /> <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center justify-center h-12 w-12 sm:w-auto sm:px-6 gap-2 text-sm font-bold border border-slate-700 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                style={{ color: '#ffffff' }}
              >
                <span className="hidden sm:inline">Next</span> <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
