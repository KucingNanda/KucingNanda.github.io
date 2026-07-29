import React from 'react';

export default function HsrDashboard({ data }) {
  if (!data) return null;

  const d = data;
  const calcPercent = (curr, max) => Math.min((curr / max) * 100, 100);

  return (
    <div className="py-6 font-sans">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-amber-400">Honkai: Star Rail</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-amber-400/50 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* KOLOM KIRI: Real-Time Notes */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-purple-300 border-b border-white/10 pb-2">
            ⚡ Trailblaze Status
          </h2>
          
          <div className="bg-slate-900/70 backdrop-blur-md border border-purple-500/20 rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-end mb-3">
              <h3 className="font-semibold text-slate-400">Trailblaze Power</h3>
              <span className="text-2xl font-extrabold text-amber-400">{d.current_stamina} / {d.max_stamina}</span>
            </div>
            <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-amber-400 shadow-[0_0_10px_#fbbf24] rounded-full transition-all duration-1000"
                style={{ width: `${calcPercent(d.current_stamina, d.max_stamina)}%` }}
              ></div>
            </div>
            {d.current_reserve_stamina > 0 && (
              <div className="text-sm text-slate-400 text-right">
                Reserve: <span className="text-amber-200">{d.current_reserve_stamina}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/70 border border-purple-500/20 rounded-xl p-4 flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Daily Training</span>
              <span className="text-2xl font-bold mt-1 text-emerald-400">{d.current_train_score}/{d.max_train_score}</span>
            </div>
            <div className="bg-slate-900/70 border border-purple-500/20 rounded-xl p-4 flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Echo of War</span>
              <span className="text-2xl font-bold mt-1 text-rose-400">{d.remaining_weekly_discounts}/{d.max_weekly_discounts}</span>
            </div>
            <div className="bg-slate-900/70 border border-purple-500/20 rounded-xl p-4 flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Weekly Points</span>
              <span className="text-2xl font-bold mt-1 text-purple-400">{d.current_rogue_score}/{d.max_rogue_score}</span>
            </div>
            <div className="bg-slate-900/70 border border-purple-500/20 rounded-xl p-4 flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Assignments</span>
              <span className="text-2xl font-bold mt-1 text-sky-400">{d.expeditions_count}/{d.max_expeditions}</span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Akun Summary */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-purple-300 border-b border-white/10 pb-2">
            📊 Data Perjalanan
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Hari Aktif', val: d.days_active },
              { label: 'Pencapaian', val: d.achievements },
              { label: 'Karakter', val: d.characters },
              { label: 'Chests', val: d.chests },
              { label: 'Stickers', val: d.stickers },
            ].map((stat, i) => (
              <div key={i} className="bg-black/40 border border-purple-500/20 rounded-xl p-3 text-center hover:bg-white/5 transition-colors">
                <div className="text-2xl font-bold text-amber-400">{stat.val}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-purple-300 border-b border-white/10 pb-2 pt-2">
            🏆 Pilar Endgame
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              { name: 'Forgotten Hall (MoC)', floor: d.moc_floor, stars: d.moc_stars, is_starward: d.moc_is_starward },
              { name: 'Pure Fiction', floor: d.pf_floor, stars: d.pf_stars, is_starward: d.pf_is_starward },
              { name: 'Apocalyptic Shadow', floor: d.apc_floor, stars: d.apc_stars, is_starward: d.apc_is_starward },
            ].map((mode, i) => (
              <div key={i} className="flex justify-between items-center bg-black/40 border border-purple-500/20 rounded-lg px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-300">{mode.name}</span>
                    {mode.is_starward && (
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        Starward
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-amber-400 mt-1">{mode.floor}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-bold bg-purple-900/40 px-3 py-1 rounded-full border border-purple-500/30">
                  <span>{mode.stars}</span>
                  <span className="text-xs">★</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
