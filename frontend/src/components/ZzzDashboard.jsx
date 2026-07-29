import React from 'react';
import { Film, CheckCircle2, Ticket, PlaySquare, Coffee } from 'lucide-react';

export default function ZzzDashboard({ data }) {
  if (!data) return null;
  const d = data;
  
  const calcPercent = (curr, max) => Math.min((curr / max) * 100, 100);

  // Fungsi helper untuk merapikan Video Store status string
  const formatVideoStore = (state) => {
    if (state.includes("REVENUE_AVAILABLE") || state.includes("SaleStateDone")) {
      return "Pendapatan Tersedia!";
    }
    return "Sedang Beroperasi";
  };

  const formatCoffee = (state) => {
    if (state.includes("YES") || state.includes("CardSignYes")) {
      return "Sudah Diminum";
    }
    return "Belum Minum";
  };

  return (
    <div className="py-4 font-sans animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-black italic tracking-tighter text-lime-400">Zenless Zone Zero</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-lime-400/50 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* KOLOM KIRI: Real-Time Notes */}
        <div className="space-y-6">
          <h2 className="text-xl font-black italic text-lime-400 border-b border-white/10 pb-2 uppercase tracking-wide">
            ⚡ Inter-Knot Status
          </h2>
          
          <div className="bg-slate-900/80 backdrop-blur-md border border-lime-500/20 rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-end mb-3">
              <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Battery Charge</h3>
              <span className="text-2xl font-black text-lime-300">{d.battery_current} <span className="text-sm text-slate-500">/ {d.battery_max}</span></span>
            </div>
            <div className="w-full h-4 bg-black/60 rounded-sm overflow-hidden skew-x-[-10deg]">
              <div 
                className="h-full bg-lime-400 shadow-[0_0_15px_#a3e635] transition-all duration-1000"
                style={{ width: `${calcPercent(d.battery_current, d.battery_max)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-lime-500/20 rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-end mb-3">
              <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Errands (Engagement)</h3>
              <span className="text-2xl font-black text-yellow-300">{d.engagement_current} <span className="text-sm text-slate-500">/ {d.engagement_max}</span></span>
            </div>
            <div className="w-full h-4 bg-black/60 rounded-sm overflow-hidden skew-x-[-10deg]">
              <div 
                className="h-full bg-yellow-400 shadow-[0_0_15px_#facc15] transition-all duration-1000"
                style={{ width: `${calcPercent(d.engagement_current, d.engagement_max)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-lime-500/20 rounded-xl p-3 flex flex-col items-center text-center group">
              <Ticket className="text-lime-400 mb-2 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Scratch Card</span>
              {d.scratch_card_completed ? (
                <span className="text-xs font-bold text-lime-400 flex items-center gap-1"><CheckCircle2 size={12}/> Selesai</span>
              ) : (
                <span className="text-xs font-bold text-red-400">Belum</span>
              )}
            </div>
            <div className="bg-slate-900/80 border border-lime-500/20 rounded-xl p-3 flex flex-col items-center text-center group">
              <Film className="text-lime-400 mb-2 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Video Store</span>
              <span className="text-xs font-bold text-lime-400 text-balance">{formatVideoStore(d.video_store_state)}</span>
            </div>
            <div className="bg-slate-900/80 border border-lime-500/20 rounded-xl p-3 flex flex-col items-center text-center group">
              <Coffee className="text-lime-400 mb-2 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Coffee</span>
              <span className="text-xs font-bold text-lime-400">{formatCoffee(d.coffee_status)}</span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Akun & Endgame */}
        <div className="space-y-6">
          <h2 className="text-xl font-black italic text-lime-400 border-b border-white/10 pb-2 uppercase tracking-wide">
            📁 Proxy Data
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Agents', val: d.agents },
              { label: 'Bangboo', val: d.bangboo },
              { label: 'Hari Aktif', val: d.active_days },
              { label: 'Pencapaian', val: d.achievements },
            ].map((stat, i) => (
              <div key={i} className="bg-black/40 border border-lime-500/10 rounded-xl p-3 text-center">
                <div className="font-black text-xl text-slate-200">{stat.val}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black italic text-lime-400 border-b border-white/10 pb-2 pt-2 uppercase tracking-wide flex items-center gap-2">
            <PlaySquare size={20} /> Misi Mingguan
          </h2>
          <div className="bg-slate-900/80 border border-lime-500/20 rounded-xl p-5 space-y-5">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Hollow Zero Bounty</span>
                <span className="text-lg font-black text-lime-400">{d.hollow_bounty_current} <span className="text-sm text-slate-500">/ {d.hollow_bounty_total}</span></span>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-sm overflow-hidden">
                <div 
                  className="h-full bg-lime-400 transition-all duration-1000"
                  style={{ width: `${calcPercent(d.hollow_bounty_current, d.hollow_bounty_total)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">BP / Weekly Points</span>
                <span className="text-lg font-black text-lime-400">{d.weekly_point_current} <span className="text-sm text-slate-500">/ {d.weekly_point_max}</span></span>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-sm overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-1000"
                  style={{ width: `${calcPercent(d.weekly_point_current, d.weekly_point_max)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-black italic text-lime-400 border-b border-white/10 pb-2 pt-2 uppercase tracking-wide">
            🏆 Endgame
          </h2>
          <div className="bg-slate-900/80 border border-lime-500/20 rounded-xl p-5 flex justify-between items-center group hover:bg-white/5 transition-colors">
            <div className="flex flex-col">
              <span className="font-black text-slate-300 group-hover:text-lime-300 transition-colors uppercase tracking-wider">Shiyu Defense</span>
              <span className="text-xs text-slate-500 mt-1">Frontier Terselesaikan</span>
            </div>
            <div className="flex items-center gap-2 text-lime-400 font-black bg-lime-900/30 px-4 py-2 rounded-lg border border-lime-500/30 text-2xl skew-x-[-10deg]">
              <span className="skew-x-[10deg]">{d.shiyu_defense}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
