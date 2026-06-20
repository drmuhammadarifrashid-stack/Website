'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, Phone, MapPin, Check, X, Clock, MessageCircle } from 'lucide-react';

interface Appointment {
  id: string; // Fixed from _id
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

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Reschedule Modal State
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedAptForReschedule, setSelectedAptForReschedule] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [submittingReschedule, setSubmittingReschedule] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const fetchMonthAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const lastDayNum = new Date(currentYear, currentMonth + 1, 0).getDate();
      const lastDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDayNum).padStart(2, '0')}`;

      const params = new URLSearchParams({
        dateFrom: firstDay,
        dateTo: lastDay,
        limit: '500', 
      });

      const res = await fetch(`/api/appointments?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setAppointments(json.data.appointments || []);
      }
    } catch (error) {
      console.error('Failed to fetch month appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchMonthAppointments();
    const today = new Date();
    if (today.getFullYear() === currentYear && today.getMonth() === currentMonth) {
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setSelectedDate(`${yyyy}-${mm}-${dd}`);
    } else {
      setSelectedDate(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`);
    }
  }, [currentDate, fetchMonthAppointments, currentYear, currentMonth]);

  const updateStatus = async (id: string, newStatus: string, apt: Appointment) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        openWhatsApp(apt, newStatus);
        fetchMonthAppointments();
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAptForReschedule) return;

    try {
      setSubmittingReschedule(true);
      const res = await fetch(`/api/appointments/${selectedAptForReschedule.id}`, { // Fixed ID
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentDate: rescheduleDate,
          appointmentTime: rescheduleTime,
          status: 'confirmed',
          adminNote: adminNote || 'Appointment rescheduled by clinic.',
        }),
      });

      if (res.ok) {
        openWhatsApp({ ...selectedAptForReschedule, appointmentDate: rescheduleDate, appointmentTime: rescheduleTime }, 'rescheduled_requested');
        setIsRescheduleOpen(false);
        setSelectedAptForReschedule(null);
        fetchMonthAppointments();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to reschedule');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setSubmittingReschedule(false);
    }
  };

  const openRescheduleModal = (apt: Appointment) => {
    setSelectedAptForReschedule(apt);
    const rawDate = new Date(apt.appointmentDate);
    const yyyy = rawDate.getFullYear();
    const mm = String(rawDate.getMonth() + 1).padStart(2, '0');
    const dd = String(rawDate.getDate()).padStart(2, '0');
    setRescheduleDate(`${yyyy}-${mm}-${dd}`);
    setRescheduleTime(apt.appointmentTime || '09:00');
    setAdminNote(apt.adminNote || '');
    setIsRescheduleOpen(true);
  };

  // Calendar Helpers
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const appointmentsByDate = appointments.reduce<Record<string, Appointment[]>>((acc, apt) => {
    const rawDate = new Date(apt.appointmentDate);
    const dateKey = `${rawDate.getFullYear()}-${String(rawDate.getMonth() + 1).padStart(2, '0')}-${String(rawDate.getDate()).padStart(2, '0')}`;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(apt);
    return acc;
  }, {});

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) calendarCells.push({ day: null, dateKey: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ day: d, dateKey });
  }

  const selectedDayAppointments = selectedDate ? appointmentsByDate[selectedDate] || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Calendar Planner</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage daily schedules and time slots</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Grid Box */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          {/* Header Controls */}
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
              <button onClick={prevMonth} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm text-slate-500 transition-all cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="h-8 px-3 text-xs font-bold rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm text-slate-700 transition-all cursor-pointer">
                Today
              </button>
              <button onClick={nextMonth} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm text-slate-500 transition-all cursor-pointer">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-50 text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-3 bg-slate-50/50">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          {/* Days Grid */}
          {loading ? (
            <div className="h-[460px] flex flex-col justify-center items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
              <span className="text-sm font-medium text-slate-400">Loading schedule...</span>
            </div>
          ) : (
            <div className="grid grid-cols-7 flex-1 min-h-[460px] bg-slate-100/50 gap-px">
              {calendarCells.map((cell, idx) => {
                const isSelected = selectedDate === cell.dateKey;
                const dayAppointments = cell.dateKey ? appointmentsByDate[cell.dateKey] || [] : [];
                const activeAppointments = dayAppointments.filter(a => a.status !== 'cancelled');

                return (
                  <div
                    key={idx}
                    onClick={() => cell.dateKey && setSelectedDate(cell.dateKey)}
                    className={`relative p-2.5 bg-white flex flex-col transition-all min-h-[90px] ${
                      cell.day ? 'cursor-pointer hover:bg-slate-50' : 'bg-transparent'
                    } ${isSelected ? 'ring-2 ring-teal-500 ring-inset bg-teal-50/30' : ''}`}
                  >
                    {cell.day && (
                      <div className="flex justify-between items-start w-full">
                        <span className={`text-xs font-bold flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                          isSelected ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600'
                        }`}>
                          {cell.day}
                        </span>
                        {activeAppointments.length > 0 && (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                            {activeAppointments.length}
                          </span>
                        )}
                      </div>
                    )}

                    {cell.day && activeAppointments.length > 0 && (
                      <div className="mt-2 space-y-1.5 flex-1">
                        <div className="hidden lg:flex flex-col gap-1">
                          {activeAppointments.slice(0, 3).map((apt) => {
                            let dot = 'bg-slate-300';
                            if (apt.status === 'confirmed') dot = 'bg-teal-400';
                            if (apt.status === 'completed') dot = 'bg-emerald-500';
                            if (apt.status === 'rescheduled_requested') dot = 'bg-amber-400';

                            return (
                              <div key={apt.id} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 bg-slate-50 px-1.5 py-1 rounded truncate border border-slate-100/50">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                                <span className="truncate">{formatTime(apt.appointmentTime)} {apt.name.split(' ')[0]}</span>
                              </div>
                            );
                          })}
                          {activeAppointments.length > 3 && (
                            <div className="text-[9px] font-bold text-slate-400 pl-1">
                              +{activeAppointments.length - 3} more
                            </div>
                          )}
                        </div>

                        {/* Mobile dots */}
                        <div className="lg:hidden flex flex-wrap gap-1 mt-1">
                          {activeAppointments.map((apt) => {
                            let dot = 'bg-slate-300';
                            if (apt.status === 'confirmed') dot = 'bg-teal-400';
                            if (apt.status === 'completed') dot = 'bg-emerald-500';
                            if (apt.status === 'rescheduled_requested') dot = 'bg-amber-400';
                            return <span key={apt.id} className={`w-1.5 h-1.5 rounded-full ${dot}`} />;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Day Details Pane */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full max-h-[600px]">
          <div className="px-6 py-5 border-b border-slate-50">
            <h3 className="text-lg font-black text-slate-800">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
                : 'Select a Date'}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {selectedDayAppointments.filter(a => a.status !== 'cancelled').length} Active Appointments
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
            {selectedDayAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-slate-300" />
                </div>
                <p className="text-sm font-semibold">No appointments today</p>
              </div>
            ) : (
              selectedDayAppointments.map((apt) => {
                let badgeBg = 'bg-slate-100 text-slate-600 border-slate-200';
                if (apt.status === 'confirmed') badgeBg = 'bg-teal-50 text-teal-700 border-teal-200';
                if (apt.status === 'completed') badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                if (apt.status === 'cancelled') badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
                if (apt.status === 'rescheduled_requested') badgeBg = 'bg-orange-50 text-orange-700 border-orange-200';

                return (
                  <div key={apt.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3 relative group hover:border-slate-200 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex gap-3 items-center">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-600 text-sm">
                          {apt.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 leading-tight">{apt.name}</h4>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {apt.age}y • {apt.gender}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider ${badgeBg}`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-50">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-teal-500" /> {formatTime(apt.appointmentTime)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" /> {apt.phone}
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> <span className="truncate">{apt.location.split(',')[0]}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-700">Reason:</span> {apt.reason}
                    </div>

                    {apt.status === 'rescheduled_requested' && apt.rescheduleNote && (
                      <div className="bg-amber-50 border border-amber-100 text-amber-800 p-2.5 rounded-xl text-xs">
                        <strong>Note:</strong> {apt.rescheduleNote}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {apt.status === 'pending' && (
                        <button onClick={() => updateStatus(apt.id, 'confirmed', apt)} className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1">
                          <Check className="h-3 w-3" /> Confirm
                        </button>
                      )}
                      {apt.status === 'confirmed' && (
                        <button onClick={() => updateStatus(apt.id, 'completed', apt)} className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1">
                          <Check className="h-3 w-3" /> Complete
                        </button>
                      )}
                      {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                        <button onClick={() => openRescheduleModal(apt)} className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1">
                          Reschedule
                        </button>
                      )}
                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <button onClick={() => updateStatus(apt.id, 'cancelled', apt)} className="px-2.5 py-1.5 border border-rose-100 hover:bg-rose-50 text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button onClick={() => openWhatsApp(apt, apt.status)} className="px-2.5 py-1.5 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center">
                         <MessageCircle className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleOpen && selectedAptForReschedule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Reschedule Appointment</h3>
                <p className="text-sm text-slate-400 mt-0.5">For <span className="font-semibold text-slate-600">{selectedAptForReschedule.name}</span></p>
              </div>
              <button onClick={() => { setIsRescheduleOpen(false); setSelectedAptForReschedule(null); }} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Date</label>
                  <input type="date" required value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Time</label>
                  <input type="time" required value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Note for Patient</label>
                <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={3} placeholder="e.g. Your appointment has been moved to Friday."
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all" />
                <p className="text-[10px] text-slate-400 mt-1">WhatsApp will open automatically with a reschedule message.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setIsRescheduleOpen(false); setSelectedAptForReschedule(null); }} disabled={submittingReschedule}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={submittingReschedule}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                  {submittingReschedule ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {submittingReschedule ? 'Saving…' : 'Confirm & WhatsApp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
