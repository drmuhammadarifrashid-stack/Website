'use client';

import { useState } from 'react';
import { login } from './actions';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await login(password);
      if (res.success) {
        window.location.reload();
      } else {
        setError(res.error || 'Login failed');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
        <p className="text-sm text-gray-500">Enter the admin password to continue</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="••••••••"
            required
          />
        </div>
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
