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
    <div className="space-y-6" style={{ padding: '2.5rem', paddingTop: '1.5rem' }}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#ffffff' }}>Availability management</h1>
        <p className="mt-0.5" style={{ color: '#94a3b8' }}>Block clinic dates, mark holidays, and control booking limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Block Date Form Card */}
        <div className="bg-[#0f172a] rounded-3xl shadow-xl border border-slate-800 p-6 h-fit">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
            <ShieldAlert className="h-5 w-5 text-teal-400" />
            <h2 className="text-lg font-bold" style={{ color: '#ffffff' }}>Block a Date</h2>
          </div>

          <form onSubmit={handleBlockDate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#94a3b8' }}>Select Clinic Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#020817] border border-slate-700 rounded-xl p-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30 focus:outline-none transition-all"
                style={{ color: '#ffffff' }}
              >
                <option value="Fauji Foundation Hospital">Fauji Foundation Hospital</option>
                <option value="Muhammad Ali Khan Orthopedic & Surgical Hospital">
                  MAK Orthopedic & Surgical Hospital
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#94a3b8' }}>Select Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-[#020817] border border-slate-700 rounded-xl p-2.5 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30 focus:outline-none transition-all"
                style={{ color: '#ffffff' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#94a3b8' }}>Reason for Closure / Leave</label>
              <Input
                placeholder="e.g. Public Holiday, Conference, Leave"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-[#020817] border-slate-700 focus-visible:ring-teal-500/30 rounded-xl transition-all"
                style={{ color: '#ffffff' }}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-sm shadow-teal-900/50"
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
        <div className="md:col-span-2 bg-[#0f172a] rounded-3xl shadow-xl border border-slate-800 p-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
            <Calendar className="h-5 w-5 text-teal-400" />
            <h2 className="text-lg font-bold" style={{ color: '#ffffff' }}>Blocked Dates Schedule</h2>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center items-center" style={{ color: '#94a3b8' }}>
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-teal-500" />
              Loading configuration...
            </div>
          ) : configs.length === 0 ? (
            <div className="py-16 text-center" style={{ color: '#64748b' }}>
              <Hospital className="h-12 w-12 mx-auto mb-2 text-slate-700" />
              <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>No dates are currently blocked</p>
              <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Patients can book slots for any working day.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-3 rounded-tl-xl">Date</th>
                    <th className="p-3">Clinic Location</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3 text-right rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {configs.map((cfg) => (
                    <tr key={cfg._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-bold" style={{ color: '#ffffff' }}>
                        {new Date(cfg.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-3 font-medium" style={{ color: '#cbd5e1' }}>
                        {cfg.location.split(',')[0]}
                      </td>
                      <td className="p-3">
                        <span className="inline-block text-xs font-bold text-amber-200 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                          {cfg.blockedReason || 'Closed'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnblockDate(cfg._id)}
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 cursor-pointer rounded-xl transition-colors"
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
