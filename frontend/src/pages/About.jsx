import React, { useState, useEffect } from 'react';
import { User, Code, Layers, Palette, Server, Database, Shield, Wand2, Loader2, Cpu, Monitor, FileCode2, Terminal, PenTool, LayoutTemplate, Smartphone } from 'lucide-react';
import { apiService } from '../services/api';

// Mapping string icon ke komponen lucide-react
const IconMap = {
  "Code": <Code size={20} />,
  "Layers": <Layers size={20} />,
  "Palette": <Palette size={20} />,
  "Server": <Server size={20} />,
  "Database": <Database size={20} />,
  "Shield": <Shield size={20} />,
  "Wand2": <Wand2 size={20} />,
  "Cpu": <Cpu size={20} />,
  "Monitor": <Monitor size={20} />,
  "FileCode2": <FileCode2 size={20} />,
  "Terminal": <Terminal size={20} />,
  "PenTool": <PenTool size={20} />,
  "LayoutTemplate": <LayoutTemplate size={20} />,
  "Smartphone": <Smartphone size={20} />
};

// Default fallback jika DB kosong
const defaultStack = [
  { category: "Frontend Core", stack: "React 19 + Vite", desc: "Rendering UI yang sangat cepat dan reaktif.", icon: "Layers" },
  { category: "Styling System", stack: "Tailwind CSS v3", desc: "Desain utilitas responsif dengan glassmorphism.", icon: "Palette" },
  { category: "Backend Engine", stack: "Golang + Gin", desc: "Arsitektur REST API dengan performa maksimal.", icon: "Server" },
  { category: "Data Layer", stack: "MySQL + GORM", desc: "Manajemen relasi database yang aman & otomatis.", icon: "Database" },
  { category: "Security", stack: "JWT Auth & Bcrypt", desc: "Sistem enkripsi sandi dan token untuk rute Admin.", icon: "Shield" },
  { category: "Micro-Animations", stack: "Framer Motion", desc: "Transisi interaktif dan pergerakan elemen dinamis.", icon: "Wand2" }
];

const About = () => {
  const [profile, setProfile] = useState(null);
  const [techStack, setTechStack] = useState(defaultStack);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProfile();
        let profileData = null;
        if (Array.isArray(data) && data.length > 0) {
          profileData = data[0];
        } else if (data && !Array.isArray(data)) {
          profileData = data;
        }

        if (profileData) {
          setProfile(profileData);
          if (profileData.tech_stack) {
            try {
              const parsed = JSON.parse(profileData.tech_stack);
              if (Array.isArray(parsed)) {
                setTechStack(parsed);
              }
            } catch (e) {
              console.error("tech_stack bukan format JSON Array yang valid");
            }
          }
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
            <h3 className="text-2xl font-bold flex items-center gap-3"><Code className="text-[#00F5FF]" /> Project Architecture</h3>
            <p className="text-gray-400 text-sm">Personal Hub ini dirancang dari awal menggunakan kombinasi teknologi Fullstack modern untuk menghadirkan performa secepat kilat dan antarmuka cyberpunk/futuristik.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {techStack.map((item, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4 hover:bg-white/10 hover:border-[#00F5FF]/40 transition-all duration-300 group cursor-default">
                  <div className="text-[#00F5FF] mt-1 bg-[#00F5FF]/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,245,255,0.1)]">
                    {IconMap[item.icon] || <Code size={20} />}
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8B5CF6] uppercase font-mono tracking-widest mb-1">{item.category}</p>
                    <p className="font-bold text-base text-white">{item.stack}</p>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{item.desc}</p>
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
