'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Calendar, Trash2, MessageCircle, RefreshCw, ChevronLeft, ChevronRight, Check, X, Clock } from 'lucide-react';

interface Appointment {
  _id: string;
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
  const loc = apt.location;
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

// ── Status Config ────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending:               { label: 'Pending',              bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400' },
  confirmed:             { label: 'Confirmed',            bg: 'bg-teal-50',    text: 'text-teal-700',   dot: 'bg-teal-400' },
  completed:             { label: 'Completed',            bg: 'bg-emerald-50', text: 'text-emerald-700',dot: 'bg-emerald-500' },
  cancelled:             { label: 'Cancelled',            bg: 'bg-rose-50',    text: 'text-rose-700',   dot: 'bg-rose-400' },
  rescheduled_requested: { label: 'Reschedule Req.',      bg: 'bg-orange-50',  text: 'text-orange-700', dot: 'bg-orange-400' },
};

const STATUS_ACTIONS = [
  { value: 'confirmed',             label: '✅ Mark Confirmed',           whatsapp: true },
  { value: 'completed',             label: '🎉 Mark Completed',           whatsapp: true },
  { value: 'pending',               label: '⏳ Mark Pending',             whatsapp: false },
  { value: 'cancelled',             label: '❌ Mark Cancelled',           whatsapp: true },
  { value: 'rescheduled_requested', label: '🔄 Mark Rescheduled',         whatsapp: true },
];

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
      const res = await fetch(`/api/appointments/${apt._id}`, {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Reschedule Appointment</h3>
            <p className="text-sm text-slate-400 mt-0.5">For <span className="font-semibold text-slate-600">{apt.name}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {apt.status === 'rescheduled_requested' && apt.rescheduleNote && (
          <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <strong>Patient request:</strong> {apt.rescheduleNote}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Time</label>
              <input type="time" required value={time} onChange={e => setTime(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Note for Patient</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="e.g. Your appointment has been moved to Friday due to scheduling."
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
            <p className="text-[10px] text-slate-400 mt-1">WhatsApp will open automatically with a reschedule message.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={submitting}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {submitting ? 'Saving…' : 'Confirm & WhatsApp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Actions Dropdown ─────────────────────────────────────────────
function ActionsMenu({
  apt,
  onRefresh,
  onReschedule,
}: {
  apt: Appointment;
  onRefresh: () => void;
  onReschedule: (apt: Appointment) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatus = async (newStatus: string, sendWhatsApp: boolean) => {
    setLoading(newStatus);
    setOpen(false);
    try {
      const res = await fetch(`/api/appointments/${apt._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        if (sendWhatsApp) openWhatsApp(apt, newStatus);
        onRefresh();
      }
    } catch {
      alert('Failed to update status.');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete appointment for ${apt.name}? This cannot be undone.`)) return;
    setOpen(false);
    try {
      await fetch(`/api/appointments/${apt._id}`, { method: 'DELETE' });
      onRefresh();
    } catch {
      alert('Failed to delete.');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer text-slate-500 hover:text-slate-700"
        disabled={!!loading}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <span className="text-base leading-none font-bold tracking-tight">⋯</span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Change Status</p>
            </div>
            {STATUS_ACTIONS.map(action => (
              <button
                key={action.value}
                onClick={() => handleStatus(action.value, action.whatsapp)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <span>{action.label}</span>
                {action.whatsapp && (
                  <MessageCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                )}
              </button>
            ))}
            <div className="border-t border-slate-100 mt-1 pt-1">
              <button
                onClick={() => { setOpen(false); onReschedule(apt); }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-teal-500" /> Reschedule Date
                </span>
                <MessageCircle className="h-3.5 w-3.5 text-green-500" />
              </button>
              <button
                onClick={() => openWhatsApp(apt, apt.status)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-green-50 transition-colors text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5 text-green-500" /> Send WhatsApp
                </span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer font-medium"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Table ───────────────────────────────────────────────────
export default function AppointmentsTable() {
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
          onDone={fetchAppointments}
        />
      )}

      <div className="space-y-5">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search patient or phone…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all shadow-sm"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={fetchAppointments}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                statusFilter === tab.value
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-52 gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-teal-500" />
              <p className="text-sm text-slate-400 font-medium">Loading appointments…</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-400">No appointments found</p>
              <p className="text-xs text-slate-300">Try changing the filter or search term</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Reason</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {appointments.map(apt => {
                    const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
                    return (
                      <tr key={apt._id} className="hover:bg-slate-50/70 transition-colors group">
                        {/* Patient */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-100 to-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">
                              {apt.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 leading-tight">{apt.name}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{apt.phone}</div>
                              <div className="text-[10px] text-slate-300">{apt.age}y · {apt.gender}</div>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="text-xs text-slate-600 font-medium max-w-[140px] leading-snug">
                            {apt.location.split(',')[0]}
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-700 text-xs leading-tight">
                            {new Date(apt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-xs text-teal-600 font-bold mt-0.5">
                            ⏰ {formatTime(apt.appointmentTime)}
                          </div>
                        </td>

                        {/* Reason */}
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <div className="text-xs text-slate-500 max-w-[180px] truncate" title={apt.reason}>{apt.reason}</div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.text} border-current/10`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                            {cfg.label}
                          </span>
                          {apt.status === 'rescheduled_requested' && apt.rescheduleNote && (
                            <div className="text-[10px] text-amber-600 mt-1 max-w-[140px] truncate" title={apt.rescheduleNote}>
                              📝 {apt.rescheduleNote}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <ActionsMenu
                            apt={apt}
                            onRefresh={fetchAppointments}
                            onReschedule={setRescheduleApt}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
