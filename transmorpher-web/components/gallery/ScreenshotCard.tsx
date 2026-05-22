'use client';
import Image from 'next/image';
import { GalleryItem } from '@/lib/mockData';
import { useState } from 'react';

interface ScreenshotCardProps {
  item: GalleryItem;
  priority?: boolean;
}

const classColors: Record<string, string> = {
  'Warrior': 'bg-class-warrior text-zinc-950',
  'Paladin': 'bg-class-paladin text-zinc-950',
  'Hunter': 'bg-class-hunter text-zinc-950',
  'Rogue': 'bg-class-rogue text-zinc-950',
  'Priest': 'bg-class-priest text-zinc-950',
  'Death Knight': 'bg-class-deathknight text-white',
  'Shaman': 'bg-class-shaman text-white',
  'Mage': 'bg-class-mage text-zinc-950',
  'Warlock': 'bg-class-warlock text-white',
  'Druid': 'bg-class-druid text-zinc-950',
};

export default function ScreenshotCard({ item, priority }: ScreenshotCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.exportString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex flex-col bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden hover:-translate-y-1 hover:shadow-glow-orange transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
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
                : 'bg-zinc-900/80 border-zinc-700 text-legendary-orange hover:bg-zinc-800'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy String'}
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-space font-semibold text-lg leading-tight text-zinc-50 line-clamp-2">
            {item.title}
          </h3>
          <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full whitespace-nowrap ${classColors[item.className]}`}>
            {item.className}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800/50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
              {item.author[0].toUpperCase()}
            </div>
            <span className="text-sm text-zinc-400">by <span className="text-zinc-300">{item.author}</span></span>
          </div>
          
          <div className="flex items-center gap-1.5 text-zinc-500 group-hover:text-legendary-orange transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="text-sm font-medium">{item.upvotes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
