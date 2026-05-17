import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

const Gaming = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-5xl font-black mb-2 italic">Gaming <span className="text-[#00F5FF]">Corner</span></h2>
          <p className="text-gray-500 tracking-tight">Perpustakaan game aktif dan progres pencapaian.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#00F5FF]" size={48} />
        </div>
      ) : error ? (
        <div className="text-red-500 py-10 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-md mx-auto text-center">
          <p>{error}</p>
        </div>
      ) : games && games.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {games.map((game, idx) => (
            <div key={game.id || idx} className="p-8 bg-white/5 border border-white/10 rounded-3xl flex gap-6 items-center group">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${idx % 2 === 0 ? 'from-[#8B5CF6]' : 'from-[#00F5FF]'} to-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0`}>
                <Gamepad2 className="text-white" size={32} />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-xl font-bold mb-1 truncate">{game.game_name}</h4>
                <p className="text-xs text-gray-400 mb-3 truncate">UID: {game.uid} • Fav: {game.favorite_character}</p>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${game.progress}%` }}
                    className={`h-full ${idx % 2 === 0 ? 'bg-[#8B5CF6]' : 'bg-[#00F5FF]'}`}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-500 uppercase">
                  <span>Progress</span>
                  <span>{game.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 py-20 bg-white/5 rounded-2xl border border-white/10 text-center">
          <Gamepad2 className="mx-auto mb-4 text-white/20" size={48} />
          <p>Belum ada data game.</p>
        </div>
      )}
    </div>
  );
};

export default Gaming;
