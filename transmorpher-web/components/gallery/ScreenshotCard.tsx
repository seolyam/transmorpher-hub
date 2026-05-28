'use client';
import Image from 'next/image';
import { GalleryItem } from '@/lib/types';
import { useState } from 'react';
import { toggleLike, deleteLoadout } from '@/app/actions';
import CommentSection from './CommentSection';

interface ScreenshotCardProps {
  item: GalleryItem;
  priority?: boolean;
  currentUserId?: string | null;
  onUpdate?: () => void;
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

export default function ScreenshotCard({ item, priority, currentUserId, onUpdate }: ScreenshotCardProps) {
  const [copied, setCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [optimisticLike, setOptimisticLike] = useState({ hasLiked: item.hasLiked, count: item.likesCount });
  const [deleting, setDeleting] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return; // Optional: show toast to login

    // Optimistic update
    const newHasLiked = !optimisticLike.hasLiked;
    setOptimisticLike({
      hasLiked: newHasLiked,
      count: optimisticLike.count + (newHasLiked ? 1 : -1)
    });

    const result = await toggleLike(item.id, optimisticLike.hasLiked);
    if (!result.success) {
      // Revert if failed
      setOptimisticLike({ hasLiked: item.hasLiked, count: item.likesCount });
      console.error(result.error);
    } else {
      if (onUpdate) onUpdate();
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this loadout?")) return;
    setDeleting(true);
    const result = await deleteLoadout(item.id);
    if (result.success) {
      setIsLightboxOpen(false);
      if (onUpdate) onUpdate();
    } else {
      console.error(result.error);
      setDeleting(false);
    }
  };

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
          className="relative aspect-square w-full bg-slate-950 overflow-hidden cursor-pointer"
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
            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 overflow-hidden relative">
              {item.avatar_url ? (
                <Image src={item.avatar_url} alt={item.username} fill className="object-cover" />
              ) : (
                item.username[0].toUpperCase()
              )}
            </div>
            <span className="text-sm text-slate-400">by <span className="text-slate-300">{item.username}</span></span>
          </div>
          
          <button 
            onClick={handleLike}
            disabled={!currentUserId}
            className={`flex items-center gap-1.5 transition-colors p-1 -mr-1 rounded-md ${
              optimisticLike.hasLiked 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-slate-500 hover:text-red-400'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={optimisticLike.hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className="text-sm font-medium">{optimisticLike.count}</span>
          </button>
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
            className="relative w-full max-w-5xl bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto md:overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Column: Image */}
            <div className="relative w-full h-[50vh] md:h-[70vh] bg-slate-950">
              <Image 
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            
            {/* Right Column: Details */}
            <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
                  {currentUserId === item.user_id && (
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20 rounded-md hover:bg-red-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {deleting ? 'Deleting...' : 'Delete Post'}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400 overflow-hidden relative border border-slate-700">
                    {item.avatar_url ? (
                      <Image src={item.avatar_url} alt={item.username} fill className="object-cover" />
                    ) : (
                      item.username[0].toUpperCase()
                    )}
                  </div>
                  <span>by <span className="text-slate-300">{item.username}</span></span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-frost-blue/10 text-frost-blue border border-frost-blue/20">
                  {item.race} {getGenderInitial(item.gender)}
                </span>
                <span className={`px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full border ${weightColors[item.visualWeight] || weightColors['Medium']}`}>
                  {item.visualWeight}
                </span>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-800">
                <button
                  onClick={handleCopy}
                  className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-all ${
                    copied 
                      ? 'bg-uncommon-green/20 text-uncommon-green border border-uncommon-green' 
                      : 'bg-frost-blue hover:brightness-110 text-slate-950'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Export String
                    </>
                  )}
                </button>
              </div>

              <CommentSection loadoutId={item.id} currentUserId={currentUserId || null} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
