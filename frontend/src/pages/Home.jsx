import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Palette, Gamepad2, User, Cpu, Activity } from 'lucide-react';

const Home = ({ apiStatus }) => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <section className="text-center py-20">
                <div className="px-4 py-1 border border-white/10 rounded-full inline-flex items-center gap-2 mb-8 bg-white/5">
                    <Activity size={14} className={apiStatus === 'online' ? 'text-[#00F5FF]' : 'text-red-500'} />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                        System: {apiStatus === 'online' ? 'Operational' : 'Disconnected'}
                    </span>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-8xl font-black mb-6 leading-tight"
                >
                    GAMER <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        PERSONAL HUB
                    </span>
                </motion.h1>

                <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-12">
                    Digital sanctuary untuk hobi, AI Art, dan statistik gaming Anda dalam satu dashboard futuristik.
                </p>

                {/* Bento Grid Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
                    <Link to="/gallery" className="md:col-span-2 md:row-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 min-h-[300px] flex flex-col justify-end relative overflow-hidden group">
                        <Palette className="absolute top-6 right-6 text-[#8B5CF6] opacity-20 group-hover:opacity-100 transition-opacity" size={60} />
                        <h3 className="text-3xl font-bold mb-2">AI Gallery</h3>
                        <p className="text-gray-400">Pameran visual masa depan.</p>
                    </Link>

                    <Link to="/gaming" className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-end relative overflow-hidden group">
                        <Gamepad2 className="absolute top-6 right-6 text-[#00F5FF] opacity-20 group-hover:opacity-100 transition-opacity" size={40} />
                        <h3 className="text-2xl font-bold">Gaming Corner</h3>
                        <span className="text-[#00F5FF] font-bold mt-2 flex items-center gap-2">View Stats <ArrowUpRight size={16} /></span>
                    </Link>

                    <Link to="/about" className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-end group">
                        <User className="text-gray-500 mb-4 group-hover:text-white transition-colors" />
                        <span className="font-bold">About</span>
                    </Link>

                    <Link to="/about" className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-end group">
                        <Cpu className="text-[#00F5FF] mb-4 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-[#00F5FF]">Specs</span>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;