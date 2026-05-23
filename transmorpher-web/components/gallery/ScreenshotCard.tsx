'use client';
import Image from 'next/image';
import { GalleryItem } from '@/lib/types';
import { useState } from 'react';

interface ScreenshotCardProps {
  item: GalleryItem;
  priority?: boolean;
}

const weightColors: Record<string, string> = {
  'Light': 'bg-slate-800 text-slate-300 border-slate-700',
  'Medium': 'bg-slate-800 text-slate-300 border-slate-700',
  'Heavy': 'bg-slate-800 text-slate-300 border-slate-700',
  'Massive': 'bg-slate-800 text-slate-300 border-slate-700',
};

function getGenderInitial(gender: string) {
  if (!gender) return '';
  return gender.charAt(0).toUpperCase();
}

export default function ScreenshotCard({ item, priority }: ScreenshotCardProps) {
  const [copied, setCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleCopy = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(item.exportString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="group flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden hover:-translate-y-1 hover:shadow-glow-frost transition-all duration-300">
        {/* Image Container */}
        <div 
          className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
        <Image 
          src={item.imageUrl}
          alt={item.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Copy String overlay button on hover */}
        <div className="absolute top-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={handleCopy}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md border backdrop-blur-md transition-colors ${
              copied 
                ? 'bg-uncommon-green/20 border-uncommon-green text-uncommon-green' 
                : 'bg-slate-900/80 border-slate-700 text-frost-blue hover:bg-slate-800'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy String'}
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-space font-semibold text-lg leading-tight text-slate-50 line-clamp-2 flex-1">
            {item.title}
          </h3>
          <div className="flex flex-col gap-1 items-end">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full whitespace-nowrap bg-frost-blue/10 text-frost-blue border border-frost-blue/20">
              {item.race} {getGenderInitial(item.gender)}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full whitespace-nowrap border ${weightColors[item.visualWeight] || weightColors['Medium']}`}>
              {item.visualWeight}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
              {item.author[0].toUpperCase()}
            </div>
            <span className="text-sm text-slate-400">by <span className="text-slate-300">{item.author}</span></span>
          </div>
          
          <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-frost-blue transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="text-sm font-medium">{item.upvotes}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Lightbox Modal */}
    {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800 rounded-full backdrop-blur-md transition-all z-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="relative w-full max-w-7xl h-full max-h-[90vh] rounded-lg overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <Image 
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-contain bg-slate-950"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
