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
      return `Assalam-o-Alaikum ${apt.name}! ✅\n\nYour appointment with *Dr. Muhammad Arif Rashid* has been *CONFIRMED*.\n\n📅 *Date:* ${date}\n⏰ *Time:* ${time}\n📍 *Location:* ${loc}\n\nKindly arrive 10–15 minutes early. Please bring any previous reports or prescriptions.\n\nFor any queries: ${clinic}\n\n— Dr. Arif Rashid Clinic 🏥`;
    case 'completed':
      return `Assalam-o-Alaikum ${apt.name}! 🙏\n\nThank you for visiting *Dr. Muhammad Arif Rashid's* clinic today.\n\nWe hope your consultation was beneficial. Please follow the prescribed treatment plan carefully.\n\nWe value your feedback! How was your experience? ⭐⭐⭐⭐⭐\n\nFor follow-ups or queries: ${clinic}\n\n— Dr. Arif Rashid Clinic 🏥`;
    case 'cancelled':
      return `Assalam-o-Alaikum ${apt.name},\n\nWe regret to inform you that your appointment scheduled for *${date}* at *${time}* has been *cancelled*.\n\nPlease contact us to reschedule at your earliest convenience.\n\n${clinic}\n\n— Dr. Arif Rashid Clinic 🏥`;
    case 'rescheduled_requested':
      return `Assalam-o-Alaikum ${apt.name}! 📅\n\nYour appointment with *Dr. Muhammad Arif Rashid* has been *RESCHEDULED*.\n\nOur team will contact you shortly with your new appointment date and time.\n\nWe apologize for any inconvenience caused.\n\nFor queries: ${clinic}\n\n— Dr. Arif Rashid Clinic 🏥`;
    case 'pending':
      return `Assalam-o-Alaikum ${apt.name},\n\nYour appointment request with *Dr. Muhammad Arif Rashid* is currently *PENDING* review.\n\n📅 *Requested:* ${date} at ${time}\n📍 *Location:* ${loc}\n\nWe will confirm your appointment shortly. For queries: ${clinic}\n\n— Dr. Arif Rashid Clinic 🏥`;
    default:
      return `Assalam-o-Alaikum ${apt.name},\n\nYour appointment status has been updated to *${status.replace('_', ' ').toUpperCase()}*.\n\nFor queries: ${clinic}\n\n— Dr. Arif Rashid Clinic 🏥`;
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Reschedule Appointment</h3>
            <p className="text-sm text-slate-500 mt-0.5">For <span className="font-semibold text-slate-700">{apt.name}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {apt.status === 'rescheduled_requested' && apt.rescheduleNote && (
          <div className="mx-6 mt-4 p-3.5 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 flex gap-2 items-start">
            <span className="text-amber-500">📝</span>
            <div>
              <strong>Patient request:</strong> {apt.rescheduleNote}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">New Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all shadow-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">New Time</label>
              <input type="time" required value={time} onChange={e => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all shadow-sm" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Note to Patient</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="e.g. Your appointment has been moved to Friday due to scheduling conflicts."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all shadow-sm" />
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-green-500" /> WhatsApp will open automatically with a reschedule message.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={submitting}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-md shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {submitting ? 'Saving…' : 'Confirm & Send'}
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
        // Refresh server components (like StatCards)
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
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by patient name, phone, or location..."
                className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
              />
            </div>
            
            <button
              onClick={fetchAppointments}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-teal-500' : ''}`} />
              <span className="md:hidden">Refresh Data</span>
            </button>
          </div>

          {/* Status Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {filterTabs.map(tab => {
              const isActive = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* List View - Replaces standard table for perfect mobile responsiveness */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
              <p className="text-sm text-slate-400 font-medium">Fetching appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm gap-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                <Calendar className="h-6 w-6 text-slate-300" />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-slate-700">No appointments found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {appointments.map(apt => {
                let badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';
                if (apt.status === 'confirmed') badgeStyle = 'bg-teal-50 text-teal-700 border-teal-200';
                if (apt.status === 'completed') badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                if (apt.status === 'cancelled') badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                if (apt.status === 'rescheduled_requested') badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <div key={apt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col group">
                    {/* Header: User Info & Status */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center font-black text-slate-600 text-lg shadow-sm">
                          {apt.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-slate-900 leading-tight group-hover:text-teal-700 transition-colors">{apt.name}</h4>
                          <span className="text-xs text-slate-500 font-medium">{apt.age}y • {apt.gender}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg border uppercase tracking-wider ${badgeStyle}`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="col-span-2 bg-slate-50/50 p-3 rounded-xl border border-slate-50 flex items-start gap-3">
                        <Clock className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {new Date(apt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-sm font-black text-teal-700 mt-0.5">{formatTime(apt.appointmentTime)}</p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-50 flex items-center gap-2 overflow-hidden">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-700 truncate">{apt.phone}</span>
                      </div>
                      
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-50 flex items-center gap-2 overflow-hidden">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-700 truncate" title={apt.location}>{apt.location.split(',')[0]}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 flex-1">
                      <span className="font-bold text-slate-800">Reason:</span> {apt.reason}
                    </div>

                    {/* Inline Action Buttons - Fixes the hidden dropdown issue completely */}
                    <div className="mt-auto pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                      {apt.status === 'pending' && (
                        <button onClick={() => handleStatusUpdate(apt, 'confirmed')} className="flex-1 min-w-[100px] py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                          <Check className="h-3.5 w-3.5" /> Confirm
                        </button>
                      )}
                      {apt.status === 'confirmed' && (
                        <button onClick={() => handleStatusUpdate(apt, 'completed')} className="flex-1 min-w-[100px] py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                          <Check className="h-3.5 w-3.5" /> Complete
                        </button>
                      )}
                      {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                        <button onClick={() => setRescheduleApt(apt)} className="flex-1 min-w-[100px] py-2 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" /> Reschedule
                        </button>
                      )}
                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <button onClick={() => handleStatusUpdate(apt, 'cancelled')} className="flex-1 min-w-[100px] py-2 border border-rose-100 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                      )}
                      
                      {/* Secondary Actions */}
                      <div className="flex w-full gap-2 mt-1">
                        <button onClick={() => openWhatsApp(apt, apt.status)} className="flex-1 py-2 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                           <MessageCircle className="h-4 w-4" /> Message
                        </button>
                        <button onClick={() => handleDelete(apt)} className="px-4 py-2 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-400 rounded-xl transition-all cursor-pointer flex items-center justify-center">
                           <Trash2 className="h-4 w-4" />
                        </button>
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
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">Page <span className="font-bold text-slate-800">{page}</span> of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 gap-1.5 text-sm font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 gap-1.5 text-sm font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
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
