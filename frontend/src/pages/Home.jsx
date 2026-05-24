import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Palette, Gamepad2, User, Cpu, Activity, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import AudioPlayer from '../components/AudioPlayer';

const Home = ({ apiStatus }) => {
    const [profile, setProfile] = useState(null);
    const [latestGalleries, setLatestGalleries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Profile
                const profileData = await apiService.getProfile();
                if (Array.isArray(profileData) && profileData.length > 0) {
                    setProfile(profileData[0]);
                } else if (profileData && !Array.isArray(profileData)) {
                    setProfile(profileData);
                }

                // Fetch Gallery for Latest Uploads
                const galleryData = await apiService.getGallery();
                if (Array.isArray(galleryData)) {
                    setLatestGalleries(galleryData.slice(0, 4));
                }
            } catch (err) {
                console.error("Failed to fetch data in Home:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
                        <h3 className="text-3xl font-bold mb-2">Media Gallery</h3>
                        <p className="text-gray-400">Pameran visual dan kreasi digital.</p>
                    </Link>

                    <Link to="/gaming" className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-end relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <Gamepad2 className="absolute top-6 right-6 text-[#00F5FF] opacity-20 group-hover:opacity-100 transition-opacity" size={40} />
                        <h3 className="text-2xl font-bold">Gaming Corner</h3>
                        <span className="text-[#00F5FF] font-bold mt-2 flex items-center gap-2 group-hover:gap-3 transition-all">View Stats <ArrowUpRight size={16} /></span>
                    </Link>

                    <Link to="/about" className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-end group hover:bg-white/10 transition-colors relative overflow-hidden">
                        <User className="absolute top-6 right-6 text-gray-500 opacity-20 group-hover:text-[#8B5CF6] transition-opacity" size={40} />
                        <h3 className="text-2xl font-bold">About & Tech Stack</h3>
                        <span className="text-[#8B5CF6] font-bold mt-2 flex items-center gap-2 group-hover:gap-3 transition-all">Discover <ArrowUpRight size={16} /></span>
                    </Link>
                </div>
            </section>

            {/* Latest Gallery Section */}
            <section className="py-20 border-t border-white/5">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-black mb-2">Latest <span className="text-[#8B5CF6]">Uploads</span></h2>
                        <p className="text-gray-400">Karya terbaru dari galeri.</p>
                    </div>
                    <Link to="/gallery" className="hidden md:flex items-center gap-2 text-sm font-bold text-[#00F5FF] hover:text-white transition-colors">
                        View Full Gallery <ArrowUpRight size={16} />
                    </Link>
                </div>

                {latestGalleries.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {latestGalleries.map((item) => (
                            <Link to="/gallery" key={item.id} className="aspect-square bg-white/5 border border-white/10 rounded-2xl overflow-hidden group relative">
                                {item.image_url ? (
                                    <img 
                                        src={item.image_url} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Palette className="text-white/10 group-hover:scale-110 transition-transform" size={40} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                                    <p className="text-[#00F5FF] font-mono text-[10px] uppercase mb-1">{item.info || 'Uncategorized'}</p>
                                    <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-gray-500">Belum ada karya yang diunggah.</p>
                    </div>
                )}
                <div className="mt-6 text-center md:hidden">
                    <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-bold text-[#00F5FF] hover:text-white transition-colors">
                        View Full Gallery <ArrowUpRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Floating Audio Player */}
            <AudioPlayer />
        </div>
    );
};

export default Home;