import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Loader2, Palette, Gamepad2, Lock, PieChart, TrendingUp, AlertCircle } from 'lucide-react';

const DashboardAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAnalytics();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat statistik. Pastikan server merespons.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#8B5CF6]" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-400 bg-red-500/10 rounded-2xl border border-red-500/20">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-black uppercase italic mb-2">Hub <span className="text-[#8B5CF6]">Analytics</span></h2>
        <p className="text-gray-400">Ringkasan aktivitas dan isi database KucingAbu Hub Anda.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Karya" 
          value={stats.total_galleries} 
          icon={Palette} 
          color="from-purple-500/20 to-fuchsia-500/20"
          textColor="text-fuchsia-400"
        />
        <StatCard 
          title="Koleksi Game" 
          value={stats.total_games} 
          icon={Gamepad2} 
          color="from-cyan-500/20 to-blue-500/20"
          textColor="text-cyan-400"
        />
        <StatCard 
          title="Vault Record" 
          value={stats.total_vaults} 
          icon={Lock} 
          color="from-emerald-500/20 to-teal-500/20"
          textColor="text-emerald-400"
        />
      </div>

      {/* Category Distribution & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="text-[#8B5CF6]" size={20} />
            <h3 className="font-bold text-lg">Distribusi Kategori Karya</h3>
          </div>
          {stats.category_stats && stats.category_stats.length > 0 ? (
            <div className="space-y-4">
              {stats.category_stats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                  <span className="font-medium text-gray-300">{stat.category}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF]" 
                        style={{ width: `${Math.min(100, (stat.count / Math.max(1, stats.total_galleries)) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-lg text-sm">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Belum ada data kategori.</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#00F5FF]/10 border border-[#8B5CF6]/20 rounded-3xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4 text-[#00F5FF]">
            <TrendingUp size={24} />
            <h3 className="font-bold text-xl">Sistem Terhubung</h3>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">
            API Backend berjalan normal. Server berhasil merangkum total <strong>{stats.total_galleries + stats.total_games + stats.total_vaults}</strong> entri data dari seluruh tabel (Gallery, Games, dan Vault).
          </p>
          <div className="inline-block bg-black/50 border border-[#00F5FF]/30 px-4 py-2 rounded-xl text-sm font-mono text-[#00F5FF] w-max">
            Status: HEALTHY_ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, textColor }) => (
  <div className={`bg-gradient-to-br ${color} border border-white/10 rounded-3xl p-6 relative overflow-hidden group`}>
    <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
      <Icon size={120} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 bg-black/40 rounded-lg ${textColor}`}>
          <Icon size={20} />
        </div>
        <h3 className="font-medium text-gray-300">{title}</h3>
      </div>
      <p className="text-5xl font-black text-white">{value}</p>
    </div>
  </div>
);

export default DashboardAnalytics;
