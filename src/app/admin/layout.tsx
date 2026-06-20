'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col justify-center items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-teal-900"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-400 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-teal-400" />
          </div>
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Verifying Access...</p>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, description: 'Appointments & Stats' },
    { name: 'Calendar View', href: '/admin/calendar', icon: Calendar, description: 'Schedule overview' },
    { name: 'Availability', href: '/admin/availability', icon: Clock, description: 'Set working hours' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-slate-800/60 bg-[#0f172a]/95 sticky top-0 z-20" style={{ padding: '2rem 1.5rem 1.25rem 1.5rem' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-900/40 flex-shrink-0">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-black text-sm tracking-wide leading-tight truncate" style={{ color: '#ffffff' }}>DR. ARIF RASHID</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#2dd4bf' }}>Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Nav Label */}
      <div className="px-6 pt-8 pb-3">
        <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#64748b' }}>Navigation</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`group flex items-center px-4 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-teal-500/10 border border-teal-500/20 shadow-sm shadow-teal-900/10'
                  : 'hover:bg-slate-800/40 border border-transparent'
              }`}
              style={{ gap: '1rem', padding: '1rem' }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                isActive
                  ? 'bg-teal-500/20 text-teal-400'
                  : 'bg-slate-800/60 text-slate-400 group-hover:bg-slate-700/60 group-hover:text-slate-300'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-base leading-tight" style={{ color: isActive ? '#5eead4' : '#e2e8f0' }}>
                  {item.name}
                </div>
                <div className="text-xs leading-tight mt-1" style={{ color: '#94a3b8' }}>{item.description}</div>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: '#14b8a6' }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800/60 bg-slate-900/50" style={{ padding: '1.5rem', paddingBottom: '2.5rem', marginBottom: '1.5rem' }}>
        <div className="flex items-center px-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-xl flex-shrink-0">
            👨‍⚕️
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black truncate" style={{ color: '#ffffff' }}>{session.user.name || 'Dr. Arif'}</p>
            <p className="text-xs truncate" style={{ color: '#94a3b8' }}>{session.user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center justify-center rounded-2xl font-black bg-slate-800/40 hover:bg-rose-950/40 border border-slate-700/40 hover:border-rose-900/40 transition-all duration-200 cursor-pointer group"
          style={{ gap: '0.75rem', padding: '1.25rem 1rem', fontSize: '1rem', color: '#94a3b8' }}
        >
          <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200 group-hover:text-rose-400" />
          <span className="group-hover:text-rose-400 transition-colors">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020817] flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex w-72 flex-shrink-0 flex-col bg-[#0f172a] border-r border-slate-800/60 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* ── Mobile Header ───────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f172a] border-b border-slate-800 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          <span className="font-black text-sm" style={{ color: '#ffffff' }}>Admin Portal</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-slate-800"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Sidebar Drawer ────────────────────────────── */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside className={`md:hidden fixed top-14 left-0 bottom-0 z-50 w-72 bg-[#0f172a] border-r border-slate-800 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-5 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-30">
          <div>
            <h1 className="font-black text-2xl tracking-tight leading-tight" style={{ color: '#ffffff' }}>
              {navItems.find(n => n.href === pathname)?.name || 'Admin Panel'}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
              {navItems.find(n => n.href === pathname)?.description || 'Manage your clinic'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-base font-black" style={{ color: '#ffffff' }}>{session.user.name || 'Dr. Arif'}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#2dd4bf' }}>{new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/30 flex items-center justify-center text-xl shadow-lg shadow-teal-900/20">
              👨‍⚕️
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 pt-20 md:pt-0 md:p-8">
          <div className="max-w-7xl mx-auto text-slate-200">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
