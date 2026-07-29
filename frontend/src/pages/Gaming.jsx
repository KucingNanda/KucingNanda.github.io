import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Loader2, ChevronDown, ChevronUp, UserCircle, Star, Quote } from 'lucide-react';
import { apiService } from '../services/api';
import { Helmet } from 'react-helmet-async';
import GenshinDashboard from '../components/GenshinDashboard';
import HsrDashboard from '../components/HsrDashboard';
import ZzzDashboard from '../components/ZzzDashboard';

const Gaming = () => {
  const [games, setGames] = useState([]);
  const [hoyoverseData, setHoyoverseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk menyimpan ID game yang sedang terbuka accordion-nya
  const [expandedGameId, setExpandedGameId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch data profil game dasar dari database (via Golang)
        const gamesData = await apiService.getGames();
        
        // Sesuai request, filter hanya untuk game HoYoverse saat ini
        const hoyoGames = (gamesData || []).filter(g => 
          ['Genshin Impact', 'Honkai: Star Rail', 'Zenless Zone Zero'].includes(g.game_name)
        );
        setGames(hoyoGames);

        // 2. Fetch Live Stats dari Python Microservice (via Golang proxy)
        const liveData = await apiService.request('/hoyoverse');
        if (liveData && liveData.success) {
          setHoyoverseData(liveData);
        }
      } catch (err) {
        console.error("Failed to fetch games or live data:", err);
        setError("Gagal memuat data dari server.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleAccordion = (gameId) => {
    setExpandedGameId(prev => (prev === gameId ? null : gameId));
  };

  // Komponen Helper untuk me-render Dashboard yang tepat berdasarkan nama game
  const renderLiveDashboard = (gameName) => {
    if (!hoyoverseData) {
      return (
        <div className="p-8 text-center text-slate-400">
          <p>Data Live Stats belum tersedia atau server sedang sinkronisasi...</p>
        </div>
      );
    }

    if (gameName === 'Genshin Impact') {
      return <GenshinDashboard data={hoyoverseData.data} />;
    } else if (gameName === 'Honkai: Star Rail') {
      return <HsrDashboard data={hoyoverseData.hsr_data} />;
    } else if (gameName === 'Zenless Zone Zero') {
      return <ZzzDashboard data={hoyoverseData.zzz_data} />;
    }
    
    return null;
  };

  // Helper untuk mendapatkan data Level / Rank dari API Python
  const getGameLevel = (gameName) => {
    if (!hoyoverseData) return null;
    
    if (gameName === 'Genshin Impact' && hoyoverseData.data?.info?.level) {
      return `AR ${hoyoverseData.data.info.level}`;
    } else if (gameName === 'Honkai: Star Rail' && hoyoverseData.hsr_data?.info?.level) {
      return `TL ${hoyoverseData.hsr_data.info.level}`;
    }
    
    return null;
  };

  return (
    <>
      <Helmet>
        <title>Gaming Corner | KucingAbu Hub</title>
        <meta name="description" content="Koleksi game HoYoverse dan statistik real-time KucingAbu." />
      </Helmet>
      
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative min-h-screen font-sans">
        {/* Header */}
        <div className="mb-12 relative z-10">
          <h2 className="text-5xl font-black mb-2 italic tracking-tight">
            Gaming <span className="text-[#00F5FF]">Corner</span>
          </h2>
          <p className="text-gray-400">Live Stats & Eksplorasi HoYoverse Universe.</p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 relative z-10 text-sky-400">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p>Menghubungkan...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 py-10 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-md mx-auto text-center relative z-10">
            <p>{error}</p>
          </div>
        ) : games && games.length > 0 ? (
          <div className="flex flex-col gap-6 relative z-10">
            {games.map((game, idx) => {
              const isExpanded = expandedGameId === game.id;
              
              return (
                <div key={game.id || idx} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-lg transition-all duration-300">
                  {/* Card Header (Selalu Tampil) */}
                  <div 
                    onClick={() => toggleAccordion(game.id)}
                    className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex gap-5 items-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${idx % 2 === 0 ? 'from-[#8B5CF6]' : 'from-[#00F5FF]'} to-black flex items-center justify-center shadow-lg shrink-0 overflow-hidden`}>
                        {game.icon_url ? (
                          <img src={game.icon_url} alt={game.game_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <Gamepad2 className="text-white" size={28} />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-2xl font-black italic tracking-tight group-hover:text-[#00F5FF] transition-colors">
                          {game.game_name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono text-gray-400 bg-black/40 px-2 py-0.5 rounded-md border border-white/5">UID: {game.uid}</span>
                          <span className="text-sm font-bold text-[#8B5CF6]">{game.nickname}</span>
                          {getGameLevel(game.game_name) && (
                            <span className="text-[10px] uppercase tracking-widest font-black text-black bg-[#00F5FF] px-2 py-0.5 rounded-sm shadow-[0_0_10px_#00F5FF]/40">
                              {getGameLevel(game.game_name)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow Indicator */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-[#00F5FF]/20 text-[#00F5FF] rotate-180' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                      <ChevronDown size={24} />
                    </div>
                  </div>

                  {/* Accordion Content (Live Stats) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/5 p-6 md:p-8 bg-black/20">
                          {/* Opsi A: Data Database / Catatan Pemain */}
                          {(game.description || game.favorite_character || game.bio) && (
                            <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start backdrop-blur-sm">
                              <div className="flex-1 space-y-4">
                                <h4 className="text-[#00F5FF] font-bold flex items-center gap-2 mb-2 uppercase tracking-widest text-xs">
                                  <UserCircle size={16} /> Catatan Pemain
                                </h4>
                                
                                {game.description && (
                                  <p className="text-gray-300 italic text-lg leading-relaxed">
                                    "{game.description}"
                                  </p>
                                )}
                                
                                {game.bio && (
                                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-sm text-gray-400 flex gap-3">
                                    <Quote size={20} className="text-[#8B5CF6] shrink-0" />
                                    <p className="whitespace-pre-wrap">{game.bio}</p>
                                  </div>
                                )}
                              </div>
                              
                              {game.favorite_character && (
                                <div className="shrink-0 bg-black/40 border border-[#8B5CF6]/30 rounded-xl p-4 flex flex-col items-center justify-center min-w-[140px] group hover:border-[#00F5FF]/50 transition-colors">
                                  <Star size={24} className="text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                                  <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Main Character</span>
                                  <span className="font-bold text-white text-center">{game.favorite_character}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {renderLiveDashboard(game.game_name)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 py-20 bg-white/5 rounded-2xl border border-white/10 text-center relative z-10">
            <Gamepad2 className="mx-auto mb-4 text-white/20" size={48} />
            <p>Belum ada data game HoYoverse yang tersedia.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Gaming;
