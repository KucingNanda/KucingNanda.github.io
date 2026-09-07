import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Loader2, UserCircle, Star, Quote } from 'lucide-react';
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
  
  // State untuk menyimpan ID game yang sedang aktif (Tab yang dipilih)
  const [activeGameId, setActiveGameId] = useState(null);

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
        
        if (hoyoGames.length > 0) {
          setActiveGameId(hoyoGames[0].id); // Set tab pertama sebagai aktif secara default
        }

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

  // Komponen Helper untuk me-render Dashboard yang tepat berdasarkan nama game
  const renderLiveDashboard = (gameName) => {
    if (!hoyoverseData) {
      return (
        <div className="p-8 text-center text-slate-400 border border-white/5 rounded-2xl bg-black/40 mt-6">
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

  const activeGame = games.find(g => g.id === activeGameId);

  return (
    <>
      <Helmet>
        <title>Gaming Corner | KucingAbu Hub</title>
        <meta name="description" content="Koleksi game HoYoverse dan statistik real-time KucingAbu." />
      </Helmet>
      
      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto relative min-h-screen font-sans">
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
            
            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
              {games.map(game => {
                const isActive = activeGameId === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => setActiveGameId(game.id)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 min-w-max border text-left ${
                      isActive 
                        ? 'bg-white/10 border-[#00F5FF]/50 shadow-[0_0_20px_rgba(0,245,255,0.15)]' 
                        : 'bg-black/40 border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center overflow-hidden shrink-0 shadow-lg ${
                      isActive ? 'from-[#00F5FF] to-[#8B5CF6]' : 'from-gray-700 to-black'
                    }`}>
                      {game.icon_url ? (
                        <img src={game.icon_url} alt={game.game_name} className="w-full h-full object-cover" />
                      ) : (
                        <Gamepad2 className="text-white" size={24} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-black italic tracking-tight text-lg ${isActive ? 'text-white' : ''}`}>
                          {game.game_name}
                        </h3>
                        {getGameLevel(game.game_name) && (
                          <span className={`text-[9px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded-sm ${isActive ? 'bg-[#00F5FF] text-black shadow-[0_0_10px_#00F5FF]/40' : 'bg-white/10 text-white'}`}>
                            {getGameLevel(game.game_name)}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-mono mt-0.5 ${isActive ? 'text-[#00F5FF]' : 'opacity-60'}`}>
                        UID: {game.uid}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Game Content */}
            <div className="relative z-10 w-full">
              <AnimatePresence mode="wait">
                {activeGame && (
                  <motion.div
                    key={activeGame.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
                      {/* Opsi A: Data Database / Catatan Pemain */}
                      {(activeGame.description || activeGame.favorite_character || activeGame.bio) && (
                        <div className="mb-8 bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
                          <div className="flex-1 space-y-4">
                            <h4 className="text-[#00F5FF] font-bold flex items-center gap-2 mb-2 uppercase tracking-widest text-xs">
                              <UserCircle size={16} /> Catatan Pemain
                            </h4>
                            
                            {activeGame.description && (
                              <p className="text-gray-200 italic text-lg leading-relaxed font-light">
                                "{activeGame.description}"
                              </p>
                            )}
                            
                            {activeGame.bio && (
                              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-300 flex gap-3">
                                <Quote size={20} className="text-[#8B5CF6] shrink-0" />
                                <p className="whitespace-pre-wrap leading-relaxed">{activeGame.bio}</p>
                              </div>
                            )}
                          </div>
                          
                          {activeGame.favorite_character && (
                            <div className="shrink-0 bg-white/5 border border-[#8B5CF6]/30 rounded-xl p-5 flex flex-col items-center justify-center min-w-[150px] shadow-lg">
                              <Star size={28} className="text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                              <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Main Character</span>
                              <span className="font-bold text-white text-center text-lg">{activeGame.favorite_character}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Live Dashboard Section */}
                      {renderLiveDashboard(activeGame.game_name)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
