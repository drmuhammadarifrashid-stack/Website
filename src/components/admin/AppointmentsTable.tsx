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

  // Note: Using standard hyphens (-) instead of en/em dashes (–, —) to prevent encoding characters like  on WhatsApp.
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
            <h3 className="font-bold text-white text-lg">Reschedule Appointment</h3>
            <p className="text-sm text-slate-400 mt-0.5">For <span className="font-semibold text-teal-400">{apt.name}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        {apt.status === 'rescheduled_requested' && apt.rescheduleNote && (
          <div className="mx-6 mt-4 p-3.5 bg-amber-900/20 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex gap-2 items-start">
            <span className="text-amber-500">📝</span>
            <div>
              <strong>Patient request:</strong> {apt.rescheduleNote}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-[#020817] border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Time</label>
              <input type="time" required value={time} onChange={e => setTime(e.target.value)}
                className="w-full bg-[#020817] border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Note to Patient</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="e.g. Your appointment has been moved to Friday..."
              className="w-full bg-[#020817] border border-slate-700 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm" />
            <p className="text-[10px] text-teal-400/80 mt-1 flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-green-500" /> WhatsApp will open automatically with a reschedule message.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={submitting}
              className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-bold text-white hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold shadow-lg shadow-teal-900/50 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
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

      <div className="space-y-6">
        {/* Sleek Filters & Search Area */}
        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-teal-400 transition-colors" />
              </div>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by patient name, phone, or location..."
                className="w-full pl-11 pr-4 py-3 text-sm bg-[#020817] border border-slate-800 focus:bg-[#020817] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-inner"
              />
            </div>
            
            <button
              onClick={fetchAppointments}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
              <span className="md:hidden">Refresh Data</span>
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>

          {/* Status Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {filterTabs.map(tab => {
              const isActive = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/40 border border-teal-500'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* List View */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#0f172a] rounded-2xl border border-slate-800 shadow-lg gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
              <p className="text-sm text-slate-400 font-medium tracking-wide">Fetching appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#0f172a] rounded-2xl border border-slate-800 shadow-lg gap-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                <Calendar className="h-6 w-6 text-slate-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">No appointments found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {appointments.map(apt => {
                let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
                if (apt.status === 'confirmed') badgeStyle = 'bg-teal-500/10 text-teal-400 border-teal-500/20';
                if (apt.status === 'completed') badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (apt.status === 'cancelled') badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                if (apt.status === 'rescheduled_requested') badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                return (
                  <div key={apt.id} className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-lg hover:border-slate-700 transition-all p-5 flex flex-col group relative overflow-hidden">
                    {/* Subtle gradient background based on status */}
                    <div className={`absolute -inset-1 opacity-10 bg-gradient-to-br transition-all duration-500 group-hover:opacity-20 ${
                      apt.status === 'confirmed' ? 'from-teal-500/50 to-transparent' :
                      apt.status === 'completed' ? 'from-emerald-500/50 to-transparent' :
                      apt.status === 'cancelled' ? 'from-rose-500/50 to-transparent' :
                      apt.status === 'rescheduled_requested' ? 'from-amber-500/50 to-transparent' :
                      'from-slate-500/50 to-transparent'
                    }`} />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Header: User Info & Status */}
                      <div className="flex justify-between items-start gap-4 mb-5">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-2xl bg-[#020817] border border-slate-700 flex items-center justify-center font-black text-white text-lg shadow-inner">
                            {apt.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white leading-tight group-hover:text-teal-400 transition-colors">{apt.name}</h4>
                            <span className="text-xs text-slate-400 font-medium mt-0.5 block">{apt.age}y • {apt.gender}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-widest ${badgeStyle}`}>
                          {apt.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="col-span-2 bg-[#020817] p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                          <div className="p-1.5 bg-teal-500/10 rounded-lg shrink-0 mt-0.5">
                            <Clock className="h-4 w-4 text-teal-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-300">
                              {new Date(apt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-sm font-black text-white mt-0.5">{formatTime(apt.appointmentTime)}</p>
                          </div>
                        </div>
                        
                        <div className="bg-[#020817] p-3.5 rounded-xl border border-slate-800 flex items-center gap-2.5 overflow-hidden">
                          <div className="p-1.5 bg-slate-800 rounded-lg shrink-0">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <span className="text-xs font-semibold text-slate-300 truncate">{apt.phone}</span>
                        </div>
                        
                        <div className="bg-[#020817] p-3.5 rounded-xl border border-slate-800 flex items-center gap-2.5 overflow-hidden">
                          <div className="p-1.5 bg-slate-800 rounded-lg shrink-0">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <span className="text-xs font-semibold text-slate-300 truncate" title={apt.location}>{apt.location.split(',')[0]}</span>
                        </div>
                      </div>

                      <div className="text-sm text-slate-300 bg-[#020817] p-4 rounded-xl border border-slate-800 mb-5 flex-1">
                        <span className="font-bold text-teal-400 block mb-1 text-xs uppercase tracking-wider">Reason</span> 
                        {apt.reason}
                      </div>

                      {/* Inline Action Buttons */}
                      <div className="mt-auto pt-4 border-t border-slate-800 flex flex-wrap gap-2.5">
                        {apt.status === 'pending' && (
                          <button onClick={() => handleStatusUpdate(apt, 'confirmed')} className="flex-1 min-w-[110px] py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-900/30 transition-all cursor-pointer flex items-center justify-center gap-2">
                            <Check className="h-4 w-4" /> Confirm
                          </button>
                        )}
                        {apt.status === 'confirmed' && (
                          <button onClick={() => handleStatusUpdate(apt, 'completed')} className="flex-1 min-w-[110px] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 transition-all cursor-pointer flex items-center justify-center gap-2">
                            <Check className="h-4 w-4" /> Complete
                          </button>
                        )}
                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <button onClick={() => setRescheduleApt(apt)} className="flex-1 min-w-[110px] py-2.5 border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                            <Calendar className="h-4 w-4 text-slate-400" /> Reschedule
                          </button>
                        )}
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button onClick={() => handleStatusUpdate(apt, 'cancelled')} className="flex-1 min-w-[110px] py-2.5 border border-rose-900/50 bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
                            <X className="h-4 w-4" /> Cancel
                          </button>
                        )}
                        
                        {/* Secondary Actions */}
                        <div className="flex w-full gap-2.5 mt-1.5">
                          <button onClick={() => openWhatsApp(apt, apt.status)} className="flex-1 py-2.5 border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
                             <MessageCircle className="h-4 w-4" /> Send WhatsApp
                          </button>
                          <button onClick={() => handleDelete(apt)} className="px-4 py-2.5 border border-slate-800 bg-[#020817] hover:bg-rose-950/40 hover:border-rose-900/40 hover:text-rose-400 text-slate-500 rounded-xl transition-all cursor-pointer flex items-center justify-center">
                             <Trash2 className="h-4 w-4" />
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
          <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-lg flex items-center justify-between">
            <p className="text-sm text-slate-400 font-medium">Page <span className="font-bold text-white">{page}</span> of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 gap-1.5 text-sm font-bold border border-slate-700 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 gap-1.5 text-sm font-bold border border-slate-700 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
