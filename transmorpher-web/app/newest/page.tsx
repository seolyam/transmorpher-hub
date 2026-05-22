'use client';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/gallery/Navbar';
import ScreenshotCard from '@/components/gallery/ScreenshotCard';
import UploadModal from '@/components/gallery/UploadModal';
import { createBrowserClient } from '@/src/lib/supabase';
import { GalleryItem } from '@/lib/mockData';

export const RACES = {
  Alliance: ['Human', 'Dwarf', 'Night Elf', 'Gnome', 'Draenei'],
  Horde: ['Orc', 'Undead', 'Tauren', 'Troll', 'Blood Elf']
};
export const WEIGHTS = ['Light', 'Medium', 'Heavy', 'Massive'];
export const GENDERS = ['Male', 'Female'];

export default function Newest() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeRace, setActiveRace] = useState<string | null>(null);
  const [activeGender, setActiveGender] = useState<string | null>(null);
  const [activeWeight, setActiveWeight] = useState<string | null>(null);
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

          return {
            id: loadout.id,
            title: loadout.title,
            author: loadout.profiles?.username || 'Community',
            race: loadout.race || 'Unknown',
            gender: loadout.gender || 'Unknown',
            visualWeight: loadout.visual_weight || 'Medium',
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

  const filteredItems = items.filter(item => {
    if (activeRace && item.race !== activeRace) return false;
    if (activeGender && item.gender !== activeGender) return false;
    if (activeWeight && item.visualWeight !== activeWeight) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col relative pb-20">
      
      {/* Navigation */}
      <Navbar onUploadClick={() => setIsUploadOpen(true)} />

      {/* Hero Section */}
      <section className="w-full max-w-[1440px] mx-auto px-6 py-12 flex flex-col items-center justify-center text-center gap-6 animate-in fade-in duration-500">
        <h1 className="font-space font-bold text-4xl md:text-5xl text-slate-50 tracking-tight">
          Newest Transmogs
        </h1>
        <p className="text-slate-400 text-lg max-w-xl">
          The most recently uploaded World of Warcraft: Wrath of the Lich King transmog sets from the community.
        </p>

        {/* Filters Toggle */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="mt-4 px-6 py-2 rounded-full border border-slate-700 bg-slate-900 text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
          </svg>
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          {(activeRace || activeGender || activeWeight) && (
            <span className="ml-1 w-2 h-2 rounded-full bg-frost-blue shadow-glow-frost"></span>
          )}
        </button>

        {/* Collapsible Filters Section */}
        {isFilterOpen && (
          <div className="w-full max-w-4xl mt-6 p-6 bg-slate-900/50 border border-slate-800 rounded-xl text-left animate-in slide-in-from-top-4 fade-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800/50">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Filter Loadouts</h3>
              <button 
                onClick={() => {
                  setActiveRace(null);
                  setActiveGender(null);
                  setActiveWeight(null);
                }}
                className="text-xs font-medium text-slate-500 hover:text-white transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Visual Weight Filter */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-semibold text-slate-400">Visual Weight</h4>
                <div className="flex flex-wrap gap-2">
                  {WEIGHTS.map(weight => (
                    <button
                      key={weight}
                      onClick={() => setActiveWeight(activeWeight === weight ? null : weight)}
                      className={`px-3 py-1 text-xs font-medium rounded-md border transition-all ${
                        activeWeight === weight 
                          ? 'bg-frost-blue/20 border-frost-blue text-frost-blue shadow-glow-frost'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-semibold text-slate-400">Gender</h4>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map(gender => (
                    <button
                      key={gender}
                      onClick={() => setActiveGender(activeGender === gender ? null : gender)}
                      className={`px-3 py-1 text-xs font-medium rounded-md border transition-all ${
                        activeGender === gender 
                          ? 'bg-frost-blue/20 border-frost-blue text-frost-blue shadow-glow-frost'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Race Filter */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-semibold text-slate-400">Race</h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Alliance</span>
                    <div className="flex flex-wrap gap-2">
                      {RACES.Alliance.map(race => (
                        <button
                          key={race}
                          onClick={() => setActiveRace(activeRace === race ? null : race)}
                          className={`px-3 py-1 text-xs font-medium rounded-md border transition-all ${
                            activeRace === race 
                              ? 'bg-frost-blue/20 border-frost-blue text-frost-blue shadow-glow-frost'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                          }`}
                        >
                          {race}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Horde</span>
                    <div className="flex flex-wrap gap-2">
                      {RACES.Horde.map(race => (
                        <button
                          key={race}
                          onClick={() => setActiveRace(activeRace === race ? null : race)}
                          className={`px-3 py-1 text-xs font-medium rounded-md border transition-all ${
                            activeRace === race 
                              ? 'bg-frost-blue/20 border-frost-blue text-frost-blue shadow-glow-frost'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                          }`}
                        >
                          {race}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* Gallery Grid */}
      <section className="w-full max-w-[1440px] mx-auto px-6 mt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg className="animate-spin h-8 w-8 text-frost-blue" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-slate-500 text-sm">Loading transmogs...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-red-500 font-medium mb-2">Error loading database</p>
            <p className="text-slate-500 text-sm max-w-md">{error}</p>
            <button 
              onClick={fetchLoadouts}
              className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
            </svg>
            <p className="text-slate-400 font-medium">No transmogs found</p>
            <p className="text-slate-600 text-sm">
              {(activeRace || activeGender || activeWeight) 
                ? `No loadouts match your selected filters.` 
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
