import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Palette, Gamepad2, User, Cpu, Activity, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

const Home = ({ apiStatus }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiService.getProfile();
                if (Array.isArray(data) && data.length > 0) {
                    setProfile(data[0]);
                } else if (data && !Array.isArray(data)) {
                    setProfile(data);
                }
            } catch (err) {
                console.error("Failed to fetch profile in Home:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <section className="text-center py-20 relative min-h-[60vh] flex flex-col justify-center">
                <div className="px-4 py-1 border border-white/10 rounded-full inline-flex items-center gap-2 mb-8 bg-white/5 mx-auto">
                    <Activity size={14} className={apiStatus === 'online' ? 'text-[#00F5FF]' : 'text-red-500'} />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                        System: {apiStatus === 'online' ? 'Operational' : 'Disconnected'}
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="animate-spin text-[#8B5CF6]" size={48} />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight uppercase tracking-tighter">
                            {profile?.nickname || 'KUCINGABU'} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                PERSONAL HUB
                            </span>
                        </h1>

                        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-12">
                            {profile?.bio || 'Digital sanctuary untuk hobi, AI Art, dan statistik gaming Anda dalam satu dashboard futuristik.'}
                        </p>
                    </motion.div>
                )}

                {/* Bento Grid Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left mt-8">
                    <Link to="/gallery" className="md:col-span-2 md:row-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 min-h-[300px] flex flex-col justify-end relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <Palette className="absolute top-6 right-6 text-[#8B5CF6] opacity-20 group-hover:opacity-100 transition-opacity" size={60} />
                        <h3 className="text-3xl font-bold mb-2">AI Gallery</h3>
                        <p className="text-gray-400">Pameran visual masa depan.</p>
                    </Link>

                    <Link to="/gaming" className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-end relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <Gamepad2 className="absolute top-6 right-6 text-[#00F5FF] opacity-20 group-hover:opacity-100 transition-opacity" size={40} />
                        <h3 className="text-2xl font-bold">Gaming Corner</h3>
                        <span className="text-[#00F5FF] font-bold mt-2 flex items-center gap-2 group-hover:gap-3 transition-all">View Stats <ArrowUpRight size={16} /></span>
                    </Link>

                    <Link to="/about" className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-end group hover:bg-white/10 transition-colors">
                        <User className="text-gray-500 mb-4 group-hover:text-[#8B5CF6] transition-colors" size={32} />
                        <span className="font-bold text-white group-hover:text-[#8B5CF6] transition-colors">About Me</span>
                    </Link>

                    <Link to="/about" className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-end group hover:bg-white/10 transition-colors">
                        <Cpu className="text-gray-500 mb-4 group-hover:text-[#00F5FF] transition-colors" size={32} />
                        <span className="font-bold text-white group-hover:text-[#00F5FF] transition-colors">Tech Stack</span>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;