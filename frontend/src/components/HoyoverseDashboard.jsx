import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import HsrDashboard from './HsrDashboard';

export default function HoyoverseDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.request('/hoyoverse');
        if (!result || !result.success) {
          throw new Error(result.message || result.detail || 'Gagal mengambil data');
        }
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-sky-400 rounded-full animate-spin mb-4"></div>
        <p>Mengsinkronisasi dengan Irminsul...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-xl max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Gagal Memuat Data</h2>
          <p className="opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  const d = data.data;
  const calcPercent = (curr, max) => Math.min((curr / max) * 100, 100);

  return (
    <div className="py-6 font-sans">
      {/* --- BAGIAN GENSHIN IMPACT --- */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-sky-400">Genshin Impact</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-sky-400/50 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* KOLOM KIRI: Real-Time Notes */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-sky-400 border-b border-white/10 pb-2">
            ⚡ Status Real-Time
          </h2>
          
          <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-end mb-3">
              <h3 className="font-semibold text-slate-400">Original Resin</h3>
              <span className="text-2xl font-extrabold">{d.current_resin} / {d.max_resin}</span>
            </div>
            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 shadow-[0_0_10px_#60a5fa] rounded-full transition-all duration-1000"
                style={{ width: `${calcPercent(d.current_resin, d.max_resin)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-end mb-3">
              <h3 className="font-semibold text-slate-400">Realm Currency</h3>
              <span className="text-2xl font-extrabold">{d.current_realm_currency} / {d.max_realm_currency}</span>
            </div>
            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 shadow-[0_0_10px_#34d399] rounded-full transition-all duration-1000"
                style={{ width: `${calcPercent(d.current_realm_currency, d.max_realm_currency)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/70 border border-white/10 rounded-xl p-4 flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Misi Harian</span>
              <span className="text-2xl font-bold mt-1">{d.completed_commissions}/{d.max_commissions}</span>
            </div>
            <div className="bg-slate-800/70 border border-white/10 rounded-xl p-4 flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Diskon Boss</span>
              <span className="text-2xl font-bold mt-1">{d.max_resin_discounts - d.remaining_resin_discounts}/3</span>
            </div>
            <div className="bg-slate-800/70 border border-white/10 rounded-xl p-4 flex flex-col col-span-2">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Ekspedisi</span>
              <span className="text-2xl font-bold mt-1">{d.expeditions_count}/{d.max_expeditions}</span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Akun & Eksplorasi */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-sky-400 border-b border-white/10 pb-2">
            📊 Ringkasan Akun
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Hari Aktif', val: d.days_active },
              { label: 'Pencapaian', val: d.achievements },
              { label: 'Karakter', val: d.characters },
              { label: 'Lv.10 Max', val: d.max_friendship },
              { label: 'Waypoints', val: d.unlocked_waypoints },
              { label: 'Domains', val: d.unlocked_domains },
              { label: 'Spiral Abyss', val: d.abyss_floor },
              { label: 'Imaginarium Theater', val: `Babak ${d.theater_act || 0}` },
              { label: 'Stygian Onslaught', val: ['-', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][d.stygian_diff] || d.stygian_diff || '-' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-sky-400">{stat.val}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-sky-400 border-b border-white/10 pb-2 pt-2">
            🎁 Harta Karun (Chests)
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Common', val: d.common_chests },
              { label: 'Exquisite', val: d.exquisite_chests },
              { label: 'Precious', val: d.precious_chests },
              { label: 'Luxurious', val: d.luxurious_chests },
              { label: 'Remarkable', val: d.remarkable_chests },
            ].map((chest, i) => (
              <div key={i} className="flex justify-between items-center bg-black/20 rounded-lg px-3 py-2 text-sm">
                <span className="text-slate-400">{chest.label}</span>
                <span className="font-bold">{chest.val}</span>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-sky-400 border-b border-white/10 pb-2 pt-2">
            👁️ Oculi
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Anemo', val: d.anemoculi, col: 'border-emerald-400 text-emerald-400' },
              { name: 'Geo', val: d.geoculi, col: 'border-amber-400 text-amber-400' },
              { name: 'Electro', val: d.electroculi, col: 'border-purple-400 text-purple-400' },
              { name: 'Dendro', val: d.dendroculi, col: 'border-lime-400 text-lime-400' },
              { name: 'Hydro', val: d.hydroculi, col: 'border-blue-400 text-blue-400' },
              { name: 'Pyro', val: d.pyroculi, col: 'border-red-400 text-red-400' },
              { name: 'Luno', val: d.lunoculi, col: 'border-yellow-400 text-yellow-400' },
            ].map((oculi, i) => (
              <div key={i} className={`px-3 py-1 rounded-full text-xs font-bold border bg-black/20 flex gap-2 items-center ${oculi.col}`}>
                {oculi.name} <span>{oculi.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- BAGIAN HONKAI STAR RAIL --- */}
      {data.hsr_data && <HsrDashboard data={data.hsr_data} />}

      <footer className="mt-12 text-center text-slate-500 text-sm border-t border-white/5 pt-6">
        <p>Terakhir Diperbarui: {data.last_updated}</p>
      </footer>
    </div>
  );
}
