'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      // Calculate first and last day of the month
      const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const lastDayNum = new Date(currentYear, currentMonth + 1, 0).getDate();
      const lastDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDayNum).padStart(2, '0')}`;

      const params = new URLSearchParams({
        dateFrom: firstDay,
        dateTo: lastDay,
        limit: '200', // Retrieve up to 200 appointments in a month
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
    // Default select today if in the current month
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

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchMonthAppointments(); // refresh calendar
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAptForReschedule) return;

    try {
      setSubmittingReschedule(true);
      const res = await fetch(`/api/appointments/${selectedAptForReschedule._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentDate: rescheduleDate,
          appointmentTime: rescheduleTime,
          status: 'confirmed',
          adminNote: adminNote || 'Rescheduled via calendar board.',
        }),
      });

      if (res.ok) {
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

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Group appointments by YYYY-MM-DD
  const appointmentsByDate = appointments.reduce<Record<string, Appointment[]>>((acc, apt) => {
    // Normalise date string from db (can be ISO date or YYYY-MM-DD)
    const rawDate = new Date(apt.appointmentDate);
    const yyyy = rawDate.getFullYear();
    const mm = String(rawDate.getMonth() + 1).padStart(2, '0');
    const dd = String(rawDate.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}-${mm}-${dd}`;
    
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(apt);
    return acc;
  }, {});

  // Build calendar days array
  const calendarCells = [];
  // Previous month padding
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ day: null, dateKey: null });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ day: d, dateKey });
  }

  // Selected date appointments list
  const selectedDayAppointments = selectedDate ? appointmentsByDate[selectedDate] || [] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Calendar view</h1>
        <p className="text-gray-500">Day-by-day scheduler overview and slot confirmations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid Box */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {/* Header Controls */}
          <div className="p-4 flex items-center justify-between border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-bold text-gray-800">
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={prevMonth} className="h-8 w-8 p-0 cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="text-xs font-semibold px-3 h-8 cursor-pointer">
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth} className="h-8 w-8 p-0 cursor-pointer">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b text-center text-xs font-bold text-gray-500 bg-gray-50/50 py-2.5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          {loading ? (
            <div className="h-[360px] flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              <span className="ml-2 text-sm text-gray-500">Loading schedule...</span>
            </div>
          ) : (
            <div className="grid grid-cols-7 flex-1 min-h-[380px] bg-gray-100/30 gap-px">
              {calendarCells.map((cell, idx) => {
                const isSelected = selectedDate === cell.dateKey;
                const dayAppointments = cell.dateKey ? appointmentsByDate[cell.dateKey] || [] : [];
                const activeAppointments = dayAppointments.filter(a => a.status !== 'cancelled');

                return (
                  <div
                    key={idx}
                    onClick={() => cell.dateKey && setSelectedDate(cell.dateKey)}
                    className={`relative p-2 bg-white flex flex-col justify-between transition-colors min-h-[70px] ${
                      cell.day ? 'cursor-pointer hover:bg-teal-50/30' : 'bg-gray-50/50'
                    } ${isSelected ? 'bg-teal-50/80 ring-2 ring-teal-500/30 ring-inset' : ''}`}
                  >
                    {cell.day && (
                      <span
                        className={`text-xs font-bold self-end w-6 h-6 flex items-center justify-center rounded-full ${
                          isSelected
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'text-gray-700'
                        }`}
                      >
                        {cell.day}
                      </span>
                    )}

                    {/* Indicators list */}
                    {cell.day && activeAppointments.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {/* Desktop: Mini items */}
                        <div className="hidden md:block space-y-0.5">
                          {activeAppointments.slice(0, 3).map((apt) => {
                            let badgeBg = 'bg-gray-100 text-gray-700';
                            if (apt.status === 'confirmed') badgeBg = 'bg-indigo-100 text-indigo-700';
                            if (apt.status === 'completed') badgeBg = 'bg-emerald-100 text-emerald-700';
                            if (apt.status === 'rescheduled_requested') badgeBg = 'bg-amber-100 text-amber-700';

                            return (
                              <div
                                key={apt._id}
                                className={`text-[9px] font-bold px-1 rounded truncate leading-tight border border-black/5 ${badgeBg}`}
                              >
                                {apt.appointmentTime} {apt.name.split(' ')[0]}
                              </div>
                            );
                          })}
                          {activeAppointments.length > 3 && (
                            <div className="text-[8px] font-bold text-gray-500 text-center">
                              +{activeAppointments.length - 3} more
                            </div>
                          )}
                        </div>

                        {/* Mobile: Simple dots */}
                        <div className="md:hidden flex flex-wrap gap-1 justify-center mt-1">
                          {activeAppointments.map((apt) => {
                            let dotColor = 'bg-gray-400';
                            if (apt.status === 'confirmed') dotColor = 'bg-indigo-500';
                            if (apt.status === 'completed') dotColor = 'bg-emerald-500';
                            if (apt.status === 'rescheduled_requested') dotColor = 'bg-amber-500';
                            if (apt.status === 'pending') dotColor = 'bg-orange-400';
                            
                            return (
                              <span
                                key={apt._id}
                                className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
                              />
                            );
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Select a Date'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {selectedDayAppointments.filter(a => a.status !== 'cancelled').length} Active Appointments
              </p>
            </div>

            {selectedDayAppointments.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-semibold">No appointments booked for this day</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {selectedDayAppointments.map((apt) => {
                  let statusColor = 'bg-gray-100 text-gray-700';
                  if (apt.status === 'confirmed') statusColor = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
                  if (apt.status === 'completed') statusColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                  if (apt.status === 'cancelled') statusColor = 'bg-rose-50 text-rose-700 border border-rose-200';
                  if (apt.status === 'rescheduled_requested') statusColor = 'bg-orange-50 text-orange-700 border border-orange-200';

                  return (
                    <div
                      key={apt._id}
                      className="p-3.5 rounded-lg border bg-gray-50/50 hover:bg-gray-50 transition-colors space-y-2.5 relative"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">{apt.name}</h4>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {apt.age}y • {apt.gender}
                          </span>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${statusColor}`}>
                          {apt.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400">⏰</span> {apt.appointmentTime}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-gray-400" /> {apt.location.split(',')[0]}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-gray-400" /> {apt.phone}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 italic bg-white p-2 rounded border border-gray-100">
                        Reason: &quot;{apt.reason}&quot;
                      </p>

                      {apt.status === 'rescheduled_requested' && apt.rescheduleNote && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2 rounded text-[11px] leading-tight">
                          <strong>Patient wants reschedule:</strong> &quot;{apt.rescheduleNote}&quot;
                        </div>
                      )}

                      {/* Action buttons inside details card */}
                      <div className="flex justify-end gap-1.5 pt-2 border-t border-gray-100">
                        {apt.status === 'pending' && (
                          <Button
                            size="xs"
                            onClick={() => updateStatus(apt._id, 'confirmed')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] h-7 px-2 cursor-pointer"
                          >
                            Confirm
                          </Button>
                        )}
                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => openRescheduleModal(apt)}
                            className="text-teal-600 hover:bg-teal-50 border-teal-200 font-bold text-[10px] h-7 px-2 cursor-pointer"
                          >
                            Reschedule
                          </Button>
                        )}
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => updateStatus(apt._id, 'cancelled')}
                            className="text-rose-600 hover:bg-rose-50 border-rose-200 font-bold text-[10px] h-7 px-2 cursor-pointer"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reschedule Modal (Same clean look as table modal) */}
      {isRescheduleOpen && selectedAptForReschedule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border shadow-lg max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Reschedule Appointment</h3>
              <button
                onClick={() => { setIsRescheduleOpen(false); setSelectedAptForReschedule(null); }}
                className="text-gray-400 hover:text-gray-600 bg-none border-none text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Rescheduling appointment for <strong className="text-gray-800">{selectedAptForReschedule.name}</strong>.
                </p>
                {selectedAptForReschedule.status === 'rescheduled_requested' && selectedAptForReschedule.rescheduleNote && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded text-xs mb-3">
                    <strong>Patient request note:</strong> {selectedAptForReschedule.rescheduleNote}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">New Date</label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full text-gray-900 border border-gray-300 rounded p-2 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">New Time Slot</label>
                  <input
                    type="time"
                    required
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full text-gray-900 border border-gray-300 rounded p-2 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Admin Note / Message to Patient</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Rescheduled as requested. We have set it for Friday, July 3rd."
                  rows={3}
                  className="w-full text-gray-900 border border-gray-300 rounded p-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  This note will be included in the email sent to the patient.
                </span>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsRescheduleOpen(false); setSelectedAptForReschedule(null); }}
                  disabled={submittingReschedule}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                  disabled={submittingReschedule}
                >
                  {submittingReschedule ? 'Rescheduling...' : 'Confirm Reschedule'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
