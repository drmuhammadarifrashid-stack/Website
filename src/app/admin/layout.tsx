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
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-teal-900"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-400 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-teal-400" />
          </div>
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Verifying Access…</p>
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
      {/* Brand */}
      <div className="px-6 py-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-900/40 flex-shrink-0">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-black text-white text-sm tracking-wide leading-tight truncate">DR. ARIF RASHID</h2>
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Nav Label */}
      <div className="px-6 pt-6 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Navigation</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-teal-600/20 text-teal-300 border border-teal-600/30 shadow-sm shadow-teal-900/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                isActive
                  ? 'bg-teal-500/20 text-teal-400'
                  : 'bg-slate-800/60 text-slate-500 group-hover:bg-slate-700/60 group-hover:text-slate-300'
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className={`font-semibold text-sm leading-tight ${isActive ? 'text-teal-300' : ''}`}>
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-600 leading-tight mt-0.5">{item.description}</div>
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-teal-500 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-lg flex-shrink-0">
            👨‍⚕️
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{session.user.name || 'Dr. Arif'}</p>
            <p className="text-[10px] text-slate-500 truncate">{session.user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800/60 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-900/40 transition-all duration-200 cursor-pointer group"
        >
          <LogOut className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-200" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col bg-slate-900 border-r border-slate-800/60 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* ── Mobile Header ───────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">Admin Portal</span>
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
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside className={`md:hidden fixed top-14 left-0 bottom-0 z-50 w-72 bg-slate-900 border-r border-slate-800 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
          <div>
            <h1 className="text-slate-800 font-bold text-lg leading-tight">
              {navItems.find(n => n.href === pathname)?.name || 'Admin Panel'}
            </h1>
            <p className="text-slate-400 text-xs">
              {navItems.find(n => n.href === pathname)?.description || 'Manage your clinic'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-700">{session.user.name || 'Dr. Arif'}</p>
              <p className="text-[10px] text-slate-400">{new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-teal-200 flex items-center justify-center text-sm">
              👨‍⚕️
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 pt-18 md:pt-0 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
