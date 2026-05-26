import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Loader2, X, Copy, Check, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';
import { Helmet } from 'react-helmet-async';

const Gaming = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk Master-Detail View
  const [selectedGame, setSelectedGame] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const data = await apiService.getGames();
        setGames(data || []);
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError("Gagal memuat data game dari server.");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const handleCopyUID = (uid) => {
    navigator.clipboard.writeText(uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fungsi untuk mem-parsing Bio secara dinamis
  const renderDynamicBio = (bioText) => {
    if (!bioText) return <p className="text-gray-500 italic">Belum ada bio/detail tambahan.</p>;
    
    const lines = bioText.split('\n').filter(line => line.trim() !== '');
    const badges = [];
    const paragraphs = [];

    lines.forEach((line, index) => {
      // Jika baris memiliki pola "Kunci: Nilai"
      if (line.includes(':')) {
        const parts = line.split(':');
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim(); // Jika ada ':' di value-nya
        badges.push(
          <div key={`badge-${index}`} className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-3">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">{key}</span>
            <span className="text-white font-medium text-sm text-right">{value}</span>
          </div>
        );
      } else {
        // Baris biasa (teks deskripsi)
        paragraphs.push(
          <p key={`p-${index}`} className="text-gray-300 text-sm leading-relaxed mb-2">
            {line}
          </p>
        );
      }
    });

    return (
      <div className="space-y-4">
        {badges.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {badges}
          </div>
        )}
        {paragraphs.length > 0 && (
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
            {paragraphs}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Gaming Corner | KucingAbu Hub</title>
        <meta name="description" content="Koleksi User ID (UID), profil gaming, dan game favorit KucingAbu." />
      </Helmet>
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10">
        <div>
          <h2 className="text-5xl font-black mb-2 italic">Gaming <span className="text-[#00F5FF]">Corner</span></h2>
          <p className="text-gray-500 tracking-tight">Perpustakaan game aktif.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 relative z-10">
          <Loader2 className="animate-spin text-[#00F5FF]" size={48} />
        </div>
      ) : error ? (
        <div className="text-red-500 py-10 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-md mx-auto text-center relative z-10">
          <p>{error}</p>
        </div>
      ) : games && games.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {games.map((game, idx) => (
            <motion.div 
              key={game.id || idx}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedGame(game)}
              className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors"
            >
              <div className="flex gap-4 items-center overflow-hidden">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${idx % 2 === 0 ? 'from-[#8B5CF6]' : 'from-[#00F5FF]'} to-black flex items-center justify-center shadow-lg shrink-0`}>
                  <Gamepad2 className="text-white" size={24} />
                </div>
                <div className="overflow-hidden flex flex-col gap-0.5">
                  <h4 className="text-lg font-bold truncate group-hover:text-[#00F5FF] transition-colors">{game.game_name}</h4>
                  <p className="text-sm font-mono text-gray-300 truncate">{game.uid}</p>
                  <p className="text-xs text-[#8B5CF6] font-medium truncate">{game.nickname}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#00F5FF]/20 group-hover:text-[#00F5FF] transition-colors">
                <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 py-20 bg-white/5 rounded-2xl border border-white/10 text-center relative z-10">
          <Gamepad2 className="mx-auto mb-4 text-white/20" size={48} />
          <p>Belum ada data game.</p>
        </div>
      )}

      {/* Modal Detail Game */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedGame(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f1423] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              {/* Header Modal */}
              <div className="p-6 md:p-8 border-b border-white/5 relative">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
                
                <div className="flex gap-5 items-center pr-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F5FF] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.3)] shrink-0">
                    <Gamepad2 className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tight">{selectedGame.game_name}</h3>
                    <p className="text-[#00F5FF] font-medium">{selectedGame.nickname}</p>
                  </div>
                </div>
              </div>

              {/* Body Modal (Scrollable) */}
              <div className="p-6 md:p-8 overflow-y-auto">
                {/* UID Section */}
                <div className="mb-8">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Player ID / UID</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 font-mono text-[#00F5FF] text-lg tracking-wider">
                      {selectedGame.uid}
                    </div>
                    <button 
                      onClick={() => handleCopyUID(selectedGame.uid)}
                      className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shrink-0"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      {copied ? 'Copied!' : 'Copy UID'}
                    </button>
                  </div>
                </div>

                {/* Dynamic Details Section */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Game Details</p>
                  {renderDynamicBio(selectedGame.bio)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default Gaming;
