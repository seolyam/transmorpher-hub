'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onUploadClick: () => void;
}

export default function Navbar({ onUploadClick }: NavbarProps) {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-md bg-slate-900 border border-frost-blue/30 shadow-glow-frost flex items-center justify-center text-frost-blue group-hover:bg-frost-blue/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="m10 20-2.5-3.5"></path><path d="M12 22v-8"></path><path d="m14 20 2.5-3.5"></path><path d="m10 4-2.5 3.5"></path><path d="M12 2v8"></path><path d="m14 4 2.5 3.5"></path><path d="m20 10-3.5-2.5"></path><path d="M22 12h-8"></path><path d="m20 14-3.5 2.5"></path><path d="m4 10 3.5-2.5"></path><path d="M2 12h8"></path><path d="m4 14 3.5 2.5"></path>
            </svg>
          </div>
          <span className="font-space font-bold text-lg tracking-tight group-hover:text-slate-300 transition-colors">
            TRANSMORPHER HUB
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-frost-blue relative after:absolute after:bottom-[-22px] after:left-0 after:w-full after:h-0.5 after:bg-frost-blue' : 'text-slate-400 hover:text-slate-50'}`}>
            Gallery
          </Link>
          <Link href="/trending" className={`text-sm font-medium transition-colors ${pathname === '/trending' ? 'text-frost-blue relative after:absolute after:bottom-[-22px] after:left-0 after:w-full after:h-0.5 after:bg-frost-blue' : 'text-slate-400 hover:text-slate-50'}`}>
            Trending
          </Link>
          <Link href="/newest" className={`text-sm font-medium transition-colors ${pathname === '/newest' ? 'text-frost-blue relative after:absolute after:bottom-[-22px] after:left-0 after:w-full after:h-0.5 after:bg-frost-blue' : 'text-slate-400 hover:text-slate-50'}`}>
            Newest
          </Link>
          <a href="https://github.com/Kirazul/Transmorpher/releases" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-400 hover:text-slate-50 transition-colors flex items-center gap-1 ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.4A.75.75 0 006.24 10.46l3.25 3.25a.75.75 0 001.06 0l3.25-3.25a.75.75 0 10-1.06-1.06l-1.95 1.95v-4.59z" clipRule="evenodd" />
            </svg>
            Download Addon
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-300 hover:text-slate-50 px-4 py-2 transition-colors">
            Sign In
          </button>
          <button 
            onClick={onUploadClick}
            className="text-sm font-medium text-slate-950 bg-frost-blue hover:brightness-110 hover:shadow-glow-frost px-5 py-2 rounded-md transition-all duration-200"
          >
            Upload Loadout
          </button>
        </div>
      </div>
    </nav>
  );
}
