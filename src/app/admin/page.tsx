import { Suspense } from 'react';
import StatCards from '@/components/admin/StatCards';
import AppointmentsTable from '@/components/admin/AppointmentsTable';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage appointments and track clinic activity</p>
        </div>
      </div>

      {/* Stat Cards */}
      <Suspense
        fallback={
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        }
      >
        <StatCards />
      </Suspense>

      {/* Appointments */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Appointments List</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click <span className="font-semibold text-teal-600">⋯</span> on any row to change status, reschedule, or send WhatsApp
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-medium">Live</span>
          </div>
        </div>
        <div className="p-6">
          <AppointmentsTable />
        </div>
      </div>
    </div>
  );
}
