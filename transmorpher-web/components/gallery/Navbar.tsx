'use client';
import { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  onUploadClick: () => void;
}

export default function Navbar({ onUploadClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-sm bg-legendary-orange shadow-glow-orange flex items-center justify-center">
            <span className="text-zinc-950 font-bold text-xs">TH</span>
          </div>
          <span className="font-space font-bold text-lg tracking-tight group-hover:text-zinc-300 transition-colors">
            TRANSMORPHER HUB
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-legendary-orange relative after:absolute after:bottom-[-22px] after:left-0 after:w-full after:h-0.5 after:bg-legendary-orange">
            Gallery
          </Link>
          <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">
            Trending
          </Link>
          <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">
            Newest
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-zinc-300 hover:text-zinc-50 px-4 py-2 transition-colors">
            Sign In
          </button>
          <button 
            onClick={onUploadClick}
            className="text-sm font-medium text-zinc-950 bg-legendary-orange hover:brightness-110 hover:shadow-glow-orange px-5 py-2 rounded-md transition-all duration-200"
          >
            Upload Loadout
          </button>
        </div>
      </div>
    </nav>
  );
}
