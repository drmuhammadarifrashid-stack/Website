'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, Search, Loader2, Calendar } from 'lucide-react';

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

export default function AppointmentsTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reschedule modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [submittingReschedule, setSubmittingReschedule] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await fetch(`/api/appointments?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setAppointments(json.data.appointments);
        setTotalPages(json.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAppointments();
    }, 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchAppointments]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAppointments(); // refresh
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return;

    try {
      setSubmittingReschedule(true);
      const res = await fetch(`/api/appointments/${selectedApt._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentDate: rescheduleDate,
          appointmentTime: rescheduleTime,
          status: 'confirmed', // Automatically confirm rescheduled appointments
          adminNote: adminNote || 'Appointment rescheduled by clinic.',
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setSelectedApt(null);
        setRescheduleDate('');
        setRescheduleTime('');
        setAdminNote('');
        fetchAppointments();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to reschedule appointment');
      }
    } catch (error) {
      console.error('Failed to reschedule', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmittingReschedule(false);
    }
  };

  const openRescheduleModal = (apt: Appointment) => {
    setSelectedApt(apt);
    // Format date for <input type="date"> (YYYY-MM-DD)
    const rawDate = new Date(apt.appointmentDate);
    const yyyy = rawDate.getFullYear();
    const mm = String(rawDate.getMonth() + 1).padStart(2, '0');
    const dd = String(rawDate.getDate()).padStart(2, '0');
    setRescheduleDate(`${yyyy}-${mm}-${dd}`);
    setRescheduleTime(apt.appointmentTime || '09:00');
    setAdminNote(apt.adminNote || '');
    setIsModalOpen(true);
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Failed to delete appointment', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
    switch (status) {
      case 'pending': return <span className={`${base} bg-amber-50 text-amber-600 border border-amber-200`}>Pending</span>;
      case 'confirmed': return <span className={`${base} bg-indigo-50 text-indigo-600 border border-indigo-200`}>Confirmed</span>;
      case 'completed': return <span className={`${base} bg-emerald-50 text-emerald-600 border border-emerald-200`}>Completed</span>;
      case 'cancelled': return <span className={`${base} bg-rose-50 text-rose-600 border border-rose-200`}>Cancelled</span>;
      case 'rescheduled_requested': return <span className={`${base} bg-orange-50 text-orange-600 border border-orange-200`}>Reschedule Requested</span>;
      default: return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 text-gray-900 border-gray-300"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'pending', 'confirmed', 'rescheduled_requested', 'completed', 'cancelled'].map(s => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className="capitalize"
            >
              {s.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-700">Patient</TableHead>
              <TableHead className="font-semibold text-gray-700">Location</TableHead>
              <TableHead className="font-semibold text-gray-700">Date & Time</TableHead>
              <TableHead className="font-semibold text-gray-700">Reason</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center text-gray-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-teal-600" />
                    Loading appointments...
                  </div>
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((apt) => (
                <TableRow key={apt._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div className="font-semibold text-gray-900">{apt.name}</div>
                    <div className="text-sm text-gray-500">{apt.phone}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{apt.age}y • {apt.gender}</div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="max-w-[150px] truncate font-medium" title={apt.location}>
                      {apt.location.split(',')[0]}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-gray-900">
                      {new Date(apt.appointmentDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">⏰ {apt.appointmentTime || 'TBD'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate text-gray-600 text-sm font-medium" title={apt.reason}>
                      {apt.reason}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(apt.status)}
                      {apt.status === 'rescheduled_requested' && apt.rescheduleNote && (
                        <div className="text-xs text-amber-600 font-medium bg-amber-50 p-1.5 rounded border border-amber-100 max-w-[180px] break-words">
                          Patient Note: &quot;{apt.rescheduleNote}&quot;
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 flex items-center justify-center border-none outline-none cursor-pointer">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border shadow-md rounded-md p-1 min-w-[160px] z-50">
                        <DropdownMenuItem className="px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer" onClick={() => openRescheduleModal(apt)}>
                          <Calendar className="mr-2 h-4 w-4 inline-block text-gray-500" />
                          Reschedule / Edit Date
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer" onClick={() => updateStatus(apt._id, 'pending')}>
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer" onClick={() => updateStatus(apt._id, 'confirmed')}>
                          Mark as Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer" onClick={() => updateStatus(apt._id, 'completed')}>
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer" onClick={() => updateStatus(apt._id, 'cancelled')}>
                          Mark as Cancelled
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer font-medium"
                          onClick={() => deleteAppointment(apt._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4 inline-block" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <div className="text-sm text-gray-500 font-medium px-2">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Reschedule Modal */}
      {isModalOpen && selectedApt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border shadow-lg max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Reschedule Appointment</h3>
              <button
                onClick={() => { setIsModalOpen(false); setSelectedApt(null); }}
                className="text-gray-400 hover:text-gray-600 bg-none border-none text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Rescheduling appointment for <strong className="text-gray-800">{selectedApt.name}</strong>.
                </p>
                {selectedApt.status === 'rescheduled_requested' && selectedApt.rescheduleNote && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded text-xs mb-3">
                    <strong>Patient request note:</strong> {selectedApt.rescheduleNote}
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
                  onClick={() => { setIsModalOpen(false); setSelectedApt(null); }}
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
