import { Suspense } from 'react';
import StatCards from '@/components/admin/StatCards';
import AppointmentsTable from '@/components/admin/AppointmentsTable';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* ── Stat Cards Section ───────────────────────────────────── */}
      <section>
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-[#0f172a] rounded-2xl animate-pulse border border-slate-800/60" />
            ))}
          </div>
        }>
          <StatCards />
        </Suspense>
      </section>

      {/* ── Appointments Table Section ───────────────────────────── */}
      <section className="bg-[#0f172a] rounded-2xl shadow-xl shadow-black/20 border border-slate-800/60 overflow-hidden">
        <div className="p-6 border-b border-slate-800/60 bg-[#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-sans tracking-tight">Appointments List</h2>
            <p className="text-sm text-slate-400 mt-1">Manage and update patient appointments.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            Live Updates
          </div>
        </div>
        <div className="p-4 sm:p-6 bg-[#020817]">
          <AppointmentsTable />
        </div>
      </section>
    </div>
  );
}
