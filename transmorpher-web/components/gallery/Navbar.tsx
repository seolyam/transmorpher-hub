'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

interface NavbarProps {
  onUploadClick: () => void;
}

export default function Navbar({ onUploadClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleAuthClick = async () => {
    if (user) {
      await supabase.auth.signOut();
      router.refresh();
    } else {
      router.push('/login');
    }
  };

  const handleUploadClick = () => {
    if (user) {
      onUploadClick();
    } else {
      router.push('/login');
    }
  };
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 rounded-md overflow-hidden border border-frost-blue/30 shadow-glow-frost group-hover:border-frost-blue/60 transition-colors">
            <Image 
              src="/logo-icon.png" 
              alt="Transmorpher Hub Logo" 
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <span className="font-space font-bold text-lg tracking-tight group-hover:text-slate-300 transition-colors">
            TRANSMORPHER HUB
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="https://github.com/Kirazul/Transmorpher/releases" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-400 hover:text-slate-50 transition-colors flex items-center gap-1 ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.4A.75.75 0 006.24 10.46l3.25 3.25a.75.75 0 001.06 0l3.25-3.25a.75.75 0 10-1.06-1.06l-1.95 1.95v-4.59z" clipRule="evenodd" />
            </svg>
            Download Addon
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleAuthClick}
            className="text-sm font-medium text-slate-300 hover:text-slate-50 px-4 py-2 transition-colors"
          >
            {user ? 'Sign Out' : 'Sign In'}
          </button>
          <button 
            onClick={handleUploadClick}
            className="text-sm font-medium text-slate-950 bg-frost-blue hover:brightness-110 hover:shadow-glow-frost px-5 py-2 rounded-md transition-all duration-200"
          >
            Upload Loadout
          </button>
        </div>
      </div>
    </nav>
  );
}
