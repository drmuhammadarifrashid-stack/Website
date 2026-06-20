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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-40 bg-[#0f172a] rounded-3xl animate-pulse border border-slate-800/60" />
            ))}
          </div>
        }>
          <StatCards />
        </Suspense>
      </section>

      {/* ── Appointments Table Section ───────────────────────────── */}
      <section className="bg-[#0f172a] rounded-3xl shadow-2xl shadow-black/40 border border-slate-800/80 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-800/80 bg-[#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black font-sans tracking-tight" style={{ color: '#ffffff' }}>Appointments List</h2>
            <p className="text-sm mt-1.5 font-medium" style={{ color: '#94a3b8' }}>Manage and update patient appointments.</p>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]"></span>
            Live Updates
          </div>
        </div>
        <div className="p-4 md:p-8 bg-[#020817]">
          <AppointmentsTable />
        </div>
      </section>
    </div>
  );
}
