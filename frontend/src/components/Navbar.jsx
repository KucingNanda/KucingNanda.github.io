import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Image as ImageIcon, Gamepad2, User, Menu, X, Settings } from 'lucide-react';

const Navbar = ({ apiStatus }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Gallery', path: '/gallery', icon: <ImageIcon size={18} /> },
        { name: 'Gaming', path: '/gaming', icon: <Gamepad2 size={18} /> },
        { name: 'About', path: '/about', icon: <User size={18} /> },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-[#8B5CF6] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                        <span className="font-bold text-xl italic text-white">G</span>
                    </div>
                    <span className="font-bold text-xl tracking-tighter text-white">
                        KUCINGABU<span className="text-[#00F5FF]">HUB</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-[#00F5FF]' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {link.icon} {link.name}
                        </Link>
                    ))}
                    {localStorage.getItem('token') && (
                        <Link
                            to="/admin"
                            className={`flex items-center gap-2 text-sm font-bold transition-colors ${location.pathname === '/admin' ? 'text-[#8B5CF6]' : 'text-[#8B5CF6]/70 hover:text-[#8B5CF6]'}`}
                        >
                            <Settings size={18} /> Admin Panel
                        </Link>
                    )}
                </div>

                {/* API Status Indicator */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                        <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
                        {apiStatus}
                    </div>
                    <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-24 left-6 right-6 bg-[#111827] border border-white/10 rounded-2xl p-6 md:hidden shadow-2xl"
                    >
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-4 py-3 text-gray-300 hover:text-[#00F5FF]"
                            >
                                {link.icon} {link.name}
                            </Link>
                        ))}
                        {localStorage.getItem('token') && (
                            <Link
                                to="/admin"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-4 py-3 font-bold text-[#8B5CF6] hover:text-[#7c4dff]"
                            >
                                <Settings size={18} /> Admin Panel
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;