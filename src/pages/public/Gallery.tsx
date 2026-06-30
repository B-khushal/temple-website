import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Search, Image, Film, Sparkles, X, ZoomIn, Play } from 'lucide-react';

export function Gallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumFilter, setAlbumFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Lightbox overlay state
  const [activeMedia, setActiveMedia] = useState<any | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await api.get('/api/gallery');
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Failed to load gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Compute available albums and categories dynamically
  const albums = ['All', ...Array.from(new Set(items.map(i => i.album)))];
  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  // Filtering logic
  const filteredItems = items.filter(item => {
    const matchesAlbum = albumFilter === 'All' || item.album === albumFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.album.toLowerCase().includes(search.toLowerCase());

    return matchesAlbum && matchesCategory && matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 animate-spin rounded-full border-4 border-[#9B2226] border-t-transparent mb-4"></div>
        <p className="text-[#3E2723] text-xs uppercase tracking-widest font-sans font-bold">Illuminating Temple Gallery...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#FDFBF7] font-serif text-[#3E2723]">
      {/* Hero Header */}
      <section 
        className="relative py-24 text-center px-4"
        style={{
          background: 'linear-gradient(to bottom, #23080c 0%, #3e1217 100%)',
        }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="text-[#CFB53B] font-sans font-bold text-xs uppercase tracking-[0.25em]">Divine Splendor</span>
          <h1 className="text-4xl md:text-5xl font-bold italic text-white leading-tight">Media Gallery</h1>
          <div className="h-0.5 w-24 bg-[#CFB53B] mx-auto my-4" />
          <p className="text-sm font-sans text-orange-100 max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
            Explore images and videos of temple darshan, grand celebrations, and community programs.
          </p>
        </div>
      </section>

      {/* Toolbar / Filters */}
      <div className="bg-[#F5F2ED] border-b border-[#EEDCC1] py-6 px-4 font-sans text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-center">
          
          {/* Search */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title/album..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#EEDCC1] rounded-lg bg-white"
            />
          </div>

          {/* Type Filter */}
          <div className="space-y-1 w-full">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#EEDCC1] rounded-lg bg-white font-medium"
            >
              <option value="All">All Formats</option>
              <option value="image">Photos Only</option>
              <option value="video">Videos Only</option>
            </select>
          </div>

          {/* Album Filter */}
          <div className="space-y-1 w-full">
            <select
              value={albumFilter}
              onChange={e => setAlbumFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#EEDCC1] rounded-lg bg-white font-medium"
            >
              <option value="All">All Albums</option>
              {albums.filter(a => a !== 'All').map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-1 w-full">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#EEDCC1] rounded-lg bg-white font-medium"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => { setAlbumFilter('All'); setCategoryFilter('All'); setTypeFilter('All'); setSearch(''); }}
            className="w-full py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold uppercase rounded-lg transition-colors cursor-pointer text-center"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item._id}
              onClick={() => setActiveMedia(item)}
              className="group relative bg-white border border-[#EEDCC1] rounded-3xl overflow-hidden shadow-sm cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
            >
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                <img 
                  src={item.thumbnailUrl || item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Media Icon Indicators */}
                <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-sm rounded-xl text-white">
                  {item.type === 'video' ? <Film className="w-4 h-4" /> : <Image className="w-4 h-4" />}
                </div>

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  {item.type === 'video' ? (
                    <div className="w-12 h-12 rounded-full bg-[#9B2226] flex items-center justify-center animate-pulse border border-[#CFB53B]">
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    </div>
                  ) : (
                    <ZoomIn className="w-8 h-8" />
                  )}
                </div>
              </div>
              
              <div className="p-5 space-y-1">
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#CFB53B]">{item.album}</span>
                <h4 className="text-sm font-bold text-gray-800 font-serif leading-tight">{item.title}</h4>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400 font-sans">
              No media entries found in the gallery matching current filter.
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeMedia && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          {/* Top header overlay bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10 font-sans text-xs">
            <span className="text-[#CFB53B] uppercase tracking-widest font-bold font-sans">Darshan Viewer</span>
            <button
              onClick={() => setActiveMedia(null)}
              className="p-3 bg-white/10 hover:bg-[#9B2226] text-white rounded-full transition-colors cursor-pointer border-0 flex items-center justify-center"
              aria-label="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Media frame */}
          <div className="max-w-4xl w-full max-h-[70vh] flex items-center justify-center overflow-hidden mt-16 p-2">
            {activeMedia.type === 'video' ? (
              <iframe
                src={activeMedia.url}
                title={activeMedia.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video rounded-2xl shadow-2xl bg-black border border-[#CFB53B]/20"
              ></iframe>
            ) : (
              <img
                src={activeMedia.url}
                alt={activeMedia.title}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl border border-[#CFB53B]/20"
              />
            )}
          </div>

          {/* Media Info Footer */}
          <div className="text-center mt-6 text-white max-w-lg space-y-1 px-4">
            <span className="text-[10px] font-sans uppercase font-bold text-[#CFB53B] tracking-widest">{activeMedia.album} / {activeMedia.category}</span>
            <h3 className="text-base sm:text-lg font-serif italic">{activeMedia.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
export default Gallery;
