import { Suspense } from 'react';
import StatCards from '@/components/admin/StatCards';
import AppointmentsTable from '@/components/admin/AppointmentsTable';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of clinic appointments and patient requests.</p>
      </div>

      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-xl" />}>
        <StatCards />
      </Suspense>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Appointments List</h2>
        </div>
        <div className="p-6">
          <AppointmentsTable />
        </div>
      </div>
    </div>
  );
}
