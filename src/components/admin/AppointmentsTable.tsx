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
import { MoreHorizontal, Trash2, Search, Loader2 } from 'lucide-react';

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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
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
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center text-gray-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                <TableRow key={apt._id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{apt.name}</div>
                    <div className="text-sm text-gray-500">{apt.phone}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{apt.age}y • {apt.gender}</div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="max-w-[150px] truncate" title={apt.location}>
                      {apt.location.split(',')[0]}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {new Date(apt.appointmentDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{apt.appointmentTime}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate text-gray-600 text-sm" title={apt.reason}>
                      {apt.reason}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(apt.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 flex items-center justify-center border-none outline-none">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateStatus(apt._id, 'pending')}>
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(apt._id, 'confirmed')}>
                          Mark as Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(apt._id, 'completed')}>
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(apt._id, 'cancelled')}>
                          Mark as Cancelled
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 focus:bg-red-50 focus:text-red-700"
                          onClick={() => deleteAppointment(apt._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
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
    </div>
  );
}
