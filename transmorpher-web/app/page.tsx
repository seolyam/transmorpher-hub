'use client';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/gallery/Navbar';
import ScreenshotCard from '@/components/gallery/ScreenshotCard';
import UploadModal from '@/components/gallery/UploadModal';
import { createBrowserClient } from '@/src/lib/supabase';
import { GalleryItem } from '@/lib/mockData';

const classMapInverse: Record<number, string> = {
  1: 'Warrior',
  2: 'Paladin',
  3: 'Hunter',
  4: 'Rogue',
  5: 'Priest',
  6: 'Death Knight',
  7: 'Shaman',
  8: 'Mage',
  9: 'Warlock',
  11: 'Druid',
};

const CLASSES = ['Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Death Knight', 'Shaman', 'Mage', 'Warlock', 'Druid'];

export default function Home() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient() as any;

  const fetchLoadouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('loadouts')
        .select(`
          *,
          profiles!loadouts_author_id_fkey ( username ),
          loadout_upvote_counts ( upvote_count )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (data) {
        const formatted: GalleryItem[] = data.map((loadout: any) => {
          // Extract upvote count
          const countWrapper = loadout.loadout_upvote_counts;
          const upvotes = Array.isArray(countWrapper) && countWrapper.length > 0
            ? countWrapper[0]?.upvote_count || 0
            : 0;

          // Map class ID back to string
          const className = classMapInverse[loadout.class_id] || 'Warrior';
          
          return {
            id: loadout.id,
            title: loadout.title,
            author: loadout.profiles?.username || 'Community',
            className: className as any,
            upvotes: upvotes,
            imageUrl: loadout.image_url || '/placeholder.png',
            exportString: loadout.import_string,
          };
        });
        setItems(formatted);
      }
    } catch (e: any) {
      console.error('Failed to fetch loadouts:', e);
      setError(e.message || 'Failed to load gallery transmogs.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Initial load
  useEffect(() => {
    fetchLoadouts();
  }, [fetchLoadouts]);

  // Handle modal close -> refetch to show newly uploaded item
  const handleModalClose = () => {
    setIsUploadOpen(false);
    fetchLoadouts();
  };

  const handleFilterClick = (cls: string) => {
    if (activeFilter === cls) {
      setActiveFilter(null); // Toggle off
    } else {
      setActiveFilter(cls);
    }
  };

  const filteredItems = activeFilter
    ? items.filter(item => item.className === activeFilter)
    : items;

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col relative pb-20">
      
      {/* Navigation */}
      <Navbar onUploadClick={() => setIsUploadOpen(true)} />

      {/* Hero Section */}
      <section className="w-full max-w-[1440px] mx-auto px-6 py-12 flex flex-col items-center justify-center text-center gap-6 animate-in fade-in duration-500">
        <h1 className="font-space font-bold text-4xl md:text-5xl text-zinc-50 tracking-tight">
          Discover WotLK Transmogs
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl">
          Share your World of Warcraft: Wrath of the Lich King transmog sets with the community. 
          Upload in-game screenshots and copy export strings instantly.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {CLASSES.map(cls => {
            const isActive = activeFilter === cls;
            return (
              <button 
                key={cls}
                onClick={() => handleFilterClick(cls)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-legendary-orange border-legendary-orange text-zinc-950 shadow-glow-orange' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800'
                }`}
              >
                {cls}
              </button>
            );
          })}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="w-full max-w-[1440px] mx-auto px-6 mt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg className="animate-spin h-8 w-8 text-legendary-orange" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-zinc-500 text-sm">Loading transmogs...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-red-500 font-medium mb-2">Error loading database</p>
            <p className="text-zinc-500 text-sm max-w-md">{error}</p>
            <button 
              onClick={fetchLoadouts}
              className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-md border border-zinc-800 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-zinc-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
            </svg>
            <p className="text-zinc-400 font-medium">No transmogs found</p>
            <p className="text-zinc-600 text-sm">
              {activeFilter 
                ? `Be the first to upload a ${activeFilter} loadout!` 
                : 'Be the first to upload a transmog loadout!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredItems.map((item, index) => (
              <ScreenshotCard key={item.id} item={item} priority={index < 3} />
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={handleModalClose} 
      />

    </main>
  );
}
