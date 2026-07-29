import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader2, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { apiService } from '../services/api';
import { Helmet } from 'react-helmet-async';

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filters = ['All', 'AI Art', 'Art', 'Cosplay'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const data = await apiService.getGallery();
        setGalleries(data || []);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
        setError("Gagal memuat data galeri dari server.");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const dynamicCategories = [...new Set(galleries.map(g => g.category).filter(Boolean))];

  const filteredGalleries = galleries.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.info?.toLowerCase() === activeFilter.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      (item.title && item.title.toLowerCase().includes(searchLower)) || 
      (item.tags && item.tags.toLowerCase().includes(searchLower));
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredGalleries.length / itemsPerPage);
  const currentItems = filteredGalleries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, selectedCategory]);

  return (
    <>
      <Helmet>
        <title>Media Gallery | KucingAbu Hub</title>
        <meta name="description" content="Koleksi karya visual, AI Art, Cosplay, dan kreasi digital eksklusif dari KucingAbu Hub." />
      </Helmet>
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
      <h2 className="text-5xl font-black mb-4 uppercase italic">Media <span className="text-[#8B5CF6]">Gallery</span></h2>
      <p className="text-gray-500 mb-8">Koleksi karya visual dan eksperimen digital.</p>
      
      {/* Search Bar & Category Dropdown */}
      <div className="max-w-3xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-gray-500" size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Cari judul atau tag..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00F5FF] focus:bg-white/10 transition-all"
          />
        </div>
        
        {/* Category Dropdown */}
        <div className="shrink-0 w-full md:w-64 relative">
           <select
             value={selectedCategory}
             onChange={(e) => setSelectedCategory(e.target.value)}
             className="w-full bg-[#0B0F19] border border-white/10 rounded-full py-3 pl-4 pr-10 text-gray-300 focus:outline-none focus:border-[#8B5CF6] transition-colors appearance-none cursor-pointer"
           >
             <option value="All">Semua Kategori Game</option>
             {dynamicCategories.map(cat => (
               <option key={cat} value={cat}>{cat}</option>
             ))}
           </select>
           <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
             <ChevronDown className="text-gray-500" size={18} />
           </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === filter ? 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#8B5CF6]" size={48} />
        </div>
      ) : error ? (
        <div className="text-red-500 py-10 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-md mx-auto">
          <p>{error}</p>
        </div>
      ) : currentItems.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentItems.map((item) => (
              <div key={item.id} className="aspect-[9/16] bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group overflow-hidden relative">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <ImageIcon className="text-white/10 group-hover:scale-110 transition-transform" size={40} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-left">
                  <p className="text-[#00F5FF] font-mono text-[10px] uppercase mb-1">{item.category || 'Uncategorized'}</p>
                  <h4 className="font-bold text-white text-lg">{item.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">By: <span className="text-white">{item.artist_name || 'Unknown Artist'}</span></p>
                  {item.source_link && (
                    <a href={item.source_link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[10px] font-bold text-[#8B5CF6] hover:text-[#00F5FF] transition-colors border border-[#8B5CF6]/30 px-2 py-1 rounded w-max">
                      🔗 View Source
                    </a>
                  )}
                  {item.tags && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="text-xs bg-white/10 border border-white/10 px-2 py-1 rounded-md text-gray-300">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="text-gray-400 font-mono text-sm">
                Halaman <span className="text-white font-bold">{currentPage}</span> dari <span className="text-white font-bold">{totalPages}</span>
              </span>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-500 py-20 bg-white/5 rounded-2xl border border-white/10 max-w-2xl mx-auto">
          <ImageIcon className="mx-auto mb-4 text-white/20" size={48} />
          <p>Belum ada karya untuk kategori ini.</p>
        </div>
      )}
    </div>
    </>
  );
};

export default Gallery;
