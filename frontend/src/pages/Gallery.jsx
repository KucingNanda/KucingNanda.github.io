import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import { Helmet } from 'react-helmet-async';

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

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

  const filteredGalleries = galleries.filter(item => {
    if (activeFilter === 'All') return true;
    return item.info?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <>
      <Helmet>
        <title>Media Gallery | KucingAbu Hub</title>
        <meta name="description" content="Koleksi karya visual, AI Art, Cosplay, dan kreasi digital eksklusif dari KucingAbu Hub." />
      </Helmet>
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
      <h2 className="text-5xl font-black mb-4 uppercase italic">Media <span className="text-[#8B5CF6]">Gallery</span></h2>
      <p className="text-gray-500 mb-8">Koleksi karya visual dan eksperimen digital.</p>
      
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
      ) : filteredGalleries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGalleries.map((item) => (
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
