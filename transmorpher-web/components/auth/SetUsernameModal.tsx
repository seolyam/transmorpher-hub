'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { claimUsername } from '@/app/actions';

export default function SetUsernameModal() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (username.length < 3 || username.length > 16) {
      setError("Username must be between 3 and 16 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores.");
      return;
    }

    setLoading(true);
    
    try {
      const result = await claimUsername(username);
      
      if (!result.success) {
        setError(result.error || "An error occurred");
        setLoading(false);
        return;
      }
      
      // Successfully set username, refresh the page to update the layout wrapper state
      router.refresh();
    } catch (err: unknown) {
      setError(String(err));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent opacity-50"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Claim Your Username</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Please choose a unique username to complete your profile. This will be visible to everyone.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  @
                </span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="epic_gamer_123"
                  maxLength={16}
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                3-16 characters. Letters, numbers, and underscores only.
              </p>
            </div>
            
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !username}
              className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Claim Username"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
