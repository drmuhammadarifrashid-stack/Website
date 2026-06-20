'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Trash2, ShieldAlert, Plus, Loader2, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AvailabilityConfig {
  _id: string;
  date: string;
  location: string;
  isBlocked: boolean;
  blockedReason?: string;
  workingHours?: {
    start: string;
    end: string;
  };
}

export default function AdminAvailabilityPage() {
  const [configs, setConfigs] = useState<AvailabilityConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [location, setLocation] = useState('Fauji Foundation Hospital');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/availability');
      if (res.ok) {
        const json = await res.json();
        setConfigs(json.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch availability configurations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          location,
          isBlocked: true,
          blockedReason: reason || 'Clinic closed / Doctor on leave',
        }),
      });

      if (res.ok) {
        setDate('');
        setReason('');
        fetchAvailability();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to block date');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnblockDate = async (id: string) => {
    if (!confirm('Are you sure you want to unblock this date? Patients will be able to book appointments again.')) return;

    try {
      const res = await fetch(`/api/admin/availability?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAvailability();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to unblock date');
      }
    } catch {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Availability management</h1>
        <p className="text-gray-500">Block clinic dates, mark holidays, and control booking limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Block Date Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
          <div className="flex items-center gap-2 border-b pb-3 mb-4">
            <ShieldAlert className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">Block a Date</h2>
          </div>

          <form onSubmit={handleBlockDate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Select Clinic Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-gray-900 bg-white border border-gray-300 rounded p-2 text-sm focus:border-teal-500 focus:outline-none"
              >
                <option value="Fauji Foundation Hospital">Fauji Foundation Hospital</option>
                <option value="Muhammad Ali Khan Orthopedic & Surgical Hospital">
                  MAK Orthopedic & Surgical Hospital
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full text-gray-900 border border-gray-300 rounded p-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for Closure / Leave</label>
              <Input
                placeholder="e.g. Public Holiday, Conference, Leave"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-gray-900 border-gray-300"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Blocking...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Block Date
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Currently Blocked Dates List */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 border-b pb-3 mb-4">
            <Calendar className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">Blocked Dates Schedule</h2>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center items-center text-gray-500">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-teal-600" />
              Loading configuration...
            </div>
          ) : configs.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Hospital className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-semibold">No dates are currently blocked</p>
              <p className="text-xs text-gray-500 mt-1">Patients can book slots for any working day.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-3">Date</th>
                    <th className="p-3">Clinic Location</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {configs.map((cfg) => (
                    <tr key={cfg._id} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 font-semibold text-gray-900">
                        {new Date(cfg.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-3 text-gray-600 font-medium">
                        {cfg.location.split(',')[0]}
                      </td>
                      <td className="p-3">
                        <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                          {cfg.blockedReason || 'Closed'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnblockDate(cfg._id)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Unblock</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
