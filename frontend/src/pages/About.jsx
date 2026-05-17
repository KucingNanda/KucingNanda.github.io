import React, { useState, useEffect } from 'react';
import { User, Monitor, Cpu, Zap, HardDrive, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProfile();
        if (Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
        } else if (data && !Array.isArray(data)) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Gagal memuat profil dari server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#8B5CF6]" size={48} />
        </div>
      ) : error ? (
        <div className="text-red-500 py-10 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-md mx-auto text-center">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <User size={150} />
            </div>
            <div className="w-32 h-32 rounded-3xl bg-[#8B5CF6] mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              <User size={60} className="text-white" />
            </div>
            <h3 className="text-2xl font-black mb-1">{profile?.nickname || 'GamerName'}</h3>
            <p className="text-[#8B5CF6] font-mono text-xs uppercase tracking-widest mb-6">{profile?.current_status || 'Digital Alchemist'}</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {profile?.bio || 'Menyukai desain futuristik, eksplorasi teknologi AI, dan menghabiskan waktu di Teyvat atau Night City.'}
            </p>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3"><Monitor className="text-[#00F5FF]" /> Device Setup</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { l: "CPU", v: "Ryzen 7 5800X", i: <Cpu size={18} /> },
                { l: "GPU", v: "RTX 3070 Ti", i: <Zap size={18} /> },
                { l: "RAM", v: "32GB DDR4", i: <HardDrive size={18} /> },
                { l: "Display", v: "27\" 165Hz", i: <Monitor size={18} /> }
              ].map((s, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 hover:border-[#00F5FF]/30 transition-colors">
                  <div className="text-[#00F5FF]">{s.i}</div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-mono">{s.l}</p>
                    <p className="font-bold text-sm">{s.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
