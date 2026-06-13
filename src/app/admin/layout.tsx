import { cookies } from 'next/headers';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Admin Dashboard | Dr. Arif',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-teal-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-gray-800 hidden sm:inline-block">Admin Portal</span>
          </div>
          {/* User profile / Logout */}
          <form action={async () => {
            'use server';
            const cookieStore = await cookies();
            cookieStore.delete('admin_auth');
          }}>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
